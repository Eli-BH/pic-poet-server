// server.test.js
const request = require("supertest");
const app = require("./server");
const jwt = require("jsonwebtoken");

describe("API Endpoints", () => {
  let token;

  beforeAll(() => {
    // Generate a token for testing
    const payload = { info: "test payload" };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  it("should create a new JWT", async () => {
    const res = await request(app).get("/api/token");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should access the secure endpoint with JWT", async () => {
    const res = await request(app)
      .get("/api/get-api-key")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("apiKey", process.env.OPENAI_API_KEY);
  });

  it("should fail to access the secure endpoint without JWT", async () => {
    const res = await request(app).get("/api/get-api-key");
    expect(res.statusCode).toEqual(401);
  });

  it("should fail to access the secure endpoint with invalid JWT", async () => {
    const res = await request(app)
      .get("/api/get-api-key")
      .set("Authorization", "Bearer invalidtoken123");
    expect(res.statusCode).toEqual(403);
  });
});
