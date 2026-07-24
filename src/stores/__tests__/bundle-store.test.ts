import type { ProductId, VariantId } from "@/features/bundle/bundle.types";
import { createBundleStore } from "../bundle-store";

const CAM_V4 = "wyze-cam-v4" as ProductId;
const CAM_V4_WHITE = "wyze-cam-v4-white" as VariantId;
const CAM_V4_GREY = "wyze-cam-v4-grey" as VariantId;
const CAM_PAN = "wyze-cam-pan-v3" as ProductId;
const CAM_PAN_WHITE = "wyze-cam-pan-v3-white" as VariantId;
const FLOODLIGHT = "wyze-cam-floodlight-v2" as ProductId;
const FLOODLIGHT_WHITE = "wyze-cam-floodlight-v2-white" as VariantId;
const CAM_UNLIMITED = "cam-unlimited" as ProductId;
const CAM_UNLIMITED_MONTHLY = "cam-unlimited-monthly" as VariantId;
const INVALID_PRODUCT = "nonexistent-product" as ProductId;

describe("createBundleStore", () => {
  describe("initial state", () => {
    it("has activeStepId set to cameras", () => {
      const store = createBundleStore();
      expect(store.getState().activeStepId).toBe("cameras");
    });

    it("has empty activeVariants", () => {
      const store = createBundleStore();
      expect(store.getState().activeVariants).toEqual({});
    });

    it("has empty lines array", () => {
      const store = createBundleStore();
      expect(store.getState().lines).toEqual([]);
    });
  });

  describe("setActiveStep", () => {
    it("sets the active step", () => {
      const store = createBundleStore();
      store.getState().setActiveStep("plans");
      expect(store.getState().activeStepId).toBe("plans");
    });

    it("toggles to empty string when clicking the same step", () => {
      const store = createBundleStore();
      store.getState().setActiveStep("cameras");
      expect(store.getState().activeStepId).toBe("");
    });

    it("sets to empty string when null is passed", () => {
      const store = createBundleStore();
      store.getState().setActiveStep(null);
      expect(store.getState().activeStepId).toBe("");
    });

    it("updates to a different step", () => {
      const store = createBundleStore();
      store.getState().setActiveStep("sensors");
      expect(store.getState().activeStepId).toBe("sensors");
      store.getState().setActiveStep("protection");
      expect(store.getState().activeStepId).toBe("protection");
    });
  });

  describe("setActiveVariant", () => {
    it("records a variant for a product", () => {
      const store = createBundleStore();
      store.getState().setActiveVariant(CAM_V4, CAM_V4_WHITE);
      expect(store.getState().activeVariants).toEqual({
        [CAM_V4]: CAM_V4_WHITE,
      });
    });

    it("overwrites variant for the same product", () => {
      const store = createBundleStore();
      store.getState().setActiveVariant(CAM_V4, CAM_V4_WHITE);
      store.getState().setActiveVariant(CAM_V4, CAM_V4_GREY);
      expect(store.getState().activeVariants).toEqual({
        [CAM_V4]: CAM_V4_GREY,
      });
    });

    it("records variants for different products independently", () => {
      const store = createBundleStore();
      store.getState().setActiveVariant(CAM_V4, CAM_V4_WHITE);
      store.getState().setActiveVariant(CAM_PAN, CAM_PAN_WHITE);
      expect(store.getState().activeVariants).toEqual({
        [CAM_V4]: CAM_V4_WHITE,
        [CAM_PAN]: CAM_PAN_WHITE,
      });
    });
  });

  describe("setLineQuantity", () => {
    describe("basic operations", () => {
      it("adds a new line when quantity is greater than 0", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 2);
        expect(store.getState().lines).toHaveLength(1);
        expect(store.getState().lines[0]).toEqual({
          id: `${CAM_V4}:${CAM_V4_WHITE}`,
          productId: CAM_V4,
          variantId: CAM_V4_WHITE,
          quantity: 2,
        });
      });

      it("updates quantity of an existing line", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 2);
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 4);
        expect(store.getState().lines).toHaveLength(1);
        expect(store.getState().lines[0].quantity).toBe(4);
      });

      it("removes a line when quantity is set to 0", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 2);
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 0);
        expect(store.getState().lines).toHaveLength(0);
      });

      it("removes a line when quantity is negative", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 2);
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, -3);
        expect(store.getState().lines).toHaveLength(0);
      });
    });

    describe("quantity clamping", () => {
      it("clamps quantity above maxQty to maxQty", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 10);
        expect(store.getState().lines[0].quantity).toBe(5);
      });

      it("clamps quantity to maxQty of 1 for doorbell", () => {
        const store = createBundleStore();
        store
          .getState()
          .setLineQuantity(
            "wyze-duo-cam-doorbell" as ProductId,
            "doorbell-variant" as VariantId,
            5,
          );
        expect(store.getState().lines[0].quantity).toBe(1);
      });

      it("clamps floodlight quantity to maxQty of 3", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(FLOODLIGHT, FLOODLIGHT_WHITE, 100);
        expect(store.getState().lines[0].quantity).toBe(3);
      });
    });

    describe("single selectionMode clears siblings", () => {
      it("only one line exists in plans step after adding a line", () => {
        const store = createBundleStore();
        store
          .getState()
          .setLineQuantity(CAM_UNLIMITED, CAM_UNLIMITED_MONTHLY, 1);
        const plansLines = store
          .getState()
          .lines.filter((l) => l.productId === CAM_UNLIMITED);
        expect(plansLines).toHaveLength(1);
      });

      it("replaces previous line in same single-mode step", () => {
        const store = createBundleStore();
        store
          .getState()
          .setLineQuantity(CAM_UNLIMITED, CAM_UNLIMITED_MONTHLY, 1);
        const altVariant = "cam-unlimited-yearly" as VariantId;
        store.getState().setLineQuantity(CAM_UNLIMITED, altVariant, 1);
        const plansLines = store
          .getState()
          .lines.filter((l) => l.productId === CAM_UNLIMITED);
        expect(plansLines).toHaveLength(1);
        expect(plansLines[0].variantId).toBe(altVariant);
      });
    });

    describe("multi selectionMode preserves siblings", () => {
      it("keeps multiple lines in cameras step", () => {
        const store = createBundleStore();
        store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 1);
        store.getState().setLineQuantity(CAM_PAN, CAM_PAN_WHITE, 2);
        const cameraLines = store
          .getState()
          .lines.filter(
            (l) => l.productId === CAM_V4 || l.productId === CAM_PAN,
          );
        expect(cameraLines).toHaveLength(2);
        expect(cameraLines[0].productId).toBe(CAM_V4);
        expect(cameraLines[1].productId).toBe(CAM_PAN);
      });
    });

    describe("non-existent product", () => {
      it("does not change state for an invalid productId", () => {
        const store = createBundleStore();
        store
          .getState()
          .setLineQuantity(INVALID_PRODUCT, "some-variant" as VariantId, 3);
        expect(store.getState().lines).toEqual([]);
      });
    });
  });

  describe("removeLine", () => {
    it("removes the specified line and keeps others", () => {
      const store = createBundleStore();
      store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 2);
      store.getState().setLineQuantity(CAM_PAN, CAM_PAN_WHITE, 1);
      store.getState().removeLine(CAM_V4, CAM_V4_WHITE);
      expect(store.getState().lines).toHaveLength(1);
      expect(store.getState().lines[0].productId).toBe(CAM_PAN);
    });

    it("does nothing when removing a line that does not exist", () => {
      const store = createBundleStore();
      store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 1);
      store.getState().removeLine(CAM_PAN, CAM_PAN_WHITE);
      expect(store.getState().lines).toHaveLength(1);
    });
  });

  describe("resetBundle", () => {
    it("restores initial state after changes", () => {
      const store = createBundleStore();
      store.getState().setActiveStep("sensors");
      store.getState().setActiveVariant(CAM_V4, CAM_V4_WHITE);
      store.getState().setLineQuantity(CAM_V4, CAM_V4_WHITE, 3);
      store.getState().resetBundle();
      expect(store.getState().activeStepId).toBe("cameras");
      expect(store.getState().activeVariants).toEqual({});
      expect(store.getState().lines).toEqual([]);
    });
  });
});
