import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  generateApplicationReference,
  initialState,
  useRegistrationStore,
} from "@/lib/store";

describe("useRegistrationStore.updateField", () => {
  beforeEach(() => {
    // reset the store before each test
    useRegistrationStore.setState(initialState);
  });

  it("should update multiple fields independently", () => {
    const store = useRegistrationStore.getState();

    store.updateField("firstName", "John");
    store.updateField("lastName", "Doe");
    store.updateField("email", "test@exmaple.com");

    expect(store.firstName).toBe("John");
    expect(store.lastName).toBe("Doe");
    expect(store.email).toBe("test@example.com");
  });
});

describe("useRegistrationStore.nextStep", () => {
  it("should increment step by 1", () => {
    const store = useRegistrationStore.getState();

    const initialStep = useRegistrationStore.getState().currentStep;

    store.nextStep();

    expect(store.currentStep).toBe(initialStep + 1);
  });
});

describe("useRegistrationStore.previousStep", () => {
  it("should decrement step by 1", () => {
    const store = useRegistrationStore.getState();

    const initialStep = useRegistrationStore.getState().currentStep;

    store.previousStep();

    expect(store.currentStep).toBe(initialStep - 1);
  });
});

describe("useRegistrationStore.reset", () => {
  beforeEach(() => {
    useRegistrationStore.setState({
      currentStep: 3,
      email: "test@example.com",
    });

    vi.clearAllMocks();
  });

  it("should reset the store to initial state", () => {
    const store = useRegistrationStore.getState();

    store.reset();

    expect(store.currentStep).toBe(0);
    expect(store.email).toBe("");
  });
});

describe("generateApplicationReference", () => {
  it("should generate string with default length of 9 characters", () => {
    const ref = generateApplicationReference();
    expect(ref).toBe(9);
  });

  it("generates a string with custom length", () => {
    const ref = generateApplicationReference(15);
    expect(ref).toBe(15);
  });

  it("only contains valid characters", () => {
    const ref = generateApplicationReference(100);
    const validChars = /^[A-Za-z0-9]+$/;
    expect(validChars.test(ref)).toBe(true);
  });
});
