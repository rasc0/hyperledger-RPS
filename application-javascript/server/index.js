'use strict';

const express = require("express");
const { connectToOrg1CA, connectToOrg2CA } = require('../enrollAdmin.js');
const { registerOrg1User, registerOrg2User } = require('../registerEnrollUser');
const { buildCCPOrg1, buildCCPOrg2, buildWallet, myChaincodeName, myChannel } = require('../util.js');
const { createGame } = require('../createGame');
const { submitMove } = require('../submitMove');
const { playGame } = require('../playGame');
const { revealMove } = require('../revealMove');
const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
var cors = require('cors');
const bp = require('body-parser')

const PORT = process.env.PORT || 3001;

//TODO: STATUSES: ENUM FOR OPEN, CLOSED, END

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

let gateway1, gateway2;
let network1, network2;
let contract1, contract2;

let status, winner;

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

  gateway1 = new Gateway();
  gateway2 = new Gateway();

  await gateway1.connect(ccp1,
    { wallet: walletOrg1, identity: "player1", discovery: { enabled: true, asLocalhost: true } });

  network1 = await gateway1.getNetwork(myChannel);
  contract1 = network1.getContract(myChaincodeName);
  contract1.addDiscoveryInterest({ name: myChaincodeName, collectionNames: ['Org1MSPPrivateCollection'] });

  await gateway2.connect(ccp2,
    { wallet: walletOrg2, identity: "player2", discovery: { enabled: true, asLocalhost: true } });
  
  network2 = await gateway2.getNetwork(myChannel);
  contract2 = network2.getContract(myChaincodeName);
  contract2.addDiscoveryInterest({ name: myChaincodeName, collectionNames: ['Org2MSPPrivateCollection'] });

  gameInProgress = true;
  status = "open";
  gameID = "game" + gameIndex;
  winner = null;

  await createGame(contract1, gameID);

  console.log("---------- Init done ----------");
}

const server = app.listen(PORT, () => {
  init();
  console.log(`Server listening on ${PORT}`);
});

process.on('SIGTERM', () => {
  gateway1.disconnect();
  gateway2.disconnect();
  debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    debug('HTTP server closed');
  })
})

// Create game
app.post("/api/createGame", async (req, res) => {
  if(gameInProgress) {
    console.log("Game in already in progress... " + gameID);
    return;
  }

  gameInProgress = true;
  status = "open";
  gameID = "game" + gameIndex;
  winner = null;

  let org = req.body.org;

  if(org == "org1") {
    await createGame(contract1, gameID);
  } else {
    await createGame(contract2, gameID);
  }

  res.send({id: gameID});
});

// Submit move + play game if both moves submitted
app.post("/api/submitMove", async (req, res) => {
  const org = req.body.org;
  const user = req.body.user;
  const move = req.body.move;
  console.log("Move submitted by: " + user + " (" + org + ")");

  if(org == "org1") {
    org1Move = true;
    await submitMove(contract1, gameID, move);
  } else {
    org2Move = true;
    await submitMove(contract2, gameID, move);
  }

  if(org1Move && org2Move) {
    await revealMove(contract1, gameID);
    await revealMove(contract2, gameID);

    winner = await playGame(contract1, gameID);

    gameInProgress = false;
    status = "played";
    org1Move = false;
    org2Move = false;
    gameIndex++;

    console.log("WINNER: " + winner);
  }
});

app.get("/api/gameInProgress/:org", async (req, res) => {

  const org = req.params.org;

  let played = org == "org1" ? org1Move : org2Move;

  let response = {
    inProgress: gameInProgress, 
    id: gameID,
    moveSubmitted: played,
    winner: (status == "played" ? winner : null)
  };

  res.send(response);
});