import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { items, userId } = await request.json();

    // Create line items for Stripe
    const lineItems = items.map((item: { product: { name: string; imageUrl: string; price: number }; quantity: number; color: string; size: string }) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.name,
          images: [item.product.imageUrl],
          metadata: {
            color: item.color,
            size: item.size,
          },
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to paise
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Shipping',
        },
        unit_amount: 1500, // ₹15 in paise
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
      metadata: {
        userId: userId,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}