jest.mock("../config/redis");

import request from "supertest";
import app from "../app";

describe("Auth API", () => {

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Test",
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@test.com");
  });

  it("should login a user", async () => {

    await request(app).post("/api/auth/signup").send({
      name: "Test",
      email: "login@test.com",
      password: "123456"
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
