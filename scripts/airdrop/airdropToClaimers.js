// Airdrop tokens to claimers of a given POIDH bounty (claimers are people who submitted a claim to the bounty)
// Fill out the variables below and run the script with this command (without the // part):
// npx hardhat run scripts/airdrop/airdropToClaimers.js --network degen

// FILL OUT THESE VARIABLES:
const bountyId = 672; // the ID of the bounty to whose claimers the tokens/NFTs will be airdropped
const airdropTokenAddress = ""; // the address of the token/NFT to be airdropped
// END


// LEAVE THE CODE BELOW AS IS
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Your minter address:", deployer.address);

  const poidhAddress = "0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814";

  const poidhInterface = new ethers.utils.Interface([
    "function getClaimsByBountyId(uint256 bountyId) public view returns (tuple(uint256 id, address issuer, uint256 bountyId, address bountyIssuer, string name, string description, uint256 createdAt, bool accepted)[] memory)"
  ]);

  const poidhContract = new ethers.Contract(poidhAddress, poidhInterface, deployer);

  const claims = await poidhContract.getClaimsByBountyId(bountyId);

  //console.log("Claims:", claims);

  const tokenInterface = new ethers.utils.Interface([
    "function balanceOf(address account) public view returns (uint256)",
    "function mint(address to) public"
  ]);

  const tokenContract = new ethers.Contract(airdropTokenAddress, tokenInterface, deployer);

  // loop through claims and check if the claimer already has the token (if not, mint it)
  for (let i = 0; i < claims.length; i++) {
    console.log("Claimer:", claims[i].issuer);

    const balance = await tokenContract.balanceOf(claims[i].issuer);
    
    if (Number(balance) == 0) {
      console.log("Minting token to claimer:", claims[i].issuer);
      await tokenContract.mint(claims[i].issuer);
      await sleep(1000);
    } else {
      console.log("Claim issuer already has the token.");
      continue;
    }
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
