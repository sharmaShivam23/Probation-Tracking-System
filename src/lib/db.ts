// import mongoose from "mongoose";

// let isConnected = false; // track connection

// export async function connectDB() {
//   if (isConnected) {
//     // console.log("✅ Using existing database connection");
//     return;
//   }

//   try {
//     const conn = await mongoose.connect(process.env.URL!);
//     // console.log(process.env.URL!);
    

//     isConnected = !!conn.connections[0].readyState;
//     console.log(" MongoDB connected:", conn.connection.host);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// }


import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    // console.log("Using existing MongoDB connection");
    return;
  }

  if (!process.env.URL) {
    // console.error("❌ MongoDB URL not found in environment variables");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.URL, {
      // You can add more options if needed
      serverSelectionTimeoutMS: 10000, // 10s timeout instead of waiting forever
    });

    isConnected = conn.connections[0].readyState === 1;
    // console.log("✅ MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
