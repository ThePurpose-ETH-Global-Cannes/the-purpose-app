# ERC721 Metadata API

This API endpoint serves NFT metadata in the standard ERC721 format, providing a replacement for IPFS-based metadata hosting.

## Endpoint

```
GET /api/metadata/{tokenId}
```

## Parameters

- `tokenId` (required): The token ID for which to fetch metadata

## Response Format

The API returns JSON metadata following the ERC721 standard:

```json
{
  "name": "Purpose Token #1",
  "description": "This is Purpose Token number 1. A unique digital collectible with randomly generated traits.",
  "image": "https://picsum.photos/400/400?random=1",
  "external_url": "https://yourapp.com/token/1",
  "attributes": [
    {
      "trait_type": "Level",
      "value": 2
    },
    {
      "trait_type": "Rarity",
      "value": "Common"
    },
    {
      "trait_type": "Color",
      "value": "Blue"
    },
    {
      "trait_type": "Power",
      "value": 85
    }
  ]
}
```

## Usage Examples

### Direct API Access
```bash
curl https://yourapp.com/api/metadata/1
```

### In Smart Contract
Set your contract's `tokenURI` to:
```solidity
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    return string(abi.encodePacked("https://yourapp.com/api/metadata/", tokenId.toString()));
}
```

### For Testing
Visit the demo page at `/metadata-demo` to test the API interactively.

## Features

- ✅ ERC721 compliant metadata format
- ✅ CORS enabled for cross-origin requests
- ✅ Dynamic attribute generation
- ✅ Error handling for invalid token IDs
- ✅ Placeholder images for demo purposes

## Customization

To customize the metadata for your project:

1. **Replace the `generateMetadata` function** in `/src/app/api/metadata/[tokenId]/route.ts`
2. **Connect to your database** to fetch real metadata
3. **Update image URLs** to point to your actual NFT images
4. **Add authentication** if needed for private collections

## Database Integration Example

```typescript
// Example with a database
const getMetadataFromDB = async (tokenId: string) => {
  const token = await db.token.findUnique({
    where: { id: parseInt(tokenId) },
    include: { attributes: true }
  });
  
  if (!token) {
    throw new Error('Token not found');
  }
  
  return {
    name: token.name,
    description: token.description,
    image: token.imageUrl,
    attributes: token.attributes.map(attr => ({
      trait_type: attr.traitType,
      value: attr.value
    }))
  };
};
```

## CORS Configuration

The API is configured to allow cross-origin requests, which is essential for:
- NFT marketplaces (OpenSea, Rarible, etc.)
- Web3 applications
- Direct blockchain interactions

## Error Handling

The API handles several error cases:
- Invalid token IDs return `400 Bad Request`
- Server errors return `500 Internal Server Error`
- All errors include descriptive error messages 