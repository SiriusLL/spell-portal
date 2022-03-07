import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/ActivationPortal.json";
import Loader from "./components/Loader";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalPortalsOpen, setTotalPortalsOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allPortals, setAllPortals] = useState([]);
  const [spell, setSpell] = useState("");

  const contractAddress = "0x6d193CdCea096a08fe677700586762abcb8583aB";
  const contractABI = abi.abi;
  console.log("abi", abi.abi);

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
        getAllPortals();
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
  }, []);

  const getAllPortals = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("munkey", PortalContract);
        const portals = await PortalContract.getAllPortals();
        console.log("portals", portals);

        let count = await PortalContract.getTotalPortalsOpen();
        setTotalPortalsOpen(count.toNumber());

        let portalsCleaned = [];
        portals.forEach((portal) => {
          portalsCleaned.push({
            address: portal.Activator,
            timestamp: new Date(portal.timestamp * 1000),
            message: portal.message,
          });
        });
        console.log("*****", portalsCleaned);
        setAllPortals(portalsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const portal = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        setIsLoading(true);
        let count = await PortalContract.getTotalPortalsOpen();
        console.log("Retrieved total portal count . . .", count.toNumber());

        const portalTxn = await PortalContract.activatePortal(spell, {
          gasLimit: 300000,
        });
        console.log("Mining...", portalTxn);

        await portalTxn.wait();
        console.log("Mined -- ", portalTxn.hash);

        count = await PortalContract.getTotalPortalsOpen();
        console.log("Retrieved total wave count...", count.toNumber());

        setTotalPortalsOpen(count.toNumber());
        setIsLoading(false);
        getAllPortals();
      } else {
        console.log("Ethereum object doesn't exsit!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessage = (e) => {
    // e.stopPropagation();
    setSpell(e.target.value);
    console.log("e", e.target.value);
  };

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">🧙‍♂️ Kablammy 🌬️🌒💫✨⚡️</div>

        <div className="bio">
          I am a Wizard who travels the Zuvuya. Connect your Ethereum wallet and
          open a portal to send a spell of manifestation and you might receive a
          gift through the portal.
        </div>

        {currentAccount ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              portal();
              setSpell("");
            }}
          >
            <input
              className="spellInput"
              type="text"
              onChange={(e) => {
                handleMessage(e);
              }}
              value={spell}
            />
            <button className="portalButton">Activate Portal</button>
          </form>
        ) : (
          <button className="portalButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {!totalPortalsOpen && isLoading ? <Loader /> : ""}
        {totalPortalsOpen &&
          (isLoading ? (
            <Loader />
          ) : (
            <p className="bio">Total portals open: {totalPortalsOpen}</p>
          ))}
      </div>
      {allPortals
        .map((portal, index) => {
          return (
            <div className="portalCard" key={index}>
              <div>Message: {portal.message}</div>
              <div>Address: {portal.address}</div>
              <div>Time: {portal.timestamp.toString()}</div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
}
