import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IoClose } from "react-icons/io5";
import { FaRegFileAlt } from "react-icons/fa";

const PRESETS = {
  colors: [
    { name: "Emerald Green", value: "bg-emerald-600", border: "border-emerald-500" },
    { name: "Ocean Blue", value: "bg-blue-600", border: "border-blue-500" },
    { name: "Rose Red", value: "bg-rose-600", border: "border-rose-500" },
    { name: "Amber Orange", value: "bg-amber-600", border: "border-amber-500" },
    { name: "Amethyst Purple", value: "bg-violet-600", border: "border-violet-500" },
  ]
};

const DocModal = ({ isOpen, onClose, onSave, editData }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [close, setClose] = useState(false);
  const [tagOpen, setTagOpen] = useState(true);
  const [tagTitle, setTagTitle] = useState("");
  const [tagColor, setTagColor] = useState("bg-emerald-600");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDesc(editData.desc || "");
      setFileSize(editData.fileSize || ".4mb");
      setClose(!!editData.close);
      setTagOpen(editData.tag ? !!editData.tag.isOpen : true);
      setTagTitle(editData.tag ? editData.tag.tagTitle || "" : "");
      setTagColor(editData.tag ? editData.tag.tagColor || "bg-emerald-600" : "bg-emerald-600");
      setFile(null);
      setIsDragging(false);
    } else {
      setTitle("");
      setDesc("");
      setFileSize(".5mb");
      setClose(false);
      setTagOpen(true);
      setTagTitle("Download Now");
      setTagColor("bg-emerald-600");
      setFile(null);
      setIsDragging(false);
    }
  }, [editData, isOpen]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);

    // Smart autofill Title
    const extIndex = selectedFile.name.lastIndexOf(".");
    const nameWithoutExt = extIndex > 0 ? selectedFile.name.substring(0, extIndex) : selectedFile.name;
    setTitle(nameWithoutExt.substring(0, 40));

    // Smart autofill Size
    const bytes = selectedFile.size;
    let computedSize = ".5mb";
    if (bytes < 1024 * 1024) {
      computedSize = (bytes / 1024).toFixed(1) + "kb";
    } else {
      computedSize = (bytes / (1024 * 1024)).toFixed(1) + "mb";
    }
    setFileSize(computedSize);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    const documentData = {
      _id: editData ? (editData._id || editData.id) : undefined,
      id: editData ? (editData.id || editData._id) : undefined,
      title: title.trim(),
      desc: desc.trim(),
      fileSize: fileSize.trim() || ".5mb",
      close,
      tag: {
        isOpen: tagOpen,
        tagTitle: tagOpen ? (tagTitle.trim() || "Download Now") : "",
        tagColor,
      },
      file, // Include raw binary file
    };

    onSave(documentData);
    onClose();
  };

  // Handle closing modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-lg max-h-[85vh] md:max-h-[90vh] flex flex-col overflow-hidden rounded-[24px] md:rounded-[30px] bg-zinc-950/90 border border-zinc-800/80 shadow-2xl p-4 md:p-8 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-zinc-900 text-emerald-400">
                  <FaRegFileAlt size="1.2em" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {editData ? "Edit Document Card" : "Create Mini-Doc Card"}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors duration-150"
              >
                <IoClose size="1.2em" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 py-1">
                {/* Premium Drag and Drop Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 ml-1">
                  Attach Document / File (Optional)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-4 md:py-6 px-4 text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-emerald-400 bg-emerald-950/20 shadow-lg shadow-emerald-950/10"
                      : file
                      ? "border-emerald-500/50 bg-zinc-900/40"
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10"
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 select-none">
                    <div className={`p-2.5 rounded-xl transition-colors duration-150 ${
                      file ? "bg-emerald-600/20 text-emerald-400" : "bg-zinc-800/80 text-zinc-400"
                    }`}>
                      <FaRegFileAlt size="1.4em" />
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-emerald-400 line-clamp-1 max-w-[280px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          File successfully loaded ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                      </div>
                    ) : editData && editData.hasFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-amber-400 line-clamp-1 max-w-[280px]">
                          📎 {editData.originalName || "Attached File"}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          Drag/click to replace existing document file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">
                          Drag and drop file here, or <span className="text-emerald-400 hover:underline">browse</span>
                        </p>
                        <p className="text-[10px] text-zinc-600 mt-1">
                          Supports PDF, Word, Excel, Images, Text (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Title */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-300">
                    File / Card Title
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    {title.length}/40 chars
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={40}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Design Specs, Sprint Guide"
                  className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 py-3 px-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-zinc-300">
                    Card Description
                  </label>
                  <span className="text-[11px] text-zinc-500">
                    {desc.length}/180 chars
                  </span>
                </div>
                <textarea
                  required
                  maxLength={180}
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Enter the document synopsis or note..."
                  className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 p-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 resize-none"
                />
              </div>

              {/* Grid: File Size and Action Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Estimated File Size
                  </label>
                  <input
                    type="text"
                    required
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="e.g. 0.8mb, 2.4mb"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 transition-all duration-200"
                  />
                </div>

                {/* Close status vs Download status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Action Button Icon
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setClose(false)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        !close
                          ? "bg-zinc-800 text-emerald-400 shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Download Icon
                    </button>
                    <button
                      type="button"
                      onClick={() => setClose(true)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        close
                          ? "bg-zinc-800 text-rose-400 shadow-sm"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Close Icon
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-zinc-900/60 pt-2" />

              {/* Tag Display Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-zinc-300">
                    Bottom Action Tag
                  </span>
                  <p className="text-xs text-zinc-500">
                    Display a colored banner at the card bottom
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTagOpen(!tagOpen)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    tagOpen ? "bg-emerald-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      tagOpen ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Animated Tag Section */}
              <AnimatePresence>
                {tagOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Tag Title */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Tag Title / Action Text
                      </label>
                      <input
                        type="text"
                        value={tagTitle}
                        onChange={(e) => setTagTitle(e.target.value)}
                        placeholder="e.g. Download Now, Uploading..."
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-2.5 px-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 transition-all duration-200"
                      />
                    </div>

                    {/* Tag Color selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        Tag Color Palette
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {PRESETS.colors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setTagColor(color.value)}
                            title={color.name}
                            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white border transition-all duration-150 ${color.value} ${
                              tagColor === color.value
                                ? "ring-2 ring-white scale-105 border-transparent"
                                : "border-zinc-700/50 opacity-75 hover:opacity-100"
                            }`}
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                            {color.name.split(" ")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Fixed Pinned Action Buttons Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 mt-5 flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-zinc-800 hover:border-zinc-700/80 hover:bg-zinc-900/40 py-2.5 px-5 text-sm font-medium transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-950/20 text-white font-semibold py-2.5 px-6 text-sm transition-all duration-150 cursor-pointer"
                >
                  {editData ? "Update Document" : "Add to Dashboard"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DocModal;
