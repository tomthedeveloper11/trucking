import mongoose from 'mongoose';
mongoose.Promise = global.Promise

export default async function connectDb() {
  try {
    const db = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Mongoose Connection Established');
    return db.connection;
  } catch (error) {
    console.log('Mongoose connection failed', error);
    throw error;
  }
}
