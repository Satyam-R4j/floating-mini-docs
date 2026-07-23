import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
      maxlength: [40, "Title cannot exceed 40 characters"],
    },
    desc: {
      type: String,
      required: [true, "Document description is required"],
      trim: true,
      maxlength: [180, "Description cannot exceed 180 characters"],
    },
    fileSize: {
      type: String,
      default: ".5mb",
      trim: true,
    },
    close: {
      type: Boolean,
      default: false,
    },
    tag: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      tagTitle: {
        type: String,
        default: "Download Now",
        trim: true,
      },
      tagColor: {
        type: String,
        default: "bg-emerald-600",
        trim: true,
      },
    },
    filePath: {
      type: String,
      trim: true,
    },
    originalName: {
      type: String,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    hasFile: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;
