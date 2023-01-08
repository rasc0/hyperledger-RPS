'use strict';

const { connectToOrg1CA, connectToOrg2CA } = require('./enrollAdmin.js');
const { registerOrg1User, registerOrg2User } = require('./registerEnrollUser');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./util.js');
const { Wallets } = require('fabric-network');

const { createGame } = require('./createGame');
const { submitMove } = require('./submitMove');
const { playGame } = require('./playGame');

const prompt = require('prompt');


const path = require('path');

async function main() {
    console.log("------ BUILDING CCPS ------");
    const ccp1 = buildCCPOrg1();
    const ccp2 = buildCCPOrg2();
    console.log("------ DONE ------");


    console.log("------ BUILDING WALLETS ------");
    // should add check to do only if they don't exist - and clear after each run

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

    console.log("Creating game");

    const gameID = "game1";

    await createGame(ccp1, walletOrg1, "player1", gameID);

    const properties = [
    {
        name: 'move1',
        validator: /^[a-zA-Z\s-]+$/,
        warning: 'Username must be only letters, spaces, or dashes'
    },
    {
        name: 'move2',
        validator: /^[a-zA-Z\s-]+$/,
        warning: 'Username must be only letters, spaces, or dashes'
    }
    ];

    prompt.start();

    prompt.get(properties, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        }
        await submitMove(ccp1, walletOrg1, "player1", gameID, result.move1);
        await submitMove(ccp2, walletOrg2, "player2", gameID, result.move2);
        await playGame(ccp1, walletOrg1, "player1", gameID);
    });
}

main();