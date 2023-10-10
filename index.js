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
const uri = "mongodb://your_username:your_password@mongodb:27017"; // เมื่อเปลี่ยน username และ password ในบรรทัดที่ 30, 31 ของ docker-compose.yml 
// "mongodb://      ^      :      ^      @mongodb:27017"           // ให้เปลี่ยนตรงส่วน ^


/************************************************************************************************************************************************/
// Create users (สร้าง users)
app.post("/users/create", async (req, res) => {

  const user = req.body;

  // ตรวจสอบความสมบูรณ์ของข้อมูล
  if (!user.id && !user.email && !user.password && !user.username) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  }

  // ตรวจสอบข้อมูลเพื่อไม่ให้ข้อมูลที่จะเป็นมีค่าเป็น null
  if (user.id == null || user.email == null || user.password == null || user.username == null) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  }

  // ตรวจสอบว่าอีเมลถูกต้องตามรูปแบบหรือไม่
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(user.email)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // หา ID
  const existingUser = await client
    .db("database")
    .collection("users")
    .findOne({ id: parseInt(user.id) });

  // ตรวจสอบว่ามี ID ที่ซ้ำกันในฐานข้อมูลหรือไม่
  if (existingUser) {
    res.status(400).send({
      status: "error",
      message: "User with the same ID already exists",
    });
    client.close();
    return;
  }

  // ส่วน client
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
  
  // ปิด client
  await client.close();

  // แสดงข้อความนีเมื่อทำการ create user สำเร็จ
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + user.id + " is created",
    user: user,
  });
});

/************************************************************************************************************************************************/
// Get users (เรียกดู users)
app.get("/users", async (req, res) => {
  const id = parseInt(req.params.id);

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // ส่วน client
  const users = await client
    .db("database")
    .collection("users")
    .find({})
    .toArray();
  
  // ปิด client
  await client.close();

  // แสดงข้อมูลที่ทำการ get ออกมา
  res.status(200).send({status: "ok", users});
});

/************************************************************************************************************************************************/
// Get users by ID (เรียกดู user แบบเลือกดูตาม ID)
app.get("/users/:id", async (req, res) => {

  const id = parseInt(req.params.id);

  // ตรวจสอบว่า ID ที่ใส่มีค่าหรือไม่
  if (isNaN(id)) {
    res.status(400).send({
      status: "error",
      message: "Invalid user ID",
    });
    return;
  }

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // ส่วน client
  const user = await client
    .db("database")
    .collection("users")
    .findOne({ id: id });

  // ถ้าไม่พบ user ให้ส่งข้อความนี้
  if (!user) {
    res.status(404).send({
      status: "error",
      message: "User not found",
    });
    return;
  }

  // ปิด client
  await client.close();

  // แสดงข้อมูลที่ทำการ get ออกมา
  res.status(200).send({
    status: "ok",
    user: user,
  });
});

/************************************************************************************************************************************************/
// Put users (แก้ไขข้อมูล users)
app.put("/users/update", async (req, res) => {
  const user = req.body;
  const id = parseInt(user.id);

  // ตรวจสอบว่าใส่ id หรือไม่
  if (!user.id) {
    res.status(400).send({
      status: "error",
      message: "Please enter ID",
    });
    return;
  }

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // ส่วน client
  await client
    .db("database")
    .collection("users")
    .updateOne({
      'id': id},
      {$set: {
        id: parseInt(user.id),
        email: user.email,
        password: user.password,
        username: user.username,
        nickname: user.nickname,
        birthday: user.birthday,
        address: user.address,
      },
    });

  // ปิด client
  await client.close();

  // แสดงข้อมูลที่ทำการ update ออกมา
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is updated",
    user: user,
  });
});

/************************************************************************************************************************************************/
// Login (เช็คผ่าน email และ password ที่กรอก)
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  // ตรวจสอบความสมบูรณ์ของข้อมูล
  // ไม่มีอีเมลไม่มีรหัสผ่าน
  if (!user.email && !user.password) {
    res.status(400).send({
      status: "error",
      message: "Incomplete user data",
    });
    return;
  } 
  
  // ไม่มีอีเมลมีรหัสผ่าน
  else if (!user.email && user.password) {
    res.status(400).send({
      status: "error",
      message: "Please enter email",
    });
    return;
  } 
  
  // มีอีเมลไม่มีรหัสผ่าน
  else if (user.email && !user.password){
    res.status(400).send({
      status: "error",
      message: "Please enter password",
    });
    return;
  }

  // ตรวจสอบว่าอีเมลถูกต้องตามรูปแบบหรือไม่
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(user.email)) {
    res.status(400).send({
      status: "error",
      message: "Invalid email format",
    });
    return;
  }

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // ส่วน client
  const user = await client
    .db("database")
    .collection("users")
    .findOne({ email: email, password: password });
  
  // ปิด client
  await client.close();

  // ถ้าพบ user ที่ตรงกันให้ส่งข้อความนี้
  if (user) {
    res.status(200).send({
      status: "ok",
      message: "Login successful",
      user: user,
    });
  } 
  
  // ถ้าไม่พบ user ที่ตรงกันให้ส่งข้อความนี้
  else {
    res.status(401).send({
      status: "error",
      message: "Login failed",
    });
  }
});

/************************************************************************************************************************************************/
// Logout
app.post("/users/logout", async (req, res) => {

  // ส่งข้อความนี้
  res.status(200).send({
    status: "ok",
    message: "Logout successful",
  });
});

/************************************************************************************************************************************************/
// Delete users by ID (ลบ users ผ่าน ID)
app.delete("/users/delete", async (req, res) => {
  const id = parseInt(req.body.id);

  // ตรวจสอบว่ามี ID ที่ใส่ไปเป็นตัวเลขที่ถูกต้องหรือไม่
  if (!id || isNaN(id)) {
    res.status(400).send({
      status: "error",
      message: "Please provide a valid ID to delete a user",
    });
    return;
  }

  // เชื่อม mongodb
  const client = new MongoClient(uri);
  await client.connect();

  // ตรวจสอบว่ามีผู้ใช้ที่มี ID ตรงกับ ID ที่ระบุหรือไม่
  const existingUser = await client
    .db("database")
    .collection("users")
    .findOne({ id: id });

  if (!existingUser) {
    res.status(404).send({
      status: "error",
      message: "User with ID = " + id + " not found",
    });
    return;
  }

  // ลบผู้ใช้โดยใช้ ID
  await client.db("database").collection("users").deleteOne({ id: id });

  // ปิด client
  await client.close();

  // แสดง ID ที่ทำการ delete
  res.status(200).send({
    status: "ok",
    message: "User with ID = " + id + " is deleted",
  });
});