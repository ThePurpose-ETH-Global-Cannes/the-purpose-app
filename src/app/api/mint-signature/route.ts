import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { hasUserMinted, markUserAsMinted, calculateUserPoints } from '@/lib/file-storage';

// Check if user meets requirements using shared data
const checkUserCriteria = async (userAddress: string, privyId: string): Promise<{ eligible: boolean; reason?: string }> => {
  // Check if user already minted
  if (hasUserMinted(userAddress)) {
    return { eligible: false, reason: 'User has already minted an NFT' };
  }

  try {
    const { totalPoints, requiredPoints, isEligible } = calculateUserPoints(userAddress, privyId);
    
    if (!isEligible) {
      return { 
        eligible: false, 
        reason: `Complete more tasks to become eligible. You have ${totalPoints}/${requiredPoints} points.` 
      };
    }

    return { eligible: true, reason: 'User meets all requirements' };
  } catch (error) {
    console.error('Error checking user criteria:', error);
    return { eligible: false, reason: 'Error checking eligibility. Please try again.' };
  }
};

// EIP-712 Domain and Types for signature generation
const DOMAIN = {
  name: 'PurposeNFT',
  version: '1',
  chainId: 1, // Change to your target chain ID
  verifyingContract: '0x' + '0'.repeat(40) // Replace with your actual contract address
};

const TYPES = {
  MintAuthorization: [
    { name: 'to', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { userAddress, privyId } = await request.json();

    // Validate input
    if (!userAddress || !privyId) {
      return NextResponse.json(
        { error: 'User address and Privy ID are required' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Check if user meets criteria
    const eligibility = await checkUserCriteria(userAddress, privyId);
    
    if (!eligibility.eligible) {
      return NextResponse.json(
        { 
          error: 'User not eligible for minting',
          reason: eligibility.reason,
          eligible: false
        },
        { status: 403 }
      );
    }

    // Generate unique token ID (in production, this should be from your NFT contract)
    const tokenId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Generate unique nonce
    const nonce = Math.floor(Math.random() * 1000000);
    
    // Set deadline (24 hours from now)
    const deadline = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

    // Create the message to sign
    const message = {
      to: userAddress,
      tokenId: tokenId,
      nonce: nonce,
      deadline: deadline
    };

    // Create a wallet for signing (in production, use a secure key management system)
    const signerPrivateKey = process.env.SIGNER_PRIVATE_KEY || '0x1234567890123456789012345678901234567890123456789012345678901234';
    const signer = new ethers.Wallet(signerPrivateKey);

    // Generate EIP-712 signature
    const signature = await signer.signTypedData(DOMAIN, TYPES, message);

    // Mark this address as having a pending mint (to prevent double-minting)
    markUserAsMinted(userAddress);

    return NextResponse.json({
      success: true,
      signature,
      message,
      domain: DOMAIN,
      types: TYPES,
      eligible: true
    });

  } catch (error) {
    console.error('Error generating mint signature:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get minting status for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');
    const privyId = searchParams.get('privyId');

    if (!userAddress || !privyId) {
      return NextResponse.json(
        { error: 'User address and Privy ID are required' },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(userAddress)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    const eligibility = await checkUserCriteria(userAddress, privyId);
    
    return NextResponse.json({
      userAddress,
      privyId,
      eligible: eligibility.eligible,
      reason: eligibility.reason || 'User meets all criteria',
      hasMinted: hasUserMinted(userAddress)
    });

  } catch (error) {
    console.error('Error checking mint status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 