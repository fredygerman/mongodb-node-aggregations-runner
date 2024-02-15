const { MongoClient } = require("mongodb");

// for some reason we are not getting the env variable
console.log(`MONGODB_URI: ${process.env.MONGODB_URI}`);

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);
const database = "sample_mflix";
const collection = "movies";

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

async function aggregation() {
  try {
    const pipeline = [
      {
        $match: {
          title: "Cars 2010 2012",
        },
      },
      {
        $addFields: {
          title: {
            $concat: ["$title", " 2012"],
          },
        },
      },
      {
        $merge: {
          into: collection,
        },
      },
    ];

    const coll = client.db(database).collection(collection);
    const cursor = coll.aggregate(pipeline);

    const result = await cursor.toArray();
    console.log(result);
  } catch (e) {
    console.error("Error in aggregation: ", e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
