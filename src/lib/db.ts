import mongoose from "mongoose";

let isConnected = false; // track connection

export async function connectDB() {
  if (isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.URL!);
    console.log(process.env.URL!);
    

    isConnected = !!conn.connections[0].readyState;
    console.log(" MongoDB connected:", conn.connection.host);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
