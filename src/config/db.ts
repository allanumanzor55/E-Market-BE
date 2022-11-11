import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("DB connected");
  } catch (e) {
    console.log("Error connecting to db", e instanceof Error ? e.message : e);
    process.exit(1);
  }
};

export default connectDB;
