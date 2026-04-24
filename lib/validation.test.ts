import {
  sanitizeInput,
  validateDateOfBirth,
  validateEmail,
} from "@/lib/validation";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

describe("sanitizeInput", () => {
  it("returns an empty string if input is empty", () => {
    expect(sanitizeInput("")).toBe("");
  });

  it("trims whitespace", () => {
    expect(sanitizeInput("  hello world  ")).toBe("hello world");
  });

  it("removes html tags", () => {
    expect(sanitizeInput("<p>hello</p>")).toBe("hello");
  });

  it("removes script tags", () => {
    const input = `<script>alert("xss")</script>hello`;
    expect(sanitizeInput(input)).toBe("hello");
  });

  it("removes inline event handlers", () => {
    const input = `<img src="" onclick="alert(1)" alt="" />hello`;
    expect(sanitizeInput(input)).toBe("hello");
  });

  it("handles mixed malicious + normal input", () => {
    const input = `  <script>alert(1)</script>  John Doe  `;
    expect(sanitizeInput(input)).toBe("John Doe");
  });
});

describe("validateEmail", () => {
  it("fails when email is empty", () => {
    const result = validateEmail("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email is required");
  });

  it("passes with a valid email", () => {
    const result = validateEmail("test@example.com");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("normalizes uppercase emails", () => {
    const result = validateEmail("TEST@EXAMPLE.COM");
    expect(result.isValid).toBe(true);
  });

  it("fails invalid email format", () => {
    const result = validateEmail("invalid-email");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invalid email format");
  });

  it("trims and sanitizes input", () => {
    const result = validateEmail("  test@example.com   ");
    expect(result.isValid).toBe(true);
  });

  it("removes HTML before validation", () => {
    const result = validateEmail("<p>test@example.com</p>");
    expect(result.isValid).toBe(true);
  });

  it("fails email with Cyrillic characters (homograph attack)", () => {
    const result = validateEmail("test@examplе.com");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Email contains invalid characters");
  });

  it("can return multiple errors", () => {
    const result = validateEmail("ааа");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Invalid email format");
    expect(result.errors).toContain("Email contains invalid characters");
  });
});

describe("validateDateOfBirth", () => {
  // Freeze time so tests don’t randomly fail in the future
  const mockToday = new Date("2026-04-23");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("fails when DOB is empty", () => {
    const result = validateDateOfBirth("");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Date of birth is required");
  });

  it("passes when exactly 18 years old", () => {
    const result = validateDateOfBirth("2008-04-23");
    expect(result.isValid).toBe(true);
  });

  it("fails when under 18 (one day younger)", () => {
    const result = validateDateOfBirth("2008-04-24");
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Must be 18 years or older");
  });

  it("passes when older than 18", () => {
    const result = validateDateOfBirth("2000-01-01");
    expect(result.isValid).toBe(true);
  });

  it("fails when birthday has not occurred yet this year", () => {
    const result = validateDateOfBirth("2008-12-01");
    expect(result.isValid).toBe(false);
  });

  it("passes when birthday already occurred this year", () => {
    const result = validateDateOfBirth("2008-01-01");
    expect(result.isValid).toBe(true);
  });

  it("handles invalid date input", () => {
    const result = validateDateOfBirth("invalid-date");
    expect(result.isValid).toBe(false);
  });
});
