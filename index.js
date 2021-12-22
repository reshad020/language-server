const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();

//middlewares
app.use(cors()); 
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('Languaage server is running')
})
app.listen(port, ()=>{
    console.log('Server is running',port);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        client.connect();
        const database = client.db('language-center');
        const courseCollection = database.collection('courses');
        const orderCollection = database.collection('orders');

        // Get Courses api
        app.get('/courses', async(req,res) =>{
            const cursor = courseCollection.find({});
            const courses = await cursor.toArray();
            res.send(courses);

        })
        app.get('/courses/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const course = await courseCollection.findOne(query);
            res.json(course);

        })

        app.post('/orders', async(req,res) =>{
            const order = req.body;

            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json(result);
            console.log('hit api');
    })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);