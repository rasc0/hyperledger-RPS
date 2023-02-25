## Prerequisites and file structure:
Ensure that Hyperledger Fabric is installed: https://hyperledger-fabric.readthedocs.io/en/release-2.5/getting_started.html

Make sure to install the Fabric-Samples folder.

Once installed, add this repository to the Fabric-Samples folder such that /rps and /test-network are both in /fabric-samples:

Fabric-Samples/
<br>&nbsp;&nbsp;&nbsp;&nbsp;|-test-network/
<br>&nbsp;&nbsp;&nbsp;&nbsp;|-rps/
<br>&nbsp;&nbsp;&nbsp;&nbsp;|-...

## To Run:

### In fabric-samples/test-network - deploy test network
<code>
cd /test-network
./network.sh down
./network.sh up createChannel -ca 
</code>

##### Optionally, in another tab, deploy the docker monitoring script in fabric-samples/test-network
<code>
./monitordocker.sh
</code>

### Deploy chaincode
<code>
./network.sh deployCC -ccn rps -ccp ../rps/chaincode-java -ccl java -ccep "OR('Org1MSP.peer','Org2MSP.peer')" -verbose -cccg ../rps/chaincode-java/collections-config.json
</code>

### In a new tab start the node server in rps/application-javascript
<code>
npm start
</code>

### In a new tab start react front end client in rps/client
#### this should automatically open http://localhost:8000 which will provide 2 links, one to each org's player
<code>
npm start
</code>
