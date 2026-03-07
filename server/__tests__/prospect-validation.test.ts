import { validateProspect, getDaysSinceCreated } from "../prospect-helpers";

describe("prospect creation validation", () => {
  test("rejects a blank company name", () => {
    const result = validateProspect({
      companyName: "",
      roleTitle: "Software Engineer",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Company name is required");
  });

  test("rejects a blank role title", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Role title is required");
  });
});

describe("salary input validation", () => {
  test("accepts a valid positive integer salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: 120000,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts null salary (optional field)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: null,
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("accepts undefined salary (field omitted)", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test("rejects a negative salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: -50000,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be positive");
  });

  test("rejects zero salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: 0,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be positive");
  });

  test("rejects a non-integer salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: 120000.50,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a whole number");
  });

  test("rejects a string salary", () => {
    const result = validateProspect({
      companyName: "Google",
      roleTitle: "Engineer",
      salary: "120000" as unknown,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Salary must be a whole number");
  });
});

describe("days since created calculation", () => {
  test("returns 0 for a card created today", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    const created = new Date("2026-03-07T08:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(0);
  });

  test("returns 1 for a card created yesterday", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    const created = new Date("2026-03-06T12:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(1);
  });

  test("returns correct count for multiple days", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    const created = new Date("2026-02-25T12:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(10);
  });

  test("returns 0 and never negative for future dates", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    const created = new Date("2026-03-10T12:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(0);
  });

  test("floors partial days correctly", () => {
    const now = new Date("2026-03-07T20:00:00Z");
    const created = new Date("2026-03-06T22:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(0);
  });

  test("handles a full day boundary", () => {
    const now = new Date("2026-03-07T22:00:00Z");
    const created = new Date("2026-03-06T21:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(1);
  });

  test("accepts ISO string input for createdAt", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    expect(getDaysSinceCreated("2026-03-02T12:00:00Z", now)).toBe(5);
  });

  test("returns large count for old dates", () => {
    const now = new Date("2026-03-07T12:00:00Z");
    const created = new Date("2025-03-07T12:00:00Z");
    expect(getDaysSinceCreated(created, now)).toBe(365);
  });
});
