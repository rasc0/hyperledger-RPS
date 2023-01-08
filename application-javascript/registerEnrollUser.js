/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser } = require('./CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./util.js');

const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';

async function registerOrg1User(UserID) {
	console.log('\n--> Register and enrolling new user');
	const ccpOrg1 = buildCCPOrg1();
	const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');

	const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
	const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

	await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, UserID, 'org1.department1');

}

async function registerOrg2User(UserID) {
	console.log('\n--> Register and enrolling new user');
	const ccpOrg2 = buildCCPOrg2();
	const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');

	const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
	const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

	await registerAndEnrollUser(caOrg2Client, walletOrg2, mspOrg2, UserID, 'org2.department1');

}

module.exports = {registerOrg1User, registerOrg2User};