# API

เป็น API พื้นฐานที่จะมี ส่วนของ Login logout create get getbyid และ delete มาให้ โดยจะเป็น API ที่สร้างโดยใช้ ExpressJS และ MongoDB โดยจะลงผ่าน Docker สร้างเป็น container

## Program

1. VSCode
2. Postman
3. Docker

## How to install

วิธีการติดตั้ง

```bash
git clone https://github.com/ThadaGit/API001.git
cd API001
docker-compose up
```

## How to use

วิธีการใช้งานคือให้ใช้งานผ่าน Postman

## 1.Create

1.1) ให้ทำการปรับ method เป็น POST

1.2) กรอก url

```bash
localhost:3000/users/create
```

1.3) เลือก Body > raw > JSON

1.4) เพิ่มข้อมูล (ตัวอย่าง)

```bash
{
  "id": 1,
  "email": "test123@gmail.com",
  "password": "1234",
  "username": "Test",
  "nickname": "test1234",
  "birthday": "10/10/10",
  "address": "moon"
  }
```

1.5) กด Send

## 2.Get

2.1) ให้ทำการปรับ method เป็น GET

2.2) กรอก url

```bash
localhost:3000/users
```

2.3) กด Send

## 3.Get by ID

3.1) ให้ทำการปรับ method เป็น GET

3.2) กรอก url (ตัวอย่าง เราจะใส่เลข Id อะไรก็ได้)

```bash
localhost:3000/users/1
```

3.3) กด Send

## 4.Update

4.1) ให้ทำการปรับ method เป็น PUT

4.2) กรอก url

```bash
localhost:3000/users/update
```

4.3) เลือก Body > raw > JSON

4.4) เพิ่มข้อมูล (ตัวอย่าง)

```bash
{
    "id": 1,
    "email": "test3@gmail.com",
    "password": "1234",
    "username": "Test",
    "nickname": "test1234",
    "birthday": "10/10/10",
    "address": "moon"
}
```

4.5) กด Send

## 5.Login

5.1) ให้ทำการปรับ method เป็น POST

5.2) กรอก url

```bash
localhost:3000/users/login
```

5.3) เลือก Body > raw > JSON

4.4) เพิ่มข้อมูล (ตัวอย่าง)

```bash
{
    "email": "test3@gmail.com",
    "password": "1234",
}
```

5.5) กด Send

## 6.Logout

6.1) ให้ทำการปรับ method เป็น POST

6.2) กรอก url

```bash
localhost:3000/users/logout
```

6.3) กด Send

## 7.Delete

7.1) ให้ทำการปรับ method เป็น DELETE

7.2) กรอก url

```bash
localhost:3000/users/delete
```

7.3) เลือก Body > raw > JSON

7.4) ใส่ id (ตัวอย่าง)

```bash
{
    "id": 1
}
```

7.5) กด Send
