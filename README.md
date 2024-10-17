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

### Step 3: Install dependencies

```bash
npm i
```

### Step 4: Create .env file

Create a new account/address in your wallet (e.g. MetaMask or Rabby). This will be your deployer address which you will use in the scripts of this project. Send a small amount of DEGEN to this address to be able to deploy contracts.

Copy `.env.example` and create a `.env` file. Then enter the private key of your deployer address in it.

**Important:** The `.env` file is listed in `.gitignore` and it should never be added to the git repository (even if it's private on GitHub).

### Step 5: Scripts

Scripts is the most important folder. In this folder you'll find:

- A script to deploy a commemorative token (ERC-721 or ERC-20)
- A script to mint commemorative tokens to users who opened a claim for a given bounty ID

Each script has instructions how to run it in the first lines of the code.