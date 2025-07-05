// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PurposeNFT {
    /*is ERC721, Ownable, EIP712*/
    // using ECDSA for bytes32;

    // Struct for mint authorization
    struct MintAuthorization {
        address to;
        uint256 tokenId;
        uint256 nonce;
        uint256 deadline;
    }

    // Type hash for EIP-712
    bytes32 public constant MINT_AUTHORIZATION_TYPEHASH =
        keccak256(
            "MintAuthorization(address to,uint256 tokenId,uint256 nonce,uint256 deadline)"
        );

    // Mapping to track used nonces
    mapping(uint256 => bool) public usedNonces;

    // Mapping to track minted addresses (1 per address limit)
    mapping(address => bool) public hasMinted;

    // Address authorized to sign mint permissions
    address public authorizedSigner;

    // Token ID counter
    uint256 private _tokenIdCounter;

    // Base URI for metadata
    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        address _authorizedSigner,
        string memory baseURI
    ) ERC721(name, symbol) EIP712("PurposeNFT", "1") {
        authorizedSigner = _authorizedSigner;
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mint NFT with signature authorization
     * @param authorization The mint authorization struct
     * @param signature The signature from the authorized signer
     */
    function mintWithSignature(
        MintAuthorization memory authorization,
        bytes memory signature
    ) external {
        // Check deadline
        require(block.timestamp <= authorization.deadline, "Signature expired");

        // Check nonce hasn't been used
        require(!usedNonces[authorization.nonce], "Nonce already used");

        // Check user hasn't already minted
        require(!hasMinted[authorization.to], "Address already minted");

        // Check that the caller is the authorized recipient
        require(msg.sender == authorization.to, "Not authorized recipient");

        // Verify signature
        bytes32 structHash = keccak256(
            abi.encode(
                MINT_AUTHORIZATION_TYPEHASH,
                authorization.to,
                authorization.tokenId,
                authorization.nonce,
                authorization.deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);
        require(signer == authorizedSigner, "Invalid signature");

        // Mark nonce as used
        usedNonces[authorization.nonce] = true;

        // Mark address as having minted
        hasMinted[authorization.to] = true;

        // Mint the NFT
        _safeMint(authorization.to, authorization.tokenId);
    }

    /**
     * @dev Set the authorized signer address (only owner)
     */
    function setAuthorizedSigner(address _authorizedSigner) external onlyOwner {
        authorizedSigner = _authorizedSigner;
    }

    /**
     * @dev Set the base URI for token metadata (only owner)
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Returns the base URI for tokens
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the token URI for a given token ID
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, Strings.toString(tokenId)))
                : "";
    }

    /**
     * @dev Check if an address has already minted
     */
    function hasAddressMinted(address addr) external view returns (bool) {
        return hasMinted[addr];
    }

    /**
     * @dev Check if a nonce has been used
     */
    function isNonceUsed(uint256 nonce) external view returns (bool) {
        return usedNonces[nonce];
    }

    /**
     * @dev Get the domain separator for EIP-712
     */
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4();
    }

    /**
     * @dev Emergency mint function (only owner, for testing)
     */
    function emergencyMint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }
}
