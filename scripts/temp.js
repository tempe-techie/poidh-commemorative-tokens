// npx hardhat run scripts/temp.js --network degen

const poidhAddress = "0x2445BfFc6aB9EEc6C562f8D7EE325CddF1780814";
const bountyId = 727;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Your address:", deployer.address);

  const poidhInterface = new ethers.utils.Interface([
    "function getParticipants(uint256 bountyId) public view returns (address[] memory, uint256[] memory)",
    "function getClaimsByBountyId(uint256 bountyId) public view returns (tuple(uint256 id, address issuer, uint256 bountyId, address bountyIssuer, string name, string description, uint256 createdAt, bool accepted)[] memory)"
  ]);

  const poidhContract = new ethers.Contract(poidhAddress, poidhInterface, deployer);

  const bountyContributors = await poidhContract.getParticipants(bountyId);

  console.log("Bounty contributors:", bountyContributors);

  const claims = await poidhContract.getClaimsByBountyId(bountyId);

  console.log("Claims:", claims);
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
