#!/bin/bash
# Start test network
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca 


# Deploy chaincode
./network.sh deployCC -ccn rps -ccp ../rps/chaincode-java -ccl java -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -verbose

popd

# In a new tab start the node server in rps/application-javascript
npm start

# in a new tab start react front end client in rps/client
npm start