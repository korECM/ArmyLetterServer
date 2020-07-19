import mongoose from 'mongoose';

class DB {
  constructor() {}

  public async connect() {
    if (process.env.DB_URL) {
      try {
        await mongoose.connect(process.env.DB_URL);
        console.log('DB CONNECTED');
      } catch (error) {
        console.error(error);
      }
    } else {
      throw new Error('NO DB URL');
    }
  }
}

let db = new DB();

export default db;
