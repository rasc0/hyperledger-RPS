# In fabric-samples/test-network - deploy test network
cd ../test-network
./network.sh down
./network.sh up createChannel -ca 

# Deploy chaincode
./network.sh deployCC -ccn rps -ccp ../rps/chaincode-java -ccl java -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -verbose -cccg ../rps/chaincode-java/collections-config.json

# In a new tab start the node server in rps/application-javascript
npm start

# in a new tab start react front end client in rps/client
# this should automatically open http://localhost:8000 which will provide 2 links, one to each org's player
npm start