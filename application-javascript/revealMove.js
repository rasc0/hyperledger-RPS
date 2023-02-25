'use strict';

async function revealMove(contract, gameID) {
	try {
		console.log('\n--> REVEALING MOVE');
		let result = await contract.submitTransaction('RevealMove', gameID);

		result = await contract.evaluateTransaction('QueryGame', gameID);

		console.log(`*** Result: ${result}`)

		console.log("\n--> MOVE REVEALED\n");

	} catch (error) {
		console.error(`******** FAILED to reveal moves: ${error}`);
	}
}

module.exports = { revealMove };