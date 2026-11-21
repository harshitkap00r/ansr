import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import * as products from "../src/services/productService";
import * as email from "../src/services/emailService";

vi.mock("../src/services/productService", () => ({
  getAllProducts: vi.fn(), getProductById: vi.fn(), getAllCategories: vi.fn(),
  getProductsByCategory: vi.fn(), searchProducts: vi.fn(), getFeaturedProducts: vi.fn(),
}));
vi.mock("../src/services/emailService", () => ({ sendEnquiryEmail: vi.fn() }));

const sample = (id=1, rate=4.5) => ({ id, title: `Product ${id}`, price: 10, category: "electronics", description: "A useful item", image: "image.jpg", rating: { rate, count: 20 } });
const productMocks = vi.mocked(products);
const emailMock = vi.mocked(email.sendEnquiryEmail);

beforeEach(() => vi.clearAllMocks());

describe("health endpoint", () => {
  it("returns OK", async () => { const res = await request(app).get("/health"); expect(res.status).toBe(200); expect(res.body).toEqual({ status: "OK" }); });
});

describe("product endpoints", () => {
  it("returns all products", async () => { productMocks.getAllProducts.mockResolvedValue([sample()]); const res=await request(app).get("/api/products"); expect(res.status).toBe(200); expect(res.body).toHaveLength(1); });
  it("searches when search query is supplied", async () => { productMocks.searchProducts.mockResolvedValue([sample()]); const res=await request(app).get("/api/products?search=shoe"); expect(res.status).toBe(200); expect(productMocks.searchProducts).toHaveBeenCalledWith("shoe"); });
  it("uses all products for blank search", async () => { productMocks.getAllProducts.mockResolvedValue([]); await request(app).get("/api/products?search=%20%20"); expect(productMocks.getAllProducts).toHaveBeenCalled(); expect(productMocks.searchProducts).not.toHaveBeenCalled(); });
  it("returns a product by id", async () => { productMocks.getProductById.mockResolvedValue(sample(5)); const res=await request(app).get("/api/products/5"); expect(res.status).toBe(200); expect(res.body.id).toBe(5); expect(productMocks.getProductById).toHaveBeenCalledWith(5); });
  it("returns categories", async () => { productMocks.getAllCategories.mockResolvedValue(["electronics"]); const res=await request(app).get("/api/products/categories"); expect(res.status).toBe(200); expect(res.body).toEqual(["electronics"]); });
  it("returns products in category", async () => { productMocks.getProductsByCategory.mockResolvedValue([sample()]); const res=await request(app).get("/api/products/category/electronics"); expect(res.status).toBe(200); expect(productMocks.getProductsByCategory).toHaveBeenCalledWith("electronics"); });
  it("returns featured products", async () => { productMocks.getFeaturedProducts.mockResolvedValue([sample(2,5)]); const res=await request(app).get("/api/products/featured"); expect(res.status).toBe(200); expect(res.body[0].rating.rate).toBe(5); });
  it("returns 500 for product service failures", async () => { productMocks.getAllProducts.mockRejectedValue(new Error("upstream unavailable")); const res=await request(app).get("/api/products"); expect(res.status).toBe(500); expect(res.body.message).toBe("Failed to fetch products"); });
  it("returns 500 for product detail failures", async () => { productMocks.getProductById.mockRejectedValue(new Error("not found")); const res=await request(app).get("/api/products/999"); expect(res.status).toBe(500); });
  it("returns 500 for category failures", async () => { productMocks.getAllCategories.mockRejectedValue(new Error("failure")); const res=await request(app).get("/api/products/categories"); expect(res.status).toBe(500); });
});

describe("enquiry endpoint", () => {
  const valid = { productId: 1, productName: "Product 1", name: "A Customer", email: "customer@example.com", phone: "1234567890", message: "Please contact me" };
  it("accepts valid enquiry and sends email", async () => { emailMock.mockResolvedValue(undefined as never); const res=await request(app).post("/api/enquiries").send(valid); expect(res.status).toBe(201); expect(res.body.success).toBe(true); expect(res.body.message).toMatch(/Thank you/i); expect(emailMock).toHaveBeenCalledWith(valid); });
  it.each(["productId","productName","name","email","phone","message"])("rejects missing %s", async (field) => { const body={...valid}; delete (body as any)[field]; const res=await request(app).post("/api/enquiries").send(body); expect(res.status).toBe(400); expect(res.body.success).toBe(false); expect(emailMock).not.toHaveBeenCalled(); });
  it("rejects blank string fields", async () => { const res=await request(app).post("/api/enquiries").send({...valid,name:"  "}); expect(res.status).toBe(400); });
  it("rejects invalid email, short name, invalid phone, and short message", async () => {
    const cases = [
      { ...valid, name: "A" },
      { ...valid, email: "not-an-email" },
      { ...valid, phone: "12abc" },
      { ...valid, message: "short" },
    ];
    for (const body of cases) {
      const res = await request(app).post("/api/enquiries").send(body);
      expect(res.status).toBe(400);
    }
    expect(emailMock).not.toHaveBeenCalled();
  });
  it("rejects values exceeding maximum lengths", async () => {
    const cases = [
      { ...valid, name: "N".repeat(81) },
      { ...valid, email: `a${"x".repeat(250)}@example.com` },
      { ...valid, message: "M".repeat(1001) },
    ];
    for (const body of cases) {
      const res = await request(app).post("/api/enquiries").send(body);
      expect(res.status).toBe(400);
    }
    expect(emailMock).not.toHaveBeenCalled();
  });
  it("returns 500 when email sending fails", async () => { emailMock.mockRejectedValue(new Error("SMTP unavailable")); const res=await request(app).post("/api/enquiries").send(valid); expect(res.status).toBe(500); expect(res.body.success).toBe(false); });
});
