# เลือกฐานเริ่มต้นของระบบเป็น Node.js
FROM node:latest

# กําหนดไดเรกทอรีที่จะใช้เก็บโค้ดของแอป
WORKDIR /app

# คัดลอก package.json และ package-lock.json เพื่อติดตั้ง dependencies
COPY package*.json ./

# ติดตั้ง dependencies โดยใช้ npm
RUN npm install

# คัดลอกโค้ดทั้งหมดจากไดเรกทอรีปัจจุบันในคอนเทนเนอร์
COPY . .

# กําหนดพอร์ตที่ Express.js จะใช้ในการรันแอป
EXPOSE 3000

# คําสั่งที่ใช้ในการรันแอป
CMD ["npm", "start"]