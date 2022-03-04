import React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const portal = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        🧙‍♂️ Kablammy 🌬️🌒💫✨⚡️
        </div>

        <div className="bio">
        I am a Wizard who travels the Zuvuya.  Connect your Ethereum wallet and open 1 or more portals to send a spell of manifestation and you might receive a gift through the portal.
        </div>

        <button className="portalButton" onClick={portal}>
          Cast a spell
        </button>
      </div>
    </div>
  );
}
