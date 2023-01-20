'use strict';

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
const bp = require('body-parser')

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

let walletPathOrg1, walletPathOrg2;
let walletOrg1, walletOrg2;
let ccp1, ccp2;
let gameID;

let gameIndex = 0; // gets incremented on playGame()
let gameInProgress = false;

let org1Move = false;
let org2Move = false; 


async function init() {
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
}

app.listen(PORT, () => {
  init();
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Create game
app.post("/api/createGame", async (req, res) => {
  console.log("CREATING GAME");
  if(gameInProgress) {
    console.log("Game in already in progress... " + gameID);
    return;
  }

  gameInProgress = true;
  gameID = "game" + gameIndex;

  let org = req.body.org;
  let user = req.body.user;

  console.log(org);
  console.log(user);
  console.log(gameID);

  if(org == "org1") {
    await createGame(ccp1, walletOrg1, user, gameID);
  } else {
    await createGame(ccp2, walletOrg2, user, gameID);
  }

  console.log("Game created: " + gameID);
  res.send({id: gameID});
});

// Submit move + play game if both moves submitted
app.post("/api/submitMove", async (req, res) => {
  const org = req.body.org;
  const user = req.body.user;
  const move = req.body.move;
  console.log("Move submitted by:" + user);
  console.log(move);

  if(org == "org1") {
    org1Move = true;
    await submitMove(ccp1, walletOrg1, user, gameID, move);
  } else {
    org2Move = true;
    await submitMove(ccp2, walletOrg2, user, gameID, move);
  }

  gameIndex++;

  if(org1Move && org2Move) {
    gameInProgress = false;
    console.log("PLAYING GAME");
    org1Move = false;
    org2Move = true;
    if(org == "org1") {
      await playGame(ccp1, walletOrg1, user, gameID);
    } else {
      await playGame(ccp2, walletOrg2, user, gameID);
    }
  }
});

app.get("/api/gameInProgress/:org", async (req, res) => {

  const org = req.params.org;

  let played = org == "org1" ? org1Move : org2Move;

  let response = {
    inProgress: gameInProgress, 
    id: gameID,
    moveSumbitted: played
  };

  res.send(response);
});

app.get("/api/")
