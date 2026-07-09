import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { LuDownload, LuPencil, LuTrash2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { motion } from "motion/react";

const Card = ({ data, reference, onDelete, onEdit }) => {
  // Extract file extension to render custom visual badge
  const getFileExtension = () => {
    if (!data.hasFile || !data.originalName) return "";
    const parts = data.originalName.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
  };

  const fileExt = getFileExtension();

  // Programmatic high-fidelity file downloader
  const handleDownload = (e) => {
    e.stopPropagation();
    if (data.hasFile && data.filePath) {
      const link = document.createElement("a");
      link.href = `http://localhost:5000/${data.filePath}`;
      link.download = data.originalName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      drag
      dragConstraints={reference}
      whileDrag={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)" }}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      layout
      className="card group relative cursor-pointer flex-shrink-0 w-44 h-56 sm:w-48 sm:h-60 md:w-60 md:h-72 rounded-[28px] sm:rounded-[32px] md:rounded-[40px] bg-zinc-900/85 backdrop-blur-sm p-3.5 sm:p-4 md:p-5 overflow-hidden border border-zinc-800/80 hover:border-zinc-700/50 shadow-lg transition-colors duration-300"
    >
      <div className="flex justify-between items-center text-zinc-400">
        <FaRegFileAlt size="1.1em" />
        {/* Action overlay buttons appearing on hover */}
        <div className="flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(data);
            }}
            className="p-1.5 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors duration-150"
            title="Edit Document"
          >
            <LuPencil size="0.8em" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data._id || data.id);
            }}
            className="p-1.5 rounded-full bg-zinc-800/90 hover:bg-red-950/80 text-zinc-400 hover:text-red-400 transition-colors duration-150"
            title="Delete Document"
          >
            <LuTrash2 size="0.8em" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[85px] sm:max-h-[105px] md:max-h-[140px] mt-2.5 md:mt-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        <h4 className="text-xs sm:text-sm font-extrabold text-zinc-100 mb-1.5 tracking-tight border-b border-zinc-800/60 pb-1.5 break-words flex items-center justify-between gap-2">
          <span className="line-clamp-1 flex-1">{data.title || "Untitled Card"}</span>
          {fileExt && (
            <span className="text-[8px] font-black bg-zinc-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md flex-shrink-0 tracking-wider">
              {fileExt}
            </span>
          )}
        </h4>
        <p className="text-[11px] sm:text-xs md:text-[13px] font-medium leading-relaxed text-zinc-300 break-words">
          {data.desc}
        </p>
      </div>

      <div className="footer absolute bottom-0 w-full left-0">
        <div className="flex items-center justify-between py-2.5 px-4 sm:py-3 sm:px-5 md:py-4 md:px-6 mb-0.5 md:mb-1">
          <h5 className="text-[10px] sm:text-xs text-zinc-400 font-medium">{data.fileSize}</h5>
          <span 
            onClick={handleDownload}
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-zinc-200 transition-colors duration-150 ${
              data.hasFile 
                ? "bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-zinc-950 cursor-pointer" 
                : "bg-zinc-800 text-zinc-400"
            }`}
            title={data.hasFile ? `Download: ${data.originalName}` : "No file attached"}
          >
            {data.close ? (
              <IoClose size="0.9em" />
            ) : (
              <LuDownload size="0.85em" />
            )}
          </span>
        </div>

        {data.tag.isOpen && (
          <div className={`tag w-full py-2.5 md:py-3.5 ${data.tag.tagColor} flex items-center justify-center transition-all duration-300`}>
            <h3 className="text-[10px] sm:text-xs font-semibold text-white tracking-wider uppercase">{data.tag.tagTitle}</h3>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;

