import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { motion } from "motion/react"

const Card = (props, reference) => {
  return (
    <motion.div drag dragConstraints={reference} className="card relative cursor-pointer flex-shrink-0 w-60 h-72 rounded-[40px] bg-zinc-900/90 p-5 overflow-hidden">
      <FaRegFileAlt />
      <p className="text-sm mt-5 font-semibold leading-tight">
        {props.data.desc}
      </p>
      <div className="footer absolute  bottom-0  w-full  left-0">
        <div className="flex items-center justify-between py-5 px-5 mb-2">
          <h5>{props.data.fileSize}</h5>
          <span className="w-7 h-7 bg-zinc-600 rounded-full flex items-center justify-center">
            {props.data.close ? (
              <IoClose />
            ) : (
              <LuDownload size=".7em" color="#fff" />
            )}
          </span>
        </div>

        {props.data.tag.isOpen && (
          <div className={`tag w-full py-4 ${props.data.tag.tagColor} flex items-center justify-center`}>
            <h3 className="tex-sm font-semibold">{props.data.tag.tagTitle}</h3>
          </div>
        ) }
      </div>
    </motion.div>
  );
};

export default Card;
