import { validateProspect } from "../prospect-helpers";

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
