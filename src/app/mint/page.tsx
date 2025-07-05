'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Loader2 } from 'lucide-react';

interface MintStatus {
  eligible: boolean;
  reason: string;
  hasMinted: boolean;
}

interface SignatureData {
  signature: string;
  message: {
    to: string;
    tokenId: number;
    nonce: number;
    deadline: number;
  };
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    MintAuthorization: Array<{
      name: string;
      type: string;
    }>;
  };
}

export default function MintPage() {
  const { ready, authenticated, user } = usePrivy();
  const [mintStatus, setMintStatus] = useState<MintStatus | null>(null);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'check' | 'generate' | 'mint' | 'complete'>('check');
  
  const checkMintStatus = useCallback(async () => {
    if (!user?.wallet?.address || !user.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/mint-signature?userAddress=${user.wallet.address}&privyId=${user.id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMintStatus(data);
      
      if (data.hasMinted) {
        setStep('complete');
      } else if (data.eligible) {
        setStep('generate');
      } else {
        setStep('check');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check mint status');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check minting status when component loads
  useEffect(() => {
    if (ready && authenticated && user?.wallet?.address) {
      checkMintStatus();
    }
  }, [ready, authenticated, user, checkMintStatus]);

  const generateSignature = async () => {
    if (!user?.wallet?.address || !user.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mint-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: user.wallet.address,
          privyId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.reason || errorData.error || 'Failed to generate signature');
      }

      const data = await response.json();
      setSignatureData(data);
      setStep('mint');
      setSuccess('Signature generated successfully! You can now mint your NFT.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate signature');
    } finally {
      setLoading(false);
    }
  };

  const simulateMint = async () => {
    if (!signatureData) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate blockchain transaction (in production, this would interact with your smart contract)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Connect to the user's wallet
      // 2. Call the mint function on your smart contract
      // 3. Pass the signature data for verification
      
      setSuccess('🎉 NFT minted successfully! Transaction confirmed on blockchain.');
      setStep('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint NFT');
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to access the minting interface.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Purpose NFT Minting</h1>
            <p className="text-purple-100 mt-1">
              Limited to 1 NFT per user • Signature-based verification
            </p>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Wallet</p>
                <p className="font-mono text-sm text-gray-800">{user?.wallet?.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Privy ID</p>
                <p className="font-mono text-sm text-gray-800">{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${step === 'check' ? 'text-blue-600' : step === 'generate' || step === 'mint' || step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'check' ? 'bg-blue-100' : step === 'generate' || step === 'mint' || step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {step === 'generate' || step === 'mint' || step === 'complete' ? '✓' : '1'}
                </div>
                <span className="ml-2 text-sm font-medium">Check Eligibility</span>
              </div>
              <div className={`flex items-center ${step === 'generate' ? 'text-blue-600' : step === 'mint' || step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'generate' ? 'bg-blue-100' : step === 'mint' || step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {step === 'mint' || step === 'complete' ? '✓' : '2'}
                </div>
                <span className="ml-2 text-sm font-medium">Generate Signature</span>
              </div>
              <div className={`flex items-center ${step === 'mint' ? 'text-blue-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'mint' ? 'bg-blue-100' : step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {step === 'complete' ? '✓' : '3'}
                </div>
                <span className="ml-2 text-sm font-medium">Mint NFT</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step Content */}
            {!mintStatus && loading && (
              <LoadingSpinner text="Checking your minting status..." />
            )}

            {mintStatus && (
              <div>
                {/* Step 1: Check eligibility */}
                {step === 'check' && (
                  <div className="text-center">
                    {!mintStatus.eligible && !mintStatus.hasMinted && (
                      <div className="mb-4">
                        <p className="text-lg font-semibold text-red-600">
                          Not Eligible to Mint
                        </p>
                        <p className="text-gray-600">{mintStatus.reason}</p>
                      </div>
                    )}
                    <button
                      onClick={checkMintStatus}
                      disabled={loading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        'Check Again'
                      )}
                    </button>
                  </div>
                )}

                {/* Step 2: Generate Signature */}
                {step === 'generate' && mintStatus.eligible && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-600 mb-4">
                      You are eligible to mint!
                    </p>
                    <button
                      onClick={generateSignature}
                      disabled={loading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Mint Signature'
                      )}
                    </button>
                  </div>
                )}

                {/* Step 3: Mint NFT */}
                {step === 'mint' && signatureData && (
                  <div className="text-center">
                    <p className="text-lg font-semibold text-blue-600 mb-4">
                      Signature received. Ready to mint.
                    </p>
                    <button
                      onClick={simulateMint}
                      disabled={loading}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        '🎨 Mint NFT'
                      )}
                    </button>
                  </div>
                )}

                {/* Step 4: Complete */}
                {step === 'complete' && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Congratulations!</h3>
                    <p className="text-gray-600 mb-4">
                      {mintStatus?.hasMinted ? 'You have already minted your Purpose NFT.' : 'Your Purpose NFT has been successfully minted!'}
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => window.location.href = '/metadata-demo'}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View NFT Metadata
                      </button>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Back to Home
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 