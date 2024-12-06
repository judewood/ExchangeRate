import { app } from "@app/app";
import request from "supertest";

describe("GET /", () => {
  it("returns the exchange rate", async () => {
    const response = await request(app).get("/exchange/GBP/GBP");

    expect(response.status).toEqual(200);
    expect(response.text).toEqual(
      "The exchange rate between GBP and GBP is 1"
    );
  });
});
