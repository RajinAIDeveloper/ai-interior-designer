// app/api/paypal/capture-order/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderID } = await req.json();
    
    // Call PayPal API to capture payment
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAYPAL_ACCESS_TOKEN}`,
      },
    });

    const order = await response.json();
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error capturing order" }, { status: 500 });
  }
}