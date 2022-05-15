const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//user:dbuser1
//password : ZGQxKOfci4MoXTYo

const uri =
  "mongodb+srv://dbuser1:ZGQxKOfci4MoXTYo@cluster0.5j80z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

/* client.connect((err) => {
  const collection = client.db("test").collection("devices");
  console.log("db connected");
  // perform actions on the collection object
  client.close();
}); */

//uporer coder replace kre amra nicher ta dibo.
async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodexpress").collection("user");

    // client side data show krar way --get users.
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    //get specific user
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //POST user: add a new user
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      console.log("Adding new user", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // update user
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //delete a user from server side
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //basic practice hard code

    /* const user = { name: "Ayman", email: "ayman@gmail.com" };
    const result = await userCollection.insertOne(user);
    console.log(`User inserted with id : ${result.insertedId}`);
  } finally {
    //amra jokhon user k wait krie ekto por abr phire ashbe tokhon nicher code ta likhbo ,na hle dibo na.
    // await client.close();
   */
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running My CRUD Server Project");
});
app.listen(port, () => {
  console.log("CRUD Server is Running");
});
