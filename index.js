const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t81ez4s.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //get blog data
    const BlogsCollection = client.db('ToysDB').collection('Blogs')
    //get Collection method
    const toysCollection = client.db('ToysDB').collection('toysDetails')
    //get image collection
    const imageCollection = client.db('ToysDB').collection('images')
    app.get('/toysDetails', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const update = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(update)
      res.send(result)
    })
    //viewDetails
    app.get('/viewdetails/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      res.send(result)
    })
    // get own image 
    app.get("/gallery", async (req, res) => {
      const cursor = imageCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    ///get blogs data
    app.get('/blogs', async (req, res) => {
      const cursor = BlogsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    //filter data
    app.get("/toysDetails/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category }
      const cursor = toysCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
      console.log(result)
    })

    ///my toys finding 
    app.get("/myToys/:email", async (req, res) => {
      const toys = await toysCollection.find({ email: req.params.email }).toArray();
      res.send(toys);
    });
    //update  toys
    app.put("/updateToys/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedToys = {
        $set: {
          price: body.price,
          description: body.description,
          quantity: body.quantity
        },
      };
      const result = await toysCollection.updateOne(filter, updatedToys,);
      res.send(result);
    });
    ///delete data
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query)
      res.send(result)
    })
    //  search options create dynamic search
    app.get('/toysSearch/:search', async (req, res) => {
      const searchtext = req.params.search;
      const result = await toysCollection.find({
        $or: [
          { name: { $regex: searchtext, $options: "i" } },
          { category: { $regex: searchtext, $options: "i" } },],
      }).toArray();
      res.send(result);
      console.log(result)
    })
    // post collection method
    app.post('/toysDetails', async (req, res) => {
      const added = req.body;
      const result = await toysCollection.insertOne(added)
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Toys market is Running')
})
app.listen(port, () => {
  console.log(`Toys Market is running on  port ${port}`)
})