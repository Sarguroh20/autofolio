const {MongoClient} = require('mongodb');
async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    //const uri = "";
    const uri = ""
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  listDatabases(client);

        await create(client, {});

        await create_many(client, [{
            name: "ABC",
            skills: "A",
            project: "B",
            year_of_exp: 12,
            profession: "web",
            contact: 123456
    }]);

        await find(client, "ABC");

        await update(client, "ABC", {project:"B", project:"C"});

        await update_many(client);

        await del(client, "C")

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function create(client, newListing, id) {
    const res = await client.db("code").collection("Listings").insertOne(newListing);

    console.log(`Generated MongoDB ID: ${res.insertedId}`);
    return id;
}

async function create_many(client, newListing) {
    const res = await client.db("code").collection("Listings").insertMany(newListing);
    
    console.log(res.insertedIds)
}

async function find(client, Listingname){
    const res = await client.db("code").collection("Listings").findOne({name: Listingname});

    if(res){
        console.log(`Name found ${Listingname}`);
        console.log(res);
    }
    else{
        console.log(`Name not found`);
    }
} 

async function update(client, Listingname, updatedListing){
    const res = await client.db("code").collection("Listings").updateOne({name: Listingname}, {$set: updatedListing});

    console.log(`${res.modifiedCount} Documents Updated!`);
}

async function update_many(client, Listingname, updatedListing){
    const res = await client.db("code").collection("Listings").updateMany({skills: {$exists: false}}, {$set: {skills: "Unknown"}});

    console.log(`${res.modifiedCount} Documents Updated!`);
}

async function del(client, Listingname){
    const res = await client.db("code").collection("Listings").deleteOne({project: Listingname});

    console.log(`${res.deletedCount} Documents deleted`);
}