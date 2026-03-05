import prisma from "./lib/prisma.js";
console.log("SERVER STARTED");
async function testDB() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testDB();