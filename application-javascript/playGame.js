'use strict';

const { Gateway } = require('fabric-network');
const path = require('path');
const { myChaincodeName, myChannel, prettyJSONString } = require('./util.js');

async function playGame(ccp,wallet,user,gameID) {
	try {

		const gateway = new Gateway();

		// Connect using Discovery enabled
		await gateway.connect(ccp,
			{ wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		console.log('\n--> Submit Transaction: Play game');
		let result = await contract.submitTransaction('PlayGame', gameID);
		console.log('*** Result: committed');

		console.log('\n--> Evaluate Transaction: query the game that was just modified');
		result = await contract.evaluateTransaction('QueryGame', gameID);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`)

		gateway.disconnect();
	} catch (error) {
		console.error(`******** FAILED to play Game: ${error}`);
	}
}

module.exports = { playGame };