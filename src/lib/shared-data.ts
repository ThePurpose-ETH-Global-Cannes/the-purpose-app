// Shared data store for the demo application
// In production, this would be replaced with a database

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

// Mock database for tracking completed requirements (in production, use a real database)
export const completedRequirements = new Map<string, {
  tasks: string[];
  completedAt: number;
}>();

// Mock database for tracking minted NFTs (in production, use a real database)
export const mintedNFTs = new Set<string>();

// Helper function to calculate user points
export const calculateUserPoints = (userAddress: string, privyId: string) => {
  const userKey = `${userAddress.toLowerCase()}_${privyId}`;
  const userReqs = completedRequirements.get(userKey) || {
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
  return mintedNFTs.has(userAddress.toLowerCase());
};

// Helper function to mark user as having minted
export const markUserAsMinted = (userAddress: string): void => {
  mintedNFTs.add(userAddress.toLowerCase());
}; 