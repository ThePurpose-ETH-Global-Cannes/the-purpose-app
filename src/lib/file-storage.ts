import fs from 'fs';
import path from 'path';

// Simple file-based storage for development
// In production, replace with a real database

const DATA_DIR = path.join(process.cwd(), '.dev-data');
const REQUIREMENTS_FILE = path.join(DATA_DIR, 'requirements.json');
const MINTED_FILE = path.join(DATA_DIR, 'minted.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Available tasks that users can complete
export const AVAILABLE_TASKS = [
  {
    id: 'connect_wallet',
    name: 'Connect Wallet',
    description: 'Connect your wallet using Privy',
    points: 10
  },
  {
    id: 'verify_identity',
    name: 'Verify Identity',
    description: 'Complete identity verification',
    points: 20
  },
  {
    id: 'join_community',
    name: 'Join Community',
    description: 'Join our Discord community',
    points: 15
  },
  {
    id: 'share_project',
    name: 'Share Project',
    description: 'Share the project on social media',
    points: 25
  },
  {
    id: 'complete_quiz',
    name: 'Complete Quiz',
    description: 'Answer questions about the project',
    points: 30
  }
];

// Load completed requirements from file
export const loadCompletedRequirements = (): Map<string, { tasks: string[]; completedAt: number }> => {
  try {
    if (fs.existsSync(REQUIREMENTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(REQUIREMENTS_FILE, 'utf8'));
      return new Map(Object.entries(data));
    }
  } catch (error) {
    console.error('Error loading requirements:', error);
  }
  return new Map();
};

// Save completed requirements to file
export const saveCompletedRequirements = (requirements: Map<string, { tasks: string[]; completedAt: number }>): void => {
  try {
    const data = Object.fromEntries(requirements);
    fs.writeFileSync(REQUIREMENTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving requirements:', error);
  }
};

// Load minted NFTs from file
export const loadMintedNFTs = (): Set<string> => {
  try {
    if (fs.existsSync(MINTED_FILE)) {
      const data = JSON.parse(fs.readFileSync(MINTED_FILE, 'utf8'));
      return new Set(data);
    }
  } catch (error) {
    console.error('Error loading minted NFTs:', error);
  }
  return new Set();
};

// Save minted NFTs to file
export const saveMintedNFTs = (minted: Set<string>): void => {
  try {
    const data = Array.from(minted);
    fs.writeFileSync(MINTED_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving minted NFTs:', error);
  }
};

// Helper function to calculate user points
export const calculateUserPoints = (userAddress: string, privyId: string) => {
  const requirements = loadCompletedRequirements();
  const userKey = `${userAddress.toLowerCase()}_${privyId}`;
  const userReqs = requirements.get(userKey) || {
    tasks: [],
    completedAt: 0
  };

  const totalPoints = userReqs.tasks.reduce((total, completedTaskId) => {
    const task = AVAILABLE_TASKS.find(t => t.id === completedTaskId);
    return total + (task?.points || 0);
  }, 0);

  return {
    userReqs,
    totalPoints,
    requiredPoints: 50,
    isEligible: totalPoints >= 50
  };
};

// Helper function to check if user has already minted
export const hasUserMinted = (userAddress: string): boolean => {
  const minted = loadMintedNFTs();
  return minted.has(userAddress.toLowerCase());
};

// Helper function to mark user as having minted
export const markUserAsMinted = (userAddress: string): void => {
  const minted = loadMintedNFTs();
  minted.add(userAddress.toLowerCase());
  saveMintedNFTs(minted);
}; 