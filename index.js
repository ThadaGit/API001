const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const database = "my_database";

// ทดสอบว่าเชื่อม Port ถูกหรือไม่
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// เชื่อม mongodb แบบ auth (user: your_username, password: your_password)
const { MongoClient } = require("mongodb");
const url = "mongodb://your_username:your_password@mongodb:27017";

// Create users (สร้าง users)
app.post("/users/create", async (req, res) => {
  const user = req.body;
  const client = new MongoClient(url);
  await client.connect();
  await client
    .db("database")
    .collection("users")
    .insertOne({
      id: parseInt(user.id),
      email: user.email,
      password: user.password,
      username: user.username,
      nickname: user.nickname,
      birthday: user.birthday,
      address: user.address,
    });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + user.id + " is created",
    user: user,
  });
});

// Get users (เรียกดู users)
app.get("/users", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(url);
  await client.connect();
  const users = await client
    .db("database")
    .collection("users")
    .find({})
    .toArray();
  await client.close();
  res.status(200).send(users);
});

// Get users by ID (เรียกดู user แบบเลือกดูตาม ID)
app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const client = new MongoClient(uri);
  await client.connect();
  const user = await client.db("database").collection("users").findOne({ id: id });
  await client.close();
  res.status(200).send({
    status: "ok",
    user: user,
  });
});

// Put users (แก้ไขข้อมูล users)
app.put("/users/update", async (req, res) => {
  const user = req.body;
  const id = parseInt(user.id);
  const client = new MongoClient(url);
  await client.connect();
  await client
    .db("database")
    .collection("users")
    .updateOne({
      $set: {
        id: parseInt(user.id),
        email: user.email,
        password: user.password,
        username: user.username,
        nickname: user.nickname,
        birthday: user.birthday,
        address: user.address,
      },
    });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is updated",
    user: user,
  });
});

// Login (เช็คผ่าน email และ password ที่กรอก)
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const client = new MongoClient(url);
  await client.connect();
  const user = await client
    .db("database")
    .collection("users")
    .findOne({ email: email, password: password });
  await client.close();
  if (user) {
    res.status(200).send({
      status: "ok",
      message: "Login successful",
      user: user,
    });
  } else {
    res.status(401).send({
      status: "error",
      message: "Login failed",
    });
  }
});

// Logout
app.post("/users/logout", async (req, res) => {
  res.status(200).send({
    status: "ok",
    message: "Logout successful",
  });
});4

// Delete users by ID (ลบ users ผ่าน ID)
app.delete("/users/delete", async (req, res) => {
  const id = parseInt(req.body.id);
  const client = new MongoClient(url);
  await client.connect();
  await client.db("database").collection("users").deleteOne({ id: id });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is deleted",
  });
});