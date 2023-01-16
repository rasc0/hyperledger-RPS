'use strict';

const { Gateway } = require('fabric-network');
const path = require('path');
const { myChaincodeName, myChannel, prettyJSONString } = require('./util.js');

async function submitMove(ccp,wallet,user,gameID, move) {
	try {

		const gateway = new Gateway();

		// Connect using Discovery enabled
		await gateway.connect(ccp,
			{ wallet: wallet, identity: user, discovery: { enabled: true, asLocalhost: true } });

		const network = await gateway.getNetwork(myChannel);
		const contract = network.getContract(myChaincodeName);

		console.log('\n--> Submit Move');
		await contract.submitTransaction('SubmitMove', gameID, user, move);
		console.log('*** Result: committed');

		console.log('\n--> Evaluate Transaction: query the game that was just modified');
		let result = await contract.evaluateTransaction('QueryGame', gameID);
		console.log(`*** Result: ${prettyJSONString(result.toString())}`);
		
		console.log('\n--> Evaluate Transaction: query all games');
		let results = await contract.evaluateTransaction('queryAllGame');
		console.log('*** Result: Game: ' + results.toString());

		gateway.disconnect();
	} catch (error) {
		console.error(`******** FAILED to submit move: ${error}`);
	}
}

module.exports = { submitMove };