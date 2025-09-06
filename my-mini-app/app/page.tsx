'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CowAvatar from './svg/CowAvatar';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

type HealthLog = {
  timestamp: number;
  log: string;
};

type Cow = {
  id: number;
  name: string;
  breed: string;
  age: number;
  traits: string;
  healthRecords: HealthLog[];
  adoptionDate: number;
  milkYield: number; // liters per day
};

const breeds = ['Holstein', 'Jersey', 'Angus', 'Hereford', 'Simmental'];
const traits = [
  'A friendly and curious cow.',
  'Loves to graze in the sun.',
  'A bit shy but very gentle.',
  'Known for its loud moo.',
  'Enjoys a good scratch behind the ears.',
];
const initialHealthLogs = [
  { log: 'Initial check-up, all clear.' },
  { log: 'Vaccinated against common illnesses.' },
  { log: 'Started on a nutritious diet.' },
];

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const { address, isConnected } = useAccount();
  const [myCows, setMyCows] = useState<Cow[]>(() => {
    try {
      const savedCows =
        typeof window !== 'undefined' && window.localStorage.getItem('myCows');
      return savedCows ? JSON.parse(savedCows) : [];
    } catch (error) {
      console.error('Failed to parse cows from localStorage', error);
      return [];
    }
  });
  const [cowName, setCowName] = useState('');
  const [logMessage, setLogMessage] = useState('');
  const [selectedCowId, setSelectedCowId] = useState<number | null>(null);
  const [farmerAddress, setFarmerAddress] = useState<string>(() => {
    try {
      const savedFarmerAddress =
        typeof window !== 'undefined' &&
        window.localStorage.getItem('farmerAddress');
      return savedFarmerAddress
        ? JSON.parse(savedFarmerAddress)
        : '0xYourFarmerAddressHere';
    } catch (error) {
      console.error('Failed to parse farmer address from localStorage', error);
      return '0xYourFarmerAddressHere';
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('myCows', JSON.stringify(myCows));
    }
  }, [myCows]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('farmerAddress', JSON.stringify(farmerAddress));
    }
  }, [farmerAddress]);

  const handleMintCow = () => {
    if (!cowName) {
      alert('Please enter a name for your cow.');
      return;
    }

    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const randomTrait = traits[Math.floor(Math.random() * traits.length)];
    const randomAge = Math.floor(Math.random() * 5) + 1;
    const randomMilkYield = Math.floor(Math.random() * 10) + 5; // 5–15 L/day
    const randomInitialLog =
      initialHealthLogs[Math.floor(Math.random() * initialHealthLogs.length)];

    const newCow: Cow = {
      id: Date.now(),
      name: cowName,
      breed: randomBreed,
      age: randomAge,
      traits: randomTrait,
      milkYield: randomMilkYield,
      adoptionDate: Math.floor(Date.now() / 1000),
      healthRecords: [
        { timestamp: Math.floor(Date.now() / 1000), log: randomInitialLog.log },
      ],
    };

    setMyCows([...myCows, newCow]);
    setCowName('');
  };

  const handleAddLog = () => {
    if (!logMessage || selectedCowId === null) {
      alert('Please select a cow and enter a log message.');
      return;
    }
    setMyCows(
      myCows.map((cow) =>
        cow.id === selectedCowId
          ? {
              ...cow,
              healthRecords: [
                ...cow.healthRecords,
                { timestamp: Math.floor(Date.now() / 1000), log: logMessage },
              ],
            }
          : cow
      )
    );
    setLogMessage('');
  };

  const isFarmer =
    isConnected && address?.toLowerCase() === farmerAddress.toLowerCase();

  // Farm stats for leaderboard
  const totalCows = myCows.length;
  const totalMilkYield = myCows.reduce((sum, cow) => sum + cow.milkYield, 0);
  const topCows = [...myCows].sort((a, b) => b.milkYield - a.milkYield).slice(0, 3);
  const maxMilkYield = Math.max(...myCows.map((cow) => cow.milkYield), 1);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gray-950 dark:text-white bg-white text-black">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold">🐮 Moo Chain</h1>
        <ConnectButton />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl font-bold mb-4">Moo Chain</h2>
        <p className="text-lg mb-8">
          Support a farm, adopt a digital cow, and track its well-being on the blockchain.
        </p>

        {/* Minting */}
        {isConnected && (
          <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4">Adopt a New Cow</h3>
            <input
              type="text"
              value={cowName}
              onChange={(e) => setCowName(e.target.value)}
              placeholder="Enter your cow's name"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mb-4"
            />
            <button
              onClick={handleMintCow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Mint Your Cow NFT
            </button>
          </div>
        )}

        {/* Become Farmer */}
        {isConnected && !isFarmer && (
          <div className="w-full max-w-md mb-8">
            <button
              onClick={() => setFarmerAddress(address!)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Become a Farmer
            </button>
          </div>
        )}

        {/* Farm Stats / Leaderboard */}
        {isConnected && myCows.length > 0 && (
          <div className="w-full max-w-4xl bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-2xl font-semibold mb-4">🏆 Farm Stats & Leaderboard</h3>
            <p>Total Adopted Cows: <span className="font-bold">{totalCows}</span></p>
            <p>Total Milk Yield: <span className="font-bold">{totalMilkYield} L/day</span></p>

            <h4 className="text-xl font-semibold mt-4">Top Milk Producers:</h4>
            <ol className="list-decimal pl-5 mt-2">
              {topCows.map((cow) => (
                <li key={cow.id}>
                  {cow.name} — {cow.milkYield} L/day
                  {/* Progress bar */}
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-2 mt-1">
                    <div
                      className="bg-green-500 h-2 rounded"
                      style={{ width: `${(cow.milkYield / maxMilkYield) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Cow Dashboard */}
        {isConnected && myCows.length > 0 && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {myCows.map((cow) => (
              <React.Fragment key={cow.id}>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg flex items-center">
                  <div className="w-24 h-24 mr-4">
                    <CowAvatar cowId={cow.id} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{cow.name}</h4>
                    <p>Breed: {cow.breed}</p>
                    <p>Age: {cow.age}</p>
                    <p>Traits: {cow.traits}</p>
                    <p>Milk Yield: {cow.milkYield} L/day</p>
                    <p>Adopted: {new Date(cow.adoptionDate * 1000).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
                  <h5 className="font-semibold">Health Records:</h5>
                  <ul className="list-disc pl-5 mt-2">
                    {cow.healthRecords.length > 0 ? (
                      cow.healthRecords.map((log) => (
                        <li key={log.timestamp}>
                          {new Date(log.timestamp * 1000).toLocaleDateString()} — {log.log}
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No health records yet.</p>
                    )}
                  </ul>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Farmer Section */}
        {isFarmer && (
          <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Farmer&apos;s Corner</h3>
            <select
              onChange={(e) => {
                const value = Number(e.target.value);
                setSelectedCowId(value === 0 ? null : value);
              }}
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mb-4"
            >
              <option value={0}>Select a cow to update</option>
              {myCows.map((cow) => (
                <option key={cow.id} value={cow.id}>
                  {cow.name} (ID: {cow.id})
                </option>
              ))}
            </select>
            <textarea
              value={logMessage}
              onChange={(e) => setLogMessage(e.target.value)}
              placeholder="e.g., 'Vaccinated today'"
              className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mb-4"
              rows={3}
            />
            <button
              onClick={handleAddLog}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Health Log
            </button>
          </div>
        )}
      </main>
    </div>
  );
}