import React, { useState } from "react";
import Background from "./components/Background";
import Foreground from "./components/Foreground";
import LandingPage from "./components/LandingPage";

function App() {
  const [view, setView] = useState("landing");

  const handleLaunchApp = () => {
    setView("workspace");
  };

  const handleNavigateHome = () => {
    setView("landing");
  };

  if (view === "landing") {
    return (
      <LandingPage
        onLaunchApp={handleLaunchApp}
        onOpenAuth={handleLaunchApp}
      />
    );
  }

  return (
    <div className="relative w-full h-screen font-['Poppins'] bg-zinc-800">
      <Background />
      <Foreground onNavigateHome={handleNavigateHome} />
    </div>
  );
}

export default App;
