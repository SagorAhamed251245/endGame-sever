const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const port = process.env.PORT || 5000;

// /middleware
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// mongodb start

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ry6i5bk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });

    // collection start
    const usersCollection = client.db("endGame").collection("users");
    const collegesCollection = client.db("endGame").collection("colleges");
    const admittedCollegeCollection = client
      .db("endGame")
      .collection("admitted");

    // collection end

    //  user api start

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.patch("/updateUser/:id" , async (req, res) => {
      const id = req.params.id;
      const body = req.body
      const query = { _id: new ObjectId(id)}
      const result = await usersCollection.updateOne(query, {$set: body});
      res.send(result);
    })
    
    //  user api end

    // Colleges Api start

    app.get("/colleges", async (req, res) => {
      const colleges = await collegesCollection.find().toArray();
      res.send(colleges);
    });
    // Colleges Api end

    // admitted College api start
    app.post("/admission", async (req, res) => {
      const body = req.body;
      const result = await admittedCollegeCollection.insertOne(body);
      res.send(result);
    });

    app.get("/admitted/:email", async (req, res) => {
      const email = req.params.email;
      const query = { candidate_email: email };
      const result = await admittedCollegeCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateObject = req.body;
      const result = await admittedCollegeCollection.updateOne(query, {
        $set: updateObject,
      });
      res.send(result);
    });
    // admitted College api end

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb end
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
