// npx hardhat test test/PoidhCommemorativeErc721.test.js

const { expect } = require("chai");

describe("PoidhCommemorativeErc721", function () {
  let nftContract;
  let nftName = "Just Some NFT";
  let nftSymbol = "JSN";
  let nftDescription = "This is a test NFT";
  let nftImage = "https://justsome.nft/image.png";

  beforeEach(async function () {
    [ minter, owner, user1, user2 ] = await ethers.getSigners();

    const PoidhCommemorativeErc721 = await ethers.getContractFactory("PoidhCommemorativeErc721");
    nftContract = await PoidhCommemorativeErc721.deploy(
      owner.address,
      nftName,
      nftSymbol,
      nftDescription,
      nftImage
    );
    await nftContract.deployed();
  });

  it("Should be deployed", async function () {
    expect(await nftContract.name()).to.equal(nftName);
    expect(await nftContract.symbol()).to.equal(nftSymbol);
    expect(await nftContract.description()).to.equal(nftDescription);
    expect(await nftContract.image()).to.equal(nftImage);

    // check owner and minter
    expect(await nftContract.owner()).to.equal(owner.address);
    expect(await nftContract.minterAddress()).to.equal(minter.address);
  });

  // mint an NFT and check metadata
  it("Should be able to mint an NFT", async function () {
    await nftContract.connect(minter).mint(user1.address);
    
    const metadata = await nftContract.tokenURI(1);
    console.log("metadata", metadata);
    // decode metadata from base64
    const base64Data = metadata.split(',')[1];
    const decodedMetadata = Buffer.from(base64Data, 'base64').toString('utf-8');
    console.log("decodedMetadata", decodedMetadata);
    console.log("type of decodedMetadata", typeof decodedMetadata);

    const metadataObj = JSON.parse(decodedMetadata);
    console.log("metadataObj", metadataObj);
    
    // Add assertions to check the metadata
    expect(metadataObj.name).to.equal(`${nftName} #1`);
    expect(metadataObj.description).to.equal(nftDescription);
    expect(metadataObj.image).to.equal(nftImage);
  });

  it("Should allow minter to mint NFTs", async function () {
    await expect(nftContract.connect(minter).mint(user1.address))
      .to.emit(nftContract, 'Transfer')
      .withArgs(ethers.constants.AddressZero, user1.address, 1);
    
    expect(await nftContract.ownerOf(1)).to.equal(user1.address);
    expect(await nftContract.balanceOf(user1.address)).to.equal(1);
  });

  it("Should increment counter after minting", async function () {
    await nftContract.connect(minter).mint(user1.address);
    await nftContract.connect(minter).mint(user2.address);
    
    expect(await nftContract.counter()).to.equal(3);
  });

  it("Should not allow non-minter or non-owner to mint", async function () {
    await expect(nftContract.connect(user1).mint(user2.address))
      .to.be.revertedWith("Not owner or minter");
  });

  it("Should allow owner to mint", async function () {
    await expect(nftContract.connect(owner).mint(user1.address))
      .to.emit(nftContract, 'Transfer')
      .withArgs(ethers.constants.AddressZero, user1.address, 1);
  });

  it("Should allow owner to change minter address", async function () {
    await nftContract.connect(owner).setMinterAddress(user1.address);
    expect(await nftContract.minterAddress()).to.equal(user1.address);

    // New minter should be able to mint
    await expect(nftContract.connect(user1).mint(user2.address))
      .to.emit(nftContract, 'Transfer')
      .withArgs(ethers.constants.AddressZero, user2.address, 1);
  });

  it("Should not allow non-owner to change minter address", async function () {
    await expect(nftContract.connect(user1).setMinterAddress(user2.address))
      .to.be.revertedWithCustomError(nftContract, "OwnableUnauthorizedAccount")
      .withArgs(user1.address);
  });

  it("Should allow owner to change description", async function () {
    const newDescription = "Updated description";
    await nftContract.connect(owner).setDescription(newDescription);
    expect(await nftContract.description()).to.equal(newDescription);

    // Check if the new description is reflected in the metadata
    await nftContract.connect(minter).mint(user1.address);
    const metadata = await nftContract.tokenURI(1);
    const decodedMetadata = JSON.parse(Buffer.from(metadata.split(',')[1], 'base64').toString('utf-8'));
    expect(decodedMetadata.description).to.equal(newDescription);
  });

  it("Should allow owner to change image", async function () {
    const newImage = "https://new.image.url";
    await nftContract.connect(owner).setImage(newImage);
    expect(await nftContract.image()).to.equal(newImage);

    // Check if the new image is reflected in the metadata
    await nftContract.connect(minter).mint(user1.address);
    const metadata = await nftContract.tokenURI(1);
    const decodedMetadata = JSON.parse(Buffer.from(metadata.split(',')[1], 'base64').toString('utf-8'));
    expect(decodedMetadata.image).to.equal(newImage);
  });

  it("Should not allow non-owner to change description or image", async function () {
    await expect(nftContract.connect(user1).setDescription("New description"))
      .to.be.revertedWithCustomError(nftContract, "OwnableUnauthorizedAccount")
      .withArgs(user1.address);
    
    await expect(nftContract.connect(user1).setImage("https://new.image.url"))
      .to.be.revertedWithCustomError(nftContract, "OwnableUnauthorizedAccount")
      .withArgs(user1.address);
  });

  it("Should handle minting multiple tokens", async function () {
    for (let i = 1; i <= 10; i++) {
      await nftContract.connect(minter).mint(user1.address);
      expect(await nftContract.ownerOf(i)).to.equal(user1.address);
    }
    expect(await nftContract.balanceOf(user1.address)).to.equal(10);
    expect(await nftContract.counter()).to.equal(11);
  });

  it("Should return correct tokenURI for each token", async function () {
    await nftContract.connect(minter).mint(user1.address);
    await nftContract.connect(minter).mint(user2.address);

    const metadata1 = JSON.parse(Buffer.from((await nftContract.tokenURI(1)).split(',')[1], 'base64').toString('utf-8'));
    const metadata2 = JSON.parse(Buffer.from((await nftContract.tokenURI(2)).split(',')[1], 'base64').toString('utf-8'));

    expect(metadata1.name).to.equal(`${nftName} #1`);
    expect(metadata2.name).to.equal(`${nftName} #2`);
  });

  // Edge case: Attempt to get tokenURI for non-existent token
  it("Should revert when querying tokenURI for non-existent token", async function () {
    await expect(nftContract.tokenURI(999))
      .to.be.revertedWith("ERC721: invalid token ID");
  });
});
