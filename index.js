const { MongoClient } = require("mongodb");

// for some reason we are not getting the env variable
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
const database_name = "sample_mflix";
const collection_name = "movies";

const title_to_find = "Cars";
const title_to_replace = "Cars 2012";

const aggregation_pipeline = [
  {
    $match: {
      title: title_to_find,
    },
  },
  {
    $addFields: {
      title: {
        $concat: ["$title", title_to_replace],
      },
    },
  },
  {
    $merge: {
      into: collection_name,
    },
  },
];

async function run() {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }
  await find();
  await aggregation();
}
run().catch(console.dir);

async function find() {
  try {
    await client.connect();
    const database = client.db(database_name);
    const movies = database.collection(collection_name);

    const query = { title: title_to_find };
    const movie = await movies.findOne(query);

    console.log(movie);
  } catch (e) {
    console.error("Error in find: ", e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function aggregation() {
  try {
    await client.connect();
    const coll = client.db(database_name).collection(collection_name);
    const cursor = coll.aggregate(aggregation_pipeline);

    const result = await cursor.toArray();
    console.log(result);
  } catch (e) {
    console.error("Error in aggregation: ", e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
