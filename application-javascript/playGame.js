'use strict';

const { prettyJSONString } = require('./util.js');

async function playGame(contract, gameID) {
	try {
		console.log('\n--> PLAYING GAME');
		await contract.submitTransaction('PlayGame', gameID);

		const result = await contract.evaluateTransaction('QueryGame', gameID);

		console.log(`*** Result: ${result}`)

		console.log("\n--> GAME PLAYED:\n");

		const winnerRegex = /Winner:\s+(ORG\s+1|ORG\s+2|TIE)/i;
		const winnerMatch = result.toString().match(winnerRegex);

		if (winnerMatch) {
			const winner = winnerMatch[1].trim().toUpperCase();
			return winner;
		} else {
			console.log('No winner found');
		}

	} catch (error) {
		console.error(`******** FAILED to play Game: ${error}`);
	}
}

module.exports = { playGame };