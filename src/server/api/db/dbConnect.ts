import mongoose, { Mongoose } from "mongoose";
import { env } from "~/env.mjs";

const MONGODB_URI = env.MONGODB_URI;

let cached: { conn?: Mongoose; promise?: Promise<Mongoose> } = {
  conn: undefined,
  promise: undefined,
};

async function dbConnect() {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
