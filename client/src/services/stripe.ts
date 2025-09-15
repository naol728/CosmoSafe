import apiClient from "./apiClient";

export async function createCheckoutSession(email: string) {
  try {
    const res = await apiClient.post("/payment/create-checkout-session", {
      email,
    });

    const data = res.data;

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe session not created:", data);
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
}
