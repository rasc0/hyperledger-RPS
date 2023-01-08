'use strict';

const { Gateway } = require('fabric-network');
const path = require('path');
const { myChaincodeName, myChannel } = require('./util.js');

async function createGame(ccp,wallet,user,gameID) {
	try {

		const gateway = new Gateway();

		// Connect using Discovery enabled
		await gateway.connect(ccp,
			{ wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		let statefulTxn = contract.createTransaction('CreateGame');

		console.log('\n--> Submit Transaction: Propose a new game');
		await statefulTxn.submit(gameID);
		console.log('*** Result: committed');

		console.log('\n--> Evaluate Transaction: query the game that was just created');
		let result = await contract.evaluateTransaction('QueryGame', gameID);
		console.log('*** Result: Game: ' + result.toString());

		gateway.disconnect();
	} catch (error) {
		console.error(`******** FAILED to create Game: ${error}`);
	}
}

module.exports = {createGame};