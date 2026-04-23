import Stripe from "stripe";

let _stripe: Stripe | null = null;

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    if (!_stripe) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not set");
      }
      _stripe = new Stripe(key, {
        apiVersion: "2026-03-25.dahlia",
        typescript: true,
      });
    }
    return Reflect.get(_stripe, prop, _stripe);
  },
});
