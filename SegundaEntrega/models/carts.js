import mongoose from 'mongoose';

const cartsCollection = 'carts';
const cartsSchema = new mongoose.Schema({
        usuario: String,
        productos: Array,
      });

export const cartsModel = mongoose.model(cartsCollection, cartsSchema);