import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        body: "MISSING_EMAIL"
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "MyApp Full License"
            },
            unit_amount: 1995 // $19.95
          },
          quantity: 1
        }
      ],

      success_url: "http://localhost:8888/success.html",
      cancel_url: "http://localhost:8888/cancel.html"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: session.url
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};