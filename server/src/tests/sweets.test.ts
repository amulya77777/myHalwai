import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";
import User from "../models/User";

let adminToken: string;

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sweet_shop_test_sweets"
  );
  const admin = await User.create({
    email: "admin@x.com",
    password: "secret1",
    name: "Admin",
    role: "admin",
  });
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@x.com", password: "secret1" });
  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

it("creates and lists sweets", async () => {
  await request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Gulab Jamun",
      category: "Indian",
      price: 20,
      quantity: 50,
      imageUrl: "https://img.com/gj.jpg",
    })
    .expect(201);

  const list = await request(app)
    .get("/api/sweets")
    .set("Authorization", `Bearer ${adminToken}`)
    .expect(200);

  expect(list.body.length).toBe(1);
});
