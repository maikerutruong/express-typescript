import mongoose from "mongoose";

export default async function () {
  try {
    const connected = mongoose.connect(process.env.DB_URL!, {});

    if (!connected) {
      throw Error;
    }

    console.log("Successfully connected to MongoDB Atlas!");
  } catch (e) {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(e);
  }
}
