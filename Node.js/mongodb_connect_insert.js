// test connect mongodb 
const {MongoClient} = require('mongodb');

// function de liste database
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// function d'insert de données
async function InsertData(client){
    const collTest = await client.db("testData").collection("myData");

    // const collText = await db.collection("myData");

    await collTest.insertOne({ name: 'Pierre Poulet-Mathis' });
    await collTest.insertOne({ name: 'Myriam Boué' });


};

// fontion de connection et de liste databases
async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    // const uri = "mongodb+srv://<username>:<password>@<your-cluster-url>/test?retryWrites=true&w=majority";
    const uri = "mongodb://localhost:27017"
     

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

    
    // connect to mongoDB and list databases
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // test list database
        await  listDatabases(client);

        // test inserts
        await  InsertData(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

// routine principale

main();