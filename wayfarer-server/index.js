const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require("dotenv");
dotenv.config();

// Express cors server setup
const express = require("express");
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8008;

app.get("/", (req, res) => {
  res.send("Hello from express server!!");
});

app.listen(port, () => {
  console.log(`Wayfarer server app listening on port ${port}`);
});

// MongoDB connection URI
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//jwks

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

//middleware

const verifyToken = async (req, res, next) => {
  const authHeader = req?.headers.authorization
  if(!authHeader){
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
  const token = authHeader.split(" ")[1]
  if(!token) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }


  try {
    const {payload} = await jwtVerify(token, JWKS)

    console.log(payload)

    next()
  }
  catch (error) {
    return res.status(403).json({message: "Forbidden"})
  }


}

async function run() {
  try {
    // Connect the client to the server
    // await client.connect();

    const db = client.db("wayfarer");

    const destinationCollection = db.collection("destinations");
    const bookingCollection = db.collection("bookings");

    // Api get bookings of users
    app.get("/bookings/:userId", async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({userId: userId}).toArray();
      res.json(result);
    });

    // Api to post bookings of users
    app.post("/bookings", verifyToken, async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData);

      res.json(result);
    });

    // api to delete booking of a person

    app.delete("/bookings/:bookingId", verifyToken, async (req, res) => {
      const {bookingId} = req.params;

      const result = await bookingCollection.deleteOne({_id: new ObjectId(bookingId)})

      res.json(result);
    })


    // API endpoint to add a new destination
    app.post("/destinations", async (req, res) => {
      const destinationData = req.body;

      console.log(destinationData);

      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    });

    // API endpoint to get all destinations
    app.get("/destinations", async (req, res) => {
      const result = await destinationCollection.find().toArray();

      res.json(result);
    });

    // API endpoint to get a single destination by ID
    //middleware
    app.get("/destinations/:id", verifyToken ,async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.findOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    // API endpoint to update a destination by ID
    app.patch("/destinations/:id", verifyToken, async (req, res) => {
      const { id } = req.params;

      const updatedData = req.body;

      const result = await destinationCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData },
      );

      res.json(result);
    });

    // API endpoint to delete a destination by ID

    app.delete("/destinations/:id", verifyToken, async (req, res) => {
      const { id } = req.params;

      const result = await destinationCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.json(result);
    });

    // await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
