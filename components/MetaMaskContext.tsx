'use client'
import React, { useState, useEffect } from "react";
import Web3 from "web3";

const ConnectWallet: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Vérifie si MetaMask est installé
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      setErrorMessage("MetaMask n'est pas installé");
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        // Demande à MetaMask de se connecter et assure le type correct
        const accounts = (await window.ethereum?.request({
          method: "eth_requestAccounts",
        })) as string[];
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]); // Récupère le premier compte
        } else {
          setErrorMessage("Aucun compte trouvé");
        }
      } catch (err) {
        setErrorMessage("Erreur lors de la connexion à MetaMask");
      }
    }
  };

  return (
    <div className="z-10 text-black">
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : account ? (
        <p>Wallet connecté : {account}</p>
      ) : (
        <button onClick={connectWallet}>Connecter MetaMask</button>
      )}
    </div>
  );
};

export default ConnectWallet;
