const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express()
const port=process.env.PORT||5000;
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion } = require('mongodb');
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
      const BlogsCollection=client.db('ToysDB').collection('Blogs')

      //get Collection method
      const toysCollection=client.db('ToysDB').collection('toysDetails')
      app.get('/toysDetails',async(req,res)=>{
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      })
      ///get blogs data
      app.get('/blogs',async(req,res)=>{
        const cursor=BlogsCollection.find()
       const  result=await cursor.toArray()
        res.send(result)
      })
      //filter data
      app.get("/toysDetails/:category",async(req,res)=>{
        const category =req.params.category;
        const query={category:{category}}
        const cursor = toysCollection.find(query);
         const result = await cursor.toArray();
        res.send(result)
        console.log(result)
      })

      // post collection method
      app.post('/toysDetails',async(req,res)=>{
        const added=req.body;
        const result= await toysCollection.insertOne(added)
        res.send(result)
      })

    // await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
res.send('Toys market is Running')
})
app.listen(port,()=>{
    console.log(`Toys Market is running on  port ${port}`)
})