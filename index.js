require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const userCollection = client.db("bistroBossDB").collection("userCollection");
    const menuCollection = client.db("bistroBossDB").collection("menuCollection");
    const reviewCollection = client.db("bistroBossDB").collection("reviewCollection");
    const cartsCollection = client.db("bistroBossDB").collection("cartsCollection");

    // middlewares

    const verifyToken = (req, res, next) => {

    };

    // jwt related api methods
    app.post("/api/v1/jwt", async (req, res) => {
      try{

        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "3h"} );

        res.send({token});

      } catch(err){
        console.log(err.message);
      }
    })


// user related api methods
    app.post("/api/v1/users", async (req, res) => {
      try{
        const userInfo = req.body;
        
        const query = {email : userInfo.email};

        const isExist = await userCollection.findOne(query);
        
        if(isExist) {
          return res.send({message: "User already exists"});
        }

        const result = await userCollection.insertOne(userInfo);
        res.send(result);

      } catch (err) {
        console.log(err.message);
      }
    })

    app.get("/api/v1/user", async (req, res) => {
      try{
        const query = {email: req.query.email};
        const result = await userCollection.findOne(query);

        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    })


// recipe related api methods
    app.get("/api/v1/cart", async (req, res) => {
      try{

        const query = {userEmail : req.query.userEmail};

        const result = await cartsCollection.find(query).toArray();
        res.send(result); 

      } catch(err) {
        console.log(err.message);
      }
    })

    app.delete("/api/v1/carts/:id", async(req, res) => {
      try{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};

        const result = await cartsCollection.deleteOne(query);
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