'use client';

import { useState, useEffect, useCallback } from 'react';

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export default function MetadataDemo() {
  const [tokenId, setTokenId] = useState('1');
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async (id: string) => {
    if (!id || isNaN(parseInt(id))) {
      setError('Please enter a valid token ID');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/metadata/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMetadata(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetadata(tokenId);
  }, [fetchMetadata, tokenId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMetadata(tokenId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">ERC721 Metadata API Demo</h1>
            <p className="text-blue-100 mt-1">
              Test your NFT metadata endpoint
            </p>
          </div>

          {/* Input Form */}
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-2">
                  Token ID
                </label>
                <input
                  type="number"
                  id="tokenId"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter token ID (e.g., 1, 2, 3...)"
                  min="1"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Fetch Metadata'}
              </button>
            </form>
          </div>

          {/* API Info */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">API Endpoint</h2>
            <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
              GET /api/metadata/{tokenId}
            </code>
            <p className="text-sm text-gray-600 mt-2">
              This endpoint returns ERC721-compliant metadata for the specified token ID.
            </p>
          </div>

          {/* Results */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {metadata && !loading && (
              <div className="space-y-6">
                {/* Preview Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Token Preview</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={metadata.image}
                        alt={metadata.name}
                        className="w-full h-64 object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{metadata.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{metadata.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-800">Attributes:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {metadata.attributes.map((attr, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-md p-2 text-sm"
                            >
                              <div className="font-medium text-gray-800">{attr.trait_type}</div>
                              <div className="text-gray-600">{attr.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JSON Response */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">JSON Response</h3>
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    <code>{JSON.stringify(metadata, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 