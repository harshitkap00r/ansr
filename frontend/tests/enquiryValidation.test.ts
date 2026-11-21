import { describe, it, expect } from "vitest";
import { validateEnquiry } from "../src/utils/enquiryValidation";

const valid = { name: "Jane Doe", email: "jane@example.com", phone: "+1 (234) 567-8901", message: "I am interested in this product." };

describe("validateEnquiry", () => {
  it("accepts valid values and trims whitespace for validation", () => { expect(validateEnquiry(valid)).toEqual({}); });
  it("rejects names shorter than 2 characters and longer than 80", () => { expect(validateEnquiry({ ...valid, name: "A" }).name).toMatch(/at least 2/); expect(validateEnquiry({ ...valid, name: "N".repeat(81) }).name).toMatch(/80 characters/); });
  it.each(["", "missing-at", "user@", "user.example.com", "user @example.com"]) ("rejects invalid email %s", (email) => { expect(validateEnquiry({ ...valid, email }).email).toBeTruthy(); });
  it("rejects phone with letters or fewer than 7 or more than 15 digits", () => { expect(validateEnquiry({ ...valid, phone: "123abc456" }).phone).toBeTruthy(); expect(validateEnquiry({ ...valid, phone: "123456" }).phone).toBeTruthy(); expect(validateEnquiry({ ...valid, phone: "1".repeat(16) }).phone).toBeTruthy(); });
  it("rejects messages shorter than 10 or longer than 1000 characters", () => { expect(validateEnquiry({ ...valid, message: "short" }).message).toBeTruthy(); expect(validateEnquiry({ ...valid, message: "M".repeat(1001) }).message).toBeTruthy(); });
});
