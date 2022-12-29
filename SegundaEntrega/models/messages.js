import mongoose from 'mongoose';

const msgsCollection = 'productos';
const msgsSchema = new mongoose.Schema({
        user: String,
        msg: String,
      });

export const msgsModel = mongoose.model(msgsCollection, msgsSchema);