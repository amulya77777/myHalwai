import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sweet_shop_test_auth"
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe("Auth", () => {
  it("signs up & logs in", async () => {
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({ email: "a@b.com", password: "secret1", name: "Nimit" })
      .expect(201);
    expect(signup.body.token).toBeDefined();

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@b.com", password: "secret1" })
      .expect(200);
    expect(login.body.token).toBeDefined();
  });
});
