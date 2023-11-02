const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// server running check
app.get('/', (req, res) => {
    res.send('This is Brand Shop server!');
});

// database
// Accessing Secrets
const { MONGO_URI, DB_NAME } = process.env;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        // create database and collections to store data
        const database = client.db(DB_NAME);
        const brandCollection = database.collection("brands");
        const productCollection = database.collection("products");
        const userCollection = database.collection("users");
        const cartCollection = database.collection("cart");

        // ------Brands APIs------

        // POST brand data
        app.post('/brands', async (req, res) => {
            try {
                const brand = req.body;
                const result = await brandCollection.insertOne(brand);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // GET brand data
        app.get('/brands', async (req, res) => {
            try {
                const cursor = brandCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // GET brand data by name
        app.get('/brands/:brandName', async (req, res) => {
            try {
                const name = req.params.brandName;
                const query = { brandName: name };
                const result = await brandCollection.findOne(query);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });



        // ------Products APIs------

        // POST product data
        app.post('/products', async (req, res) => {
            try {
                const product = req.body;
                const result = await productCollection.insertOne(product);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });



        // GET product data
        app.get('/products', async (req, res) => {
            try {
                const cursor = productCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // GET product data by id
        app.get('/products/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await productCollection.findOne(query);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // Update product data by id
        app.put('/products/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updateProduct = req.body;
                const filter = { _id: new ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        image: updateProduct.image,
                        name: updateProduct.name,
                        brand: updateProduct.brand,
                        type: updateProduct.type,
                        price: updateProduct.price,
                        description: updateProduct.description,
                        ratings: updateProduct.ratings,
                    },
                };

                const result = await productCollection.updateOne(filter, updateDoc, options);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // ------User APIs------

        // POST user data
        app.post('/users', async (req, res) => {
            try {
                const user = req.body;
                const result = await userCollection.insertOne(user);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // GET user data
        app.get('/users', async (req, res) => {
            try {
                const cursor = userCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });



        // ------Cart APIs------

        // POST cart data
        app.post('/carts', async (req, res) => {
            try {
                const cart = req.body;
                const result = await cartCollection.insertOne(cart);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // GET cart data
        app.get('/carts', async (req, res) => {
            try {
                const cursor = cartCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });


        // DELETE cart data
        app.delete('/carts/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await cartCollection.deleteOne(query);
                res.send(result);
            } catch (error) {
                res.status(500).send(error);
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // If MongoDB connection is successful, start the server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);
