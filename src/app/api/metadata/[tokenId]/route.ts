import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration - in a real app, this would come from a database
const generateMetadata = (tokenId: string) => {
  // Convert tokenId to number for demo purposes
  const id = parseInt(tokenId);
  
  // Generate some demo attributes based on token ID
  const traits = [
    { trait_type: "Level", value: (id % 10) + 1 },
    { trait_type: "Rarity", value: id % 3 === 0 ? "Rare" : id % 2 === 0 ? "Uncommon" : "Common" },
    { trait_type: "Color", value: ["Red", "Blue", "Green", "Purple", "Gold"][id % 5] },
    { trait_type: "Power", value: Math.floor(Math.random() * 100) + 1 }
  ];

  return {
    name: `Purpose Token #${tokenId}`,
    description: `This is Purpose Token number ${tokenId}. A unique digital collectible with randomly generated traits.`,
    image: `https://picsum.photos/400/400?random=${tokenId}`, // Using placeholder images
    external_url: `https://yourapp.com/token/${tokenId}`,
    attributes: traits,
    // Additional metadata
    animation_url: null, // Could be used for animated NFTs
    background_color: null,
    youtube_url: null
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> },
) {
  try {
    const { tokenId } = await params;

    // Validate token ID
    if (!tokenId || isNaN(parseInt(tokenId))) {
      return NextResponse.json(
        { error: 'Invalid token ID' },
        { status: 400 }
      );
    }

    // In a real application, you might want to:
    // 1. Check if the token exists in your database
    // 2. Fetch metadata from your database
    // 3. Handle authentication/authorization if needed
    
    const metadata = generateMetadata(tokenId);

    // Set CORS headers to allow external access (important for NFT marketplaces)
    const response = NextResponse.json(metadata);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error serving metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 