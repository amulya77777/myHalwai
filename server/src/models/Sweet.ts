import { Schema, model, Document } from "mongoose";

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const SweetSchema = new Schema<ISweet>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export default model<ISweet>("Sweet", SweetSchema);
