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
    store.updateField("email", "test@example.com");

    const state = useRegistrationStore.getState();

    expect(state.firstName).toBe("John");
    expect(state.lastName).toBe("Doe");
    expect(state.email).toBe("test@example.com");
  });
});

describe("useRegistrationStore.nextStep", () => {
  it("should increment step by 1", () => {
    const store = useRegistrationStore.getState();

    const initialStep = useRegistrationStore.getState().currentStep;

    store.nextStep();

    const updatedStep = useRegistrationStore.getState().currentStep;

    expect(updatedStep).toBe(initialStep + 1);
  });
});

describe("useRegistrationStore.previousStep", () => {
  it("should decrement step by 1", () => {
    const store = useRegistrationStore.getState();

    const initialStep = useRegistrationStore.getState().currentStep;

    store.previousStep();

    const updatedStep = useRegistrationStore.getState().currentStep;

    expect(updatedStep).toBe(initialStep - 1);
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

    const resetState = useRegistrationStore.getState();

    expect(resetState.currentStep).toBe(1);
    expect(resetState.email).toBe("");
  });
});

describe("generateApplicationReference", () => {
  it("should generate string with default length of 9 characters", () => {
    const ref = generateApplicationReference();

    expect(ref.length).toBe(9);
  });

  it("generates a string with custom length", () => {
    const ref = generateApplicationReference(15);

    expect(ref.length).toBe(15);
  });

  it("only contains valid characters", () => {
    const ref = generateApplicationReference(100);
    const validChars = /^[A-Za-z0-9]+$/;
    expect(validChars.test(ref)).toBe(true);
  });
});
