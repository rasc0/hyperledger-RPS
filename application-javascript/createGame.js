'use strict';

const { prettyJSONString } = require('./util.js');

async function createGame(contract ,gameID) {

	try {
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