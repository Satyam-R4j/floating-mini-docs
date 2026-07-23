import React from "react";

function Background() {
  return (
    <>
      <div className="fixed z-[2] w-full h-screen select-none pointer-events-none">
        <div className="absolute top-[5%] w-full py-6 flex flex-col items-center justify-center text-zinc-600 font-semibold gap-1 px-4">
          <span className="text-xl tracking-wider">Doddle Docs.</span>
          <span className="text-xs text-zinc-600 font-medium tracking-wide bg-zinc-900/10 border border-zinc-800/5 px-4 py-1.5 rounded-full text-center max-w-[90%] md:max-w-none">
            <span className="hidden md:inline">Drag to arrange workspace • Hover card controls to edit or delete</span>
            <span className="inline md:hidden">Tap card controls to edit or delete</span>
          </span>
        </div>
        <h1 className="absolute top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%] text-[12vw] leading-none tracking-tight font-semibold text-zinc-900/80">
          Doddle.
        </h1>
      </div>
    </>
  );
}

export default Background;
