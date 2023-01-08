/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Auction extends Contract {

    async Init(stub) {
        // use the instantiate input arguments to decide initial chaincode state values

        // save the initial states
        await stub.putState(key, Buffer.from("TEsting stub state"));

        return shim.success(Buffer.from('HOTDOG!'));
    }

    // async GetSubmittingClientIdentity(ctx) {
    //     let IDasBytes = ctx.getSignedProposal().signature;
    //     return IDasBytes.toString();
    // }

    async CreateAuction(ctx, auctionID) {
        let clientId = "client";

        let clientOrgId = ctx.stub.getMspID();

        let bidders = [];
        let revealedBids = []

        const auction = {
            Type:         "auction",
            Price:        0,
            Seller:       clientId,
            Orgs:         clientOrgId,
            PrivateBids:  bidders,
            Bids:         revealedBids,
            Winner:       "",
            Status:       "open"
        }

        ctx.stub.putState(auctionID, Buffer.from(JSON.stringify(auction)));

    }

    async QueryAuction(ctx, auctionID) {
        let auctionJSON = ctx.stub.getState(auctionID);

        console.log(auctionJSON.toString());
        return auctionJSON.toString();
    }

    async Bid(ctx, auctionID, bidAmount) {
        let auctionJSON = ctx.stub.getState(auctionID);

        let bidID = ctx.stub.getTxID();

        let id = ctx.stub.getMspID();

        auctionJSON.Bids.push({bidId: bidID, clientID: id, bid: bidAmount});

        ctx.stub.putState(auctionID, Buffer.from(JSON.stringify(auctionJSON)));
    }

    async QueryBid(ctx, auctionID, bidID) {
        let auctionJSON = ctx.stub.getState(auctionID);

        const [key, bid] = Object.entries(auctionJSON.Bids).find(([key, bid]) => bid.bidId === bidID);
        return bid.toString();
    }

}

module.exports = Auction;
