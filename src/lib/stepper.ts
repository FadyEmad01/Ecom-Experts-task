export interface StepperState {
  canDecrease: boolean;
  canIncrease: boolean;
}

export const getStepperState = (
  value: number,
  min: number,
  max: number,
  disabled: boolean,
  required: boolean = false,
): StepperState => ({
  canDecrease: !disabled && value > min && !(required && value <= 1),
  canIncrease: !disabled && value < max,
});
