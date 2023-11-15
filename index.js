require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",

    ],
    credentials: true
}));

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.evacz3b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const menuCollection = client.db("bistroBossDB").collection("menuCollection");
    const reviewCollection = client.db("bistroBossDB").collection("reviewCollection");
    const cartsCollection = client.db("bistroBossDB").collection("cartsCollection");


    app.get("/api/v1/cart", async (req, res) => {
      try{

        const query = {userId : req.query.userId};

        const result = await cartsCollection.find(query).toArray();
        res.send(result); 

      } catch(err) {
        console.log(err.message);
      }
    })

    app.post("/api/v1/carts", async (req, res) => {
      try{  
        const data = req.body;
        const result = await cartsCollection.insertOne(data);

        res.send(result);

      } catch(err){
        console.log(err.message);
      }
    })

    app.get("/api/v1/menus", async (req, res) => {
        try{
            const result = await menuCollection.find().toArray();
            res.send(result);
        } catch(err) {
            console.log(err.message);
        }
    })

    app.get("/api/v1/reviews", async (req, res) => {
        try{
            const result = await reviewCollection.find().toArray();
            res.send(result);
        } catch(err) {
            console.log(err.message);
        }
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Welcome to bistro boss server😍😍😍");
})

app.listen(port, () => {
    console.log("listening on port", port);
});