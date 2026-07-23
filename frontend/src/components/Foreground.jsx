import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LuPlus, LuSearch, LuUser, LuLogOut, LuHouse } from "react-icons/lu";
import Card from "./Card";
import DocModal from "./DocModal";
import { useAuth } from "../context/AuthContext";
import AuthScreen from "./AuthScreen";
import ProfileModal from "./ProfileModal";

const safeJson = async (response) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.warn("Malformed JSON response ignored:", e.message);
    return null;
  }
};

function Foreground({ onNavigateHome }) {
  const ref = useRef(null);
  const { user, loading, authFetch, logout } = useAuth();
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch documents from backend scoped database
  const fetchDocs = async () => {
    try {
      const response = await authFetch("/api/docs");
      if (response.ok) {
        const data = await safeJson(response);
        if (data) {
          setDocs(data);
        }
      }
    } catch (e) {
      console.error("Error retrieving Mongoose documents:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocs();
    } else {
      setDocs([]);
    }
  }, [user]);

  const handleAddOrUpdate = async (docData) => {
    try {
      const formData = new FormData();
      formData.append("title", docData.title);
      formData.append("desc", docData.desc);
      formData.append("fileSize", docData.fileSize);
      formData.append("close", docData.close);
      formData.append("tag", JSON.stringify(docData.tag));

      if (docData.file) {
        formData.append("file", docData.file);
      }

      if (editData) {
        // Update existing document in Mongoose
        const response = await authFetch(`/api/docs/${docData._id || docData.id}`, {
          method: "PUT",
          body: formData,
        });

        if (response.ok) {
          const updatedDoc = await safeJson(response);
          if (updatedDoc) {
            setDocs(docs.map((doc) => ((doc._id === updatedDoc._id || doc.id === updatedDoc.id) ? updatedDoc : doc)));
          }
        }
      } else {
        // Create new document in Mongoose
        const response = await authFetch("/api/docs", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newDoc = await safeJson(response);
          if (newDoc) {
            setDocs([newDoc, ...docs]);
          }
        }
      }
    } catch (e) {
      console.error("Error creating/updating Mongoose document:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(`/api/docs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDocs(docs.filter((doc) => doc._id !== id && doc.id !== id));
      }
    } catch (e) {
      console.error("Error deleting Mongoose document:", e);
    }
  };

  const handleEditInitiate = (doc) => {
    setEditData(doc);
    setIsModalOpen(true);
  };

  const handleAddNewInitiate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  // Live filter docs by title, description or tag title
  const filteredDocs = docs.filter((doc) => {
    const titleMatch = doc.title && doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = doc.desc && doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const tagMatch = doc.tag && doc.tag.isOpen && doc.tag.tagTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch || tagMatch;
  });

  // Calculate statistics
  const totalDocs = docs.length;
  const downloadActions = docs.filter((d) => !d.close).length;
  const activeTags = docs.filter((d) => d.tag && d.tag.isOpen).length;

  const calculateTotalSize = () => {
    let totalBytes = 0;
    docs.forEach((doc) => {
      const sizeStr = doc.fileSize ? doc.fileSize.toLowerCase() : "";
      const value = parseFloat(sizeStr);
      if (isNaN(value)) return;

      if (sizeStr.includes("mb")) {
        totalBytes += value * 1024 * 1024;
      } else if (sizeStr.includes("kb")) {
        totalBytes += value * 1024;
      } else {
        totalBytes += value;
      }
    });

    if (totalBytes < 1024 * 1024) {
      return (totalBytes / 1024).toFixed(1) + " KB";
    }
    return (totalBytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalSize = calculateTotalSize();

  if (loading) {
    return (
      <div className="fixed top-0 left-0 z-50 w-full h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <span className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <h5 className="text-zinc-500 text-sm font-semibold tracking-wider font-['Poppins'] animate-pulse">
          Initializing Doddle Workspace...
        </h5>
      </div>
    );
  }

  // Force authenticating if unauthenticated
  if (!user) {
    return <AuthScreen />;
  }

  return (
    <div ref={ref} className="fixed top-0 left-0 z-[3] w-full h-full text-white flex flex-col p-3 sm:p-6 overflow-hidden">
      
      {/* Dynamic Glassmorphic Navigation & Stats Header */}
      <div className="w-full max-w-6xl mx-auto z-10 mb-4 md:mb-8 flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between p-3 md:p-4 rounded-[24px] md:rounded-3xl bg-zinc-950/40 border border-zinc-800/40 backdrop-blur-md">
        
        {/* Statistics Badges & User Session details */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
          <img 
            src="/logo.png" 
            alt="Doddle Docs Logo" 
            onClick={onNavigateHome}
            className="h-10 sm:h-12 w-auto object-contain drop-shadow-md cursor-pointer hover:scale-105 transition-transform" 
            title="Back to Product Home Page"
          />

          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-emerald-400 cursor-pointer transition-all active:scale-95"
            title="Product Features & Overview"
          >
            <LuHouse size="1.1em" />
            <span className="hidden md:inline">Product Info</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold cursor-pointer transition-all duration-150 active:scale-[0.97]"
            title="View Workspace Profile"
          >
            <LuUser size="1.1em" className="text-emerald-400" />
            <span className="text-zinc-400">Workspace:</span>
            <span className="text-emerald-400 font-bold">{user.username}</span>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-zinc-400">Total:</span>
            <span className="text-indigo-400 font-bold">{totalDocs}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-400">Downloads:</span>
            <span className="text-emerald-400 font-bold">{downloadActions}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-zinc-400">Tagged:</span>
            <span className="text-amber-400 font-bold">{activeTags}</span>
          </div>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LuLogOut size="1.05em" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Real-time Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <LuSearch size="1.1em" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, descriptions..."
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 transition-colors duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-zinc-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Area (Drag Area Container) */}
      <div className="flex-1 w-full relative overflow-hidden">
        {filteredDocs.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
            <p className="text-lg font-medium">No documents match your query.</p>
            <p className="text-sm mt-1">Try creating a new document or clearing search filter.</p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-wrap gap-4 md:gap-6 p-2 md:p-4 justify-center md:justify-start content-start overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((item) => (
                <Card
                  key={item._id || item.id}
                  data={item}
                  reference={ref}
                  onDelete={handleDelete}
                  onEdit={handleEditInitiate}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Premium Floating Action Button (FAB) for adding Doc */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddNewInitiate}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg cursor-pointer transition-colors hover:bg-emerald-500 focus:outline-none"
        title="Add New Card"
      >
        <LuPlus className="text-[1.5em] md:text-[1.8em] transition-transform duration-300 hover:rotate-90" />
      </motion.button>

      {/* Creation and Editing Modal */}
      <DocModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrUpdate}
        editData={editData}
      />

      {/* Workspace Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        totalDocs={totalDocs}
        totalSize={totalSize}
      />
    </div>
  );
}

export default Foreground;

