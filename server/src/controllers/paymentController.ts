// controllers/paymentController.ts
import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    // IMPORTANT: req.body must be a raw buffer
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerEmail = session.customer_details?.email;

      if (customerEmail) {
        await db
          .update(users)
          .set({ is_premium: true })
          .where(eq(users.email, customerEmail));

        console.log(`User ${customerEmail} upgraded to premium 🚀`);
      }
    }

    return res.json({ received: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
