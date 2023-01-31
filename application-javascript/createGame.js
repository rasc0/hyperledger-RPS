'use strict';

const { Gateway } = require('fabric-network');
const { myChaincodeName, myChannel, prettyJSONString } = require('./util.js');

async function createGame(gateway ,gameID) {

	try {
		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		console.log('\n--> CREATING GAME');
		await contract.submitTransaction('CreateGame', gameID);

		let result = await contract.evaluateTransaction('QueryGame', gameID);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`)

		console.log("\n--> GAME CREATED");

	} catch (error) {
		console.error(`******** FAILED to create Game: ${error}`);
	}

}

module.exports = {createGame};