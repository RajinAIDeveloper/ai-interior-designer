// app/api/paypal/create-order/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { amount } = await req.json();
    
    // Call PayPal API to create order
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      }),
    });

    const order = await response.json();
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}