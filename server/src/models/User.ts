import mongoose, { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "user" | "admin";

export interface CartItem {
  _id?: string;
  sweet: mongoose.Types.ObjectId;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: Role;
  cart: CartItem[];
  comparePassword(candidate: string): Promise<boolean>;
}

const CartItemSchema = new Schema<CartItem>(
  {
    sweet: { type: Schema.Types.ObjectId, ref: "Sweet", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    cart: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default model<IUser>("User", UserSchema);
