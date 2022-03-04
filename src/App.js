import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  // check if wallet is connected if true set state to current address
  const IsWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Install Metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      //check for authorization to access wallet

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found authorized account: ", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Install Metamask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = () => {
    const { ethereum } = window;
    ethereum.handleDisconnect();
  };

  useEffect(() => {
    IsWalletConnected();
  });
  const portal = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">🧙‍♂️ Kablammy 🌬️🌒💫✨⚡️</div>

        <div className="bio">
          I am a Wizard who travels the Zuvuya. Connect your Ethereum wallet and
          open 1 or more portals to send a spell of manifestation and you might
          receive a gift through the portal.
        </div>

        <button className="portalButton" onClick={disconnect}>
          Cast a spell
        </button>

        {!currentAccount && (
          <button className="portalButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
