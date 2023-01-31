'use strict';

const { connectToOrg1CA, connectToOrg2CA } = require('./enrollAdmin.js');
const { registerOrg1User, registerOrg2User } = require('./registerEnrollUser');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./util.js');
const { Wallets, Gateway } = require('fabric-network');

const { createGame } = require('./createGame');
const { submitMove } = require('./submitMove');
const { playGame } = require('./playGame');

const path = require('path');

async function main() {
    const gameID = process.argv[2];
    const m1 = process.argv[3];
    const m2 = process.argv[4];

    const gateway1 = new Gateway();
    const gateway2 = new Gateway();

    if(!gameID || !m1 || !m2) {
        console.log("Please provide gameID move1 and move2 input parameters");
        return 0;
    }

    console.log('Memory usage before init:', process.memoryUsage());

    console.log("------ BUILDING CCPS ------");
    const ccp1 = buildCCPOrg1();
    const ccp2 = buildCCPOrg2();
    console.log("------ DONE ------");

    console.log("------ BUILDING WALLETS ------");

    const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
    const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

    const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
    const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

    console.log("------ DONE ------");
    console.log("------ CONNECTING TO CA / ENROLLING ADMINS ------");

    await connectToOrg1CA();
    await connectToOrg2CA();

    console.log("------ DONE ------");
    console.log("------ REGISTERING USERS ------");

    await registerOrg1User("player1");

    await registerOrg2User("player2");

    console.log("------ DONE ------");

    await gateway1.connect(ccp1,
        { wallet: walletOrg1, identity: "player1", discovery: { enabled: true, asLocalhost: true } });

    await gateway2.connect(ccp2,
        { wallet: walletOrg2, identity: "player2", discovery: { enabled: true, asLocalhost: true } });

    console.log("Creating game");

    await createGame(gateway1, gameID);

    console.log("Submitting moves");

    await submitMove(gateway1, "player1", gameID, m1);

    await submitMove(gateway2, "player2", gameID, m2);

    await playGame(gateway1, gameID);

    gateway1.disconnect();
    gateway2.disconnect();
    return;
}

main();