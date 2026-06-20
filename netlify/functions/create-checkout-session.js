import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      // Stripe collects email automatically
      customer_email: undefined,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Vics One App Full Vers."
            },
            unit_amount: 1995
          },
          quantity: 1
        }
      ],

      success_url: "https://vicsoneapp.netlify.app/success.html",
      cancel_url: "https://vicsoneapp.netlify.app/cancel.html"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};