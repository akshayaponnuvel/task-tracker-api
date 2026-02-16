jest.mock("../config/redis");

import request from "supertest";
import app from "../app";

let token: string;

beforeEach(async () => {
  const user = await request(app).post("/api/auth/signup").send({
    name: "Task User",
    email: "task@test.com",
    password: "123456"
  });

  const login = await request(app).post("/api/auth/login").send({
    email: "task@test.com",
    password: "123456"
  });

  token = login.body.token;
});

describe("Task API", () => {

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing",
        status: "pending"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");
  });

  it("should get tasks", async () => {

    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Task 1"
      });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

});
