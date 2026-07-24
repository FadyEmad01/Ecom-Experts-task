import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "../quantity-stepper";

describe("QuantityStepper", () => {
  const setup = (
    overrides?: Partial<React.ComponentProps<typeof QuantityStepper>>,
  ) => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const result = render(
      <QuantityStepper value={5} onChange={onChange} {...overrides} />,
    );
    return { onChange, user, ...result };
  };

  it("renders the current value", () => {
    setup({ value: 7 });
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls onChange with value + 1 on increase click", async () => {
    const { onChange, user } = setup({ value: 3 });
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("calls onChange with value - 1 on decrease click", async () => {
    const { onChange, user } = setup({ value: 3 });
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables decrease button when value === min", () => {
    setup({ value: 2, min: 2 });
    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeDisabled();
  });

  it("disables increase button when value === max", () => {
    setup({ value: 10, max: 10 });
    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
  });

  it("disables both buttons when disabled prop is true", () => {
    setup({ disabled: true });
    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
  });

  it("enables both buttons when value is between min and max", () => {
    setup({ value: 5, min: 0, max: 10 });
    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).not.toBeDisabled();
  });

  it("defaults min to 0, disabling decrease at value=0", () => {
    setup({ value: 0 });
    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeDisabled();
  });

  it("defaults max to 99, disabling increase at value=99", () => {
    setup({ value: 99 });
    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
  });

  it("does not call onChange when disabled and button is clicked", async () => {
    const { onChange, user } = setup({ value: 5, disabled: true });
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    await user.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
