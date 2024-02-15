const { MongoClient } = require("mongodb");

// for some reason we are not getting the env variable
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
  await find();
}
run().catch(console.dir);

async function find() {
  try {
    await client.connect();
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const query = { title: "Cars" };
    const movie = await movies.findOne(query);

    console.log(movie);
  } catch (e) {
    console.error("Error in find: ", e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
