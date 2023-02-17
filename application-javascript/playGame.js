'use strict';

const { prettyJSONString } = require('./util.js');

async function playGame(contract, gameID) {
	try {
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