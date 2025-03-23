import React,{useRef} from "react";
import Card from "./Card";


function Foreground() {
  const ref = useRef(null)
  const data = [
    {
      desc: "Lorem, ipsum dolor sat sasdfasdfasdfit amet consectetur adipisicing",
      fileSize: ".9mb",
      close: false,
      tag: {
        isOpen: true,
        tagTitle: "Download now",
        tagColor: "bg-green-600",
      },
    },
    {
      desc: "Lorem, ipsum dolor sat sasdfasdfasdfit amet consectetur adipisicing",
      fileSize: ".3mb",
      close: true,
      tag: {
        isOpen: true,
        tagTitle: "Download now",
        tagColor: "bg-red-600",
      },
    },
    {
      desc: "Lorem, ipsum dolor sat sasdfasdfasdfit amet consectetur adipisicing",
      fileSize: ".0mb",
      close: true,
      tag: { 
        isOpen: true,
        tagTitle: "Upload",
        tagColor: "bg-yellow-600",
      },
    },
  ];

  return (
    <div ref={ref} className="fixed top-0 left-0 z-[3] w-full h-full text-white gap-5 p-5 flex flex-wrap">
      {data.map((item, index) => (
        <Card data={item} reference={ref}/>
      ))}
    </div>
  );
}

export default Foreground;
