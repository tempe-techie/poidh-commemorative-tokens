# POIDH commemorative tokens

This is a project through which you can launch commemorative tokens (ERC-721 or ERC-20) and then mint them to users who opened a claim for a given bounty ID.

## Quickstart

### Step 1: Install VS Code or Cursor

Get VS Code here: https://code.visualstudio.com/

Or Cursor here: https://cursor.sh/

### Step 2: Install Node.js

Open VS Code or Cursor and then open the terminal. There are many ways to open a terminal in VS Code, for example:
- In the menu bar find `Terminal` > `New Terminal`
- Or watch this video: https://www.youtube.com/watch?v=eZAT6fwMVgY

After you opened the terminal, run the following command to check if Node.js is installed:

```bash
node -v # should print the version of Node.js
```

If you don't have Node.js installed, go here and install the v18.x version for your OS: https://nodejs.org/en/download/prebuilt-installer

### Step 3: Install GitHub Desktop

If you don't have Git on your computer yet, install GitHub Desktop: https://desktop.github.com/

### Step 4: Download repository code to your computer

Go to https://github.com/tempe-techie/poidh-commemorative-tokens

Click the green **Code** button and then click **Open with GitHub Desktop**.

### Step 5: Install dependencies

Open VS Code or Cursor. The click on **File** > **Open Folder** (in the menu bar) and then select the folder named `poidh-commemorative-tokens`.

After you opened the folder, open the terminal in VS Code/Cursor (the same as in Step 2) and run the following command:

```bash
npm i
```

This command will install all the dependencies of the project.

### Step 6: Create .env file

Create a new account/address in your wallet (e.g. MetaMask or Rabby). This will be your deployer address which you will use in the scripts of this project. Send a small amount of DEGEN to this address to be able to deploy contracts.

Copy `.env.example` and create a `.env` file. Then enter the private key of your deployer address in it.

**Important:** The `.env` file is listed in `.gitignore` and it should never be added to the git repository (even if it's private on GitHub).

### Step 7: Scripts

Scripts is the most important folder. In this folder you'll find:

- A script to deploy a commemorative token (ERC-721 or ERC-20)
- A script to mint commemorative tokens to users who opened a claim for a given bounty ID

Each script has instructions how to run it in the first lines of the code.

**EXAMPLE:**

Let's say you want to create a commemorative ERC-721 (NFT) token for claimers of some POIDH bounty.

Steps:

1. Go to `scripts/token/createErc721.js`.
2. Fill out the variables in the script (for owner address you can enter your personal address). Description and image can be changed later.
3. After you fill all the variables, run the script with this command:

```bash
npx hardhat run scripts/token/createErc721.js --network degen
```

4. The script will print the newly created NFT address to the console. Store it somewhere (you will need it in the next step). The script will also automatically verify the contract on Degen Chain explorer. If verification fails, you'll see instructions in the console on how to verify it using a command which will be printed in the console.
5. Next go to `scripts/airdrop/airdropToClaimers.js`.
6. Fill out the variables in the script. Make sure that the token address is the same as the one you got in the previous step (the NFT address). Also make sure that the bounty ID is correct.
7. After you fill all the variables, run the script with this command:

```bash
npx hardhat run scripts/airdrop/airdropToClaimers.js --network degen
```

8. Observe what's happening in the console. If everything went well, the script will mint NFTs to all claimers of the given bounty.
9. If new claimers appear after the script has been run, you can run the script again. Claimers who have already received an NFT will not receive it again.
10. If an error occurs, try to run the script again. But take note of the error message (maybe you have run out of DEGEN to pay for the gas fees).



