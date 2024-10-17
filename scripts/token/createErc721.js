// A script to create a commemorative ERC721 NFT
// The script will print the contract address to the console, store is somewhere (you will need the address in the airdrop script)
// Fill out the variables below and run the script with this command (without the // part):
// npx hardhat run scripts/token/createErc721.js --network degen

// FILL OUT THESE VARIABLES:
const ownerAddress = ""; // enter the address of the owner of the contract (use your main personal address)
const nftName = "Some Commemorative NFT";
const nftSymbol = "SNFT";
const nftDescription = "Just some commemorative NFT for a poidh bounty";
const nftImage = "https://arweave.net/4HY2t_bOMooj2nIbZ9vKwMTJFag16oiA166x1arWLoc";
// END

// LEAVE THE CODE BELOW AS IS
async function main() {
  const contractName = "PoidhCommemorativeErc721";
  const [deployer] = await ethers.getSigners();
  console.log("Your address:", deployer.address);

  // deploy contract
  const contract = await ethers.getContractFactory(contractName);
  const instance = await contract.deploy(
    ownerAddress,
    nftName,
    nftSymbol,
    nftDescription,
    nftImage
  );
  await instance.deployed();

  console.log("Contract deployed to:", instance.address); 

  try {
    console.log("Wait a bit before starting the verification process...");
    sleep(2000);
    await hre.run("verify:verify", {
      address: instance.address,
      constructorArguments: [
        ownerAddress,
        nftName,
        nftSymbol,
        nftDescription,
        nftImage
      ]
    });
  } catch (error) {
    console.error(error);
    console.log("If automated verification did not succeed, try to verify the smart contract manually by running this command:");
    console.log("npx hardhat verify --network " + network.name + " " + instance.address + ' ' + ownerAddress + ' "' + nftName + '" "' + nftSymbol + '" "' + nftDescription + '" "' + nftImage + '"');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
