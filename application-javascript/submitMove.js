'use strict';

const { prettyJSONString } = require('./util.js');

async function submitMove(contract, gameID, move) {
	try {

		console.log('\n--> SUBMITTING MOVE');
		await contract.submitTransaction('SubmitMove', gameID, move);

		let result = await contract.evaluateTransaction('QueryGame', gameID);

		console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		console.log("\n--> MOVE SUBMITTED");

	} catch (error) {
		console.error(`******** FAILED to submit move: ${error}`);
	}
}

module.exports = { submitMove };