// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.24;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol"; 
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract PoidhCommemorativeErc721 is ERC721, Ownable {
  using Strings for uint256;

  address public minterAddress; // address that is allowed to mint
  string public description;
  string public image; // image url
  uint256 public counter = 1;

  // modifier onlyOwnerOrMinter
  modifier onlyOwnerOrMinter() {
    require(msg.sender == owner() || msg.sender == minterAddress, "Not owner or minter");
    _;
  }

  constructor(
    address _ownerAddress,
    string memory _tokenName,
    string memory _tokenSymbol,
    string memory _description,
    string memory _image
  ) ERC721(_tokenName, _tokenSymbol) Ownable(_ownerAddress) {
    minterAddress = msg.sender;
    description = _description;
    image = _image;
  }

  // READ FUNCTIONS

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    require(_ownerOf(_tokenId) != address(0), "ERC721: invalid token ID");

    return string(
      abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(abi.encodePacked(
        '{"name": "', name(), ' #', _tokenId.toString() ,'", ',
        '"description": "', description ,'", ',
        '"image": "', image ,'"}'))))
    );
  }

  // WRITE FUNCTIONS

  /**
   * @notice Mint a token to the given address (only owner or minter can mint)
   * @param _to The address to mint the token to
   */
  function mint(address _to) external onlyOwnerOrMinter {
    _mint(_to, counter);
    counter++;
  }

  // OWNER FUNCTIONS

  function setMinterAddress(address _minterAddress) external onlyOwner {
    minterAddress = _minterAddress;
  }

  function setDescription(string memory _description) external onlyOwner {
    description = _description;
  }

  function setImage(string memory _image) external onlyOwner {
    image = _image;
  }
}