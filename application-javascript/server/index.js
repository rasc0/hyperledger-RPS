const express = require("express");
const { connectToOrg1CA, connectToOrg2CA } = require('../enrollAdmin.js');
const { registerOrg1User, registerOrg2User } = require('../registerEnrollUser');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('../util.js');
const { createGame } = require('../createGame');
const { submitMove } = require('../submitMove');
const { playGame } = require('../playGame');
const { Wallets } = require('fabric-network');
const path = require('path');
var cors = require('cors');
// var json = require('express');
const bp = require('body-parser')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
// app.use(json());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

let walletPathOrg1, walletPathOrg2;
let walletOrg1, walletOrg2;
let ccp1, ccp2;
let gameID;

let gameIndex = 0; // gets incremented on playGame()
let gameInProgress = false;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.post("/api/init", async (req, res) => {
  console.log("---------- Building ccps ----------");
  ccp1 = buildCCPOrg1();
  ccp2 = buildCCPOrg2();

  console.log("---------- Building Wallets ----------");

  walletPathOrg1 = path.join(__dirname, '../wallet/org1');
  walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

  walletPathOrg2 = path.join(__dirname, '../wallet/org2');
  walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

  console.log("---------- Connecting to Orgs (registering admins) ----------");
  await connectToOrg1CA();
  await connectToOrg2CA();

  console.log("---------- Registering users ----------");
  await registerOrg1User("player1");

  await registerOrg2User("player2");
  console.log("---------- Init done ----------");
});

// Create game
app.post("/api/createGame", async (req, res) => {
  console.log("CREATING GAME");
  if(gameInProgress) {
    return;
  }

  gameInProgress = true;
  gameID = "game" + gameIndex;

  const org = req.body.org;
  const user = req.body.user;

  console.log(org);
  console.log(user);
  console.log(gameID);

  if(org == "org1") {
    await createGame(ccp1, walletOrg1, user, gameID);
  } else {
    await createGame(ccp2, walletOrg2, user, gameID);
  }

  console.log("Game created: " + gameID);
})

// Submit move + play game if both moves submitted
app.post("/api/submitMove", async (req, res) => {
  

  gameInProgress = false;
  gameIndex++;
})
