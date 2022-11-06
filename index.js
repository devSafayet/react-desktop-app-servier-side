const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware 
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://desktop-app:y3sf2ihyZp8NVBKA@cluster0.j13ehti.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const appCollection = client.db("desktop-app").collection("services");

        // get api to read all services
        //http://localhost:5000/services
        app.get("/services", async (req, res) => {
            const q = req.query;
            console.log(q);
            const cursor = appCollection.find(q);
            const result = await cursor.toArray();
            res.send(result);
        });
        // create api 
        app.post("/service", async (req, res) => {
            const data = req.body;
            console.log("from post api", data);
            const result = await appCollection.insertOne(data);
            res.send(result);
        });
        // update api
        //http://localhost:4000/service/:id
        app.put("/service/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("from update api", data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData,
                },
            };

            const result = await appCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            // console.log('from put method',id)
            res.send(result);
        });

        // delete service
        //http://localhost:4000/service/:id
        app.delete("/service/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const result = await appCollection.deleteOne(filter);

            res.send(result);
        });

        // perform actions on the collection object
        // client.close();
        console.log('connect db');
    } finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello server mama')
})

app.listen(port, () => {
    console.log('server mama choltece', port)
});