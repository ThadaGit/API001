const express = require("express")
const cors = require('cors')
const app = express()
const port = 3000;

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
    res.send(`Hello World`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

const { MongoClient } = require("mongodb");
const uri = "mongodb://root:example@localhost:27017";

app.post('/users/create', async(req, res) => {
    const user = req.body;
    const client = new MongoClient(uri);
    await client.connect();
    await client.db('mydb').collection('users').insertOne({
      id: parseInt(user.id),
      email: user.email,
      password: user.password,
      username: user.username,
      nickname: user.nickname,
      birthday:user.birthday,
      address: user.address
    });
    await client.close();
    res.status(200).send({
      "status": "ok",
      "message": "User with ID = "+user.id+" is created",
      "user": user
    });
  })

