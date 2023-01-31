'use strict';

const { myChaincodeName, myChannel, prettyJSONString } = require('./util.js');

async function playGame(gateway, gameID) {
	try {
		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		console.log('\n--> PLAYING GAME');
		let result = await contract.submitTransaction('PlayGame', gameID);

		result = await contract.evaluateTransaction('QueryGame', gameID);

		console.log(`*** Result: ${prettyJSONString(result.toString())}`)

		console.log("\n--> GAME PLAYED:\n");

		const jsonWinner = JSON.parse(result.toString());

		return jsonWinner["winner"];

	} catch (error) {
		console.error(`******** FAILED to play Game: ${error}`);
	}
}

module.exports = { playGame };