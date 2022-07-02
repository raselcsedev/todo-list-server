const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.km5ck.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('Database connected');
        const tasksCollection = client.db('todo_list').collection('tasks');


        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        });

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = tasksCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From TODO ')
})

app.listen(port, () => {
    console.log(`TODO app listening on port ${port}`)
})