import { getStepperState } from "../stepper";

describe("getStepperState", () => {
  describe("canDecrease", () => {
    it("true when value > min", () => {
      expect(getStepperState(5, 0, 10, false).canDecrease).toBe(true);
    });

    it("false when value === min", () => {
      expect(getStepperState(0, 0, 10, false).canDecrease).toBe(false);
    });

    it("false when value < min", () => {
      expect(getStepperState(-1, 0, 10, false).canDecrease).toBe(false);
    });

    it("false when disabled regardless of value", () => {
      expect(getStepperState(5, 0, 10, true).canDecrease).toBe(false);
    });

    it("false when disabled + value > min", () => {
      expect(getStepperState(9, 0, 10, true).canDecrease).toBe(false);
    });
  });

  describe("canIncrease", () => {
    it("true when value < max", () => {
      expect(getStepperState(5, 0, 10, false).canIncrease).toBe(true);
    });

    it("false when value === max", () => {
      expect(getStepperState(10, 0, 10, false).canIncrease).toBe(false);
    });

    it("false when value > max", () => {
      expect(getStepperState(11, 0, 10, false).canIncrease).toBe(false);
    });

    it("false when disabled regardless of value", () => {
      expect(getStepperState(5, 0, 10, true).canIncrease).toBe(false);
    });

    it("false when disabled + value < max", () => {
      expect(getStepperState(1, 0, 10, true).canIncrease).toBe(false);
    });
  });

  describe("combined edge cases", () => {
    it("both false when min === max === value", () => {
      const state = getStepperState(5, 5, 5, false);
      expect(state.canDecrease).toBe(false);
      expect(state.canIncrease).toBe(false);
    });

    it("both false when disabled with value between min and max", () => {
      const state = getStepperState(5, 0, 10, true);
      expect(state.canDecrease).toBe(false);
      expect(state.canIncrease).toBe(false);
    });

    it("both true with default-range value between min and max", () => {
      const state = getStepperState(50, 0, 99, false);
      expect(state.canDecrease).toBe(true);
      expect(state.canIncrease).toBe(true);
    });
  });
});
