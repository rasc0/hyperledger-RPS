'use strict';

const { myChaincodeName, myChannel, prettyJSONString } = require('./util.js');

async function submitMove(gateway, user, gameID, move) {
	try {
		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		console.log('\n--> SUBMITTING MOVE');
		await contract.submitTransaction('SubmitMove', gameID, user, move);

		let result = await contract.evaluateTransaction('QueryGame', gameID);

		console.log(`*** Result: ${prettyJSONString(result.toString())}`);

		console.log("\n--> MOVE SUBMITTED");

	} catch (error) {
		console.error(`******** FAILED to submit move: ${error}`);
	}
}

module.exports = { submitMove };