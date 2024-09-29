import React, { useState } from 'react';
import { ethers } from 'ethers';
import { AxelarQueryAPI, Environment, GasToken } from '@axelar-network/axelarjs-sdk';
import S3XY_ABI from './S3XY_ABI.json';  // Import your S3XY token ABI

const S3XY_ADDRESS = '0xddb2f7da83a7074a558d6a70f3d3b9d5db127b48';  // S3XY contract address
const TOKEN_MANAGER_ADDRESS = '0x8680aC3609b28985312559E6237CBF81aAF549A7';  // Token Manager on Axelar

function App() {
  const [account, setAccount] = useState(null);
  const [toChain, setToChain] = useState('Polygon');  // Default destination chain
  const [amount, setAmount] = useState('');
  const [registrationChain, setRegistrationChain] = useState(''); // Chain for registration

  // List of available chains for registration
  const availableChains = [
    { name: 'Ethereum', id: 'ethereum' },
    { name: 'Polygon', id: 'polygon' },
    { name: 'Avalanche', id: 'avalanche' },
    // Add other available chains here...
  ];

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Function to bridge tokens using Axelar
  const bridgeTokens = async () => {
    if (!account) {
      alert('Please connect to MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(S3XY_ADDRESS, S3XY_ABI, signer);

    // Prepare the Axelar API for querying gas estimates
    const axelarQueryAPI = new AxelarQueryAPI({
      environment: Environment.MAINNET,  // Use TESTNET if on test environment
    });

    try {
      // Estimate gas fees for the bridge transaction
      const gasFee = await axelarQueryAPI.estimateGasFee(toChain, 'Fantom', GasToken.ETH);

      const tx = await contract.crossChainTransfer(ethers.utils.parseUnits(amount, 18), {
        value: gasFee, // Pay the gas fee for the cross-chain transaction
      });

      await tx.wait();
      alert(`Bridged ${amount} S3XY tokens to ${toChain}`);
    } catch (error) {
      console.error('Error bridging tokens:', error);
      alert('Bridging failed');
    }
  };

  // Function to register S3XY on a new chain via Axelar
  const registerToken = async () => {
    if (!account) {
      alert('Please connect to MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Call Axelar's Token Manager contract to register the token
    const contract = new ethers.Contract(TOKEN_MANAGER_ADDRESS, S3XY_ABI, signer);

    try {
      const tx = await contract.registerTokenOnChain(S3XY_ADDRESS, registrationChain); // Registration method on Axelar Token Manager
      await tx.wait();
      alert(`Registered S3XY on ${registrationChain}`);
    } catch (error) {
      console.error('Error during token registration:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="App">
      <h1>S3XY Token DApp with Axelar Bridge & Registration</h1>

      {/* Wallet Connection */}
      <button onClick={connectWallet}>
        {account ? `Connected: ${account}` : 'Connect Wallet'}
      </button>

      {/* Bridge Tokens Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Bridge S3XY Tokens</h2>
        <select onChange={(e) => setToChain(e.target.value)} value={toChain}>
          {availableChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount to Bridge"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={bridgeTokens}>Bridge S3XY Tokens</button>
      </div>

      {/* Register Token Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Register S3XY on a New Chain</h2>
        <select onChange={(e) => setRegistrationChain(e.target.value)} value={registrationChain}>
          {availableChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
        <button onClick={registerToken}>Register S3XY on Selected Chain</button>
      </div>
    </div>
  );
}

export default App;
