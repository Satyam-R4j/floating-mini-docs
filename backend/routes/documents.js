import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Document from "../models/Document.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Resolve ES Modules directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

// Configure Multer Storage for Uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const DEFAULT_DOCS = [
  {
    title: "React 19 Architecture",
    desc: "React 19 & Tailwind CSS v4 design architecture specifications. Review details about components, assets, and standard hooks integration.",
    fileSize: "1.2mb",
    close: false,
    tag: {
      isOpen: true,
      tagTitle: "High Priority",
      tagColor: "bg-rose-600",
    },
  },
  {
    title: "Framer Motion Guide",
    desc: "Complete documentation for Framer Motion v12. Covers spring animations, layout transitions, drag gestures, and physical boundary constraints.",
    fileSize: ".8mb",
    close: true,
    tag: {
      isOpen: true,
      tagTitle: "Completed",
      tagColor: "bg-emerald-600",
    },
  },
  {
    title: "State Synchronization",
    desc: "Local storage persistence design patterns for state synchronization across page loads and browser reloads. Used in floating docs component.",
    fileSize: ".4mb",
    close: false,
    tag: {
      isOpen: true,
      tagTitle: "In Progress",
      tagColor: "bg-amber-600",
    },
  },
];

// Apply Auth Middleware to all routes
router.use(authMiddleware);

// @route   GET /api/docs
// @desc    Get all user documents (Auto-seeds defaults if empty)
// @access  Private
router.get("/", async (req, res) => {
  try {
    let docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Auto-seed default cards for new users
    if (docs.length === 0) {
      const seededDocs = DEFAULT_DOCS.map((doc) => ({
        ...doc,
        user: req.user.id,
      }));
      
      await Document.insertMany(seededDocs);
      docs = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(docs);
  } catch (error) {
    console.error("Fetch docs error:", error.message);
    res.status(500).json({ message: "Server error fetching documents" });
  }
});

// @route   POST /api/docs
// @desc    Create a new document card (Supports multiform uploads)
// @access  Private
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, desc, fileSize } = req.body;

    if (!title || !desc) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Parse visual parameters
    const close = req.body.close === "true" || req.body.close === true;
    
    let tag = req.body.tag;
    if (typeof tag === "string") {
      try {
        tag = JSON.parse(tag);
      } catch (e) {
        tag = null;
      }
    }

    // Determine file characteristics
    let uploadedSize = fileSize || ".5mb";
    let filePath = "";
    let originalName = "";
    let mimeType = "";
    let hasFile = false;

    if (req.file) {
      originalName = req.file.originalname;
      mimeType = req.file.mimetype;
      filePath = "uploads/" + req.file.filename;
      hasFile = true;

      // Auto-compute size
      const bytes = req.file.size;
      if (bytes < 1024 * 1024) {
        uploadedSize = (bytes / 1024).toFixed(1) + "kb";
      } else {
        uploadedSize = (bytes / (1024 * 1024)).toFixed(1) + "mb";
      }
    }

    const newDoc = new Document({
      title: title.trim(),
      desc: desc.trim(),
      fileSize: uploadedSize,
      close,
      tag: {
        isOpen: tag ? !!tag.isOpen : true,
        tagTitle: tag ? tag.tagTitle || "Download Now" : "Download Now",
        tagColor: tag ? tag.tagColor || "bg-emerald-600" : "bg-emerald-600",
      },
      filePath,
      originalName,
      mimeType,
      hasFile,
      user: req.user.id,
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    console.error("Create doc error:", error.message);
    res.status(500).json({ message: "Server error creating document card" });
  }
});

// @route   PUT /api/docs/:id
// @desc    Update a document card (Supports multiform uploads)
// @access  Private
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { title, desc, fileSize } = req.body;
    
    let doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document card not found" });
    }

    // Verify card belongs to user
    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this card" });
    }

    // Parse parameters
    if (req.body.close !== undefined) {
      doc.close = req.body.close === "true" || req.body.close === true;
    }

    let tag = req.body.tag;
    if (typeof tag === "string") {
      try {
        tag = JSON.parse(tag);
      } catch (e) {
        tag = null;
      }
    }

    // Update fields
    if (title) doc.title = title.trim();
    if (desc) doc.desc = desc.trim();
    if (fileSize !== undefined) doc.fileSize = fileSize;
    if (tag) {
      doc.tag = {
        isOpen: tag.isOpen !== undefined ? tag.isOpen : doc.tag.isOpen,
        tagTitle: tag.tagTitle !== undefined ? tag.tagTitle.trim() : doc.tag.tagTitle,
        tagColor: tag.tagColor !== undefined ? tag.tagColor : doc.tag.tagColor,
      };
    }

    // If new file uploaded, swap original details and delete old file
    if (req.file) {
      // Delete old file if existed
      if (doc.filePath) {
        const oldPath = path.join(__dirname, "..", doc.filePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      doc.originalName = req.file.originalname;
      doc.mimeType = req.file.mimetype;
      doc.filePath = "uploads/" + req.file.filename;
      doc.hasFile = true;

      // Auto-compute size
      const bytes = req.file.size;
      if (bytes < 1024 * 1024) {
        doc.fileSize = (bytes / 1024).toFixed(1) + "kb";
      } else {
        doc.fileSize = (bytes / (1024 * 1024)).toFixed(1) + "mb";
      }
    }

    const updatedDoc = await doc.save();
    res.json(updatedDoc);
  } catch (error) {
    console.error("Update doc error:", error.message);
    res.status(500).json({ message: "Server error updating document card" });
  }
});

// @route   DELETE /api/docs/:id
// @desc    Delete a document card & physical file
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document card not found" });
    }

    // Verify card belongs to user
    if (doc.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to delete this card" });
    }

    // Delete associated physical file from disk
    if (doc.filePath) {
      const fullPath = path.join(__dirname, "..", doc.filePath);
      try {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.error("Failed to delete physical file from storage:", err.message);
      }
    }

    await Document.deleteOne({ _id: req.params.id });
    res.json({ message: "Document card and file removed successfully" });
  } catch (error) {
    console.error("Delete doc error:", error.message);
    res.status(500).json({ message: "Server error deleting document card" });
  }
});

export default router;
