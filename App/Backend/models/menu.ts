import mongoose from 'mongoose';

const Schema = mongoose.Schema;

//Layout of each menu item object
const menuSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
})

export default mongoose.model('menu', menuSchema);