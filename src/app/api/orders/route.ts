import { NextRequest, NextResponse } from 'next/server';
import { client, writeClient } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log('Fetching orders for userId:', userId);
    
    // Get orders from Sanity with strict user filtering
    const orders = await client.fetch(
      `*[_type == "order" && userId == $userId] | order(createdAt desc)`,
      { userId }
    );
    
    // Double-check filtering on server side
    const filteredOrders = orders.filter((order: { userId: string }) => order.userId === userId);
    
    console.log('Found orders:', filteredOrders.length, 'for user:', userId);
    console.log('All order userIds:', orders.map((o: { userId: string }) => o.userId));
    console.log('Filtered order userIds:', filteredOrders.map((o: { userId: string }) => o.userId));
    
    return NextResponse.json({ orders: filteredOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, sessionId, items, total } = await request.json();
    
    console.log('Received order data:', { userId, sessionId, items, total });
    console.log('Sanity token exists:', !!process.env.SANITY_API_TOKEN);
    
    if (!userId || !sessionId || !items) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error('SANITY_API_TOKEN is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Transform items to match schema
    const transformedItems = items.map((item: { product: { _id: string; name: string; price: number; imageUrl: string; sizes: string[]; colors: string[] }; quantity: number; color: string; size: string; _key: string }, index: number) => ({
      _key: item._key || `item-${index}-${Date.now()}`, // Add required _key
      product: {
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        sizes: item.product.sizes,
        colors: item.product.colors,
      },
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      itemKey: item._key,
    }));

    // Save order to Sanity using writeClient
    console.log('Attempting to save to Sanity...');
    const order = await writeClient.create({
      _type: 'order',
      orderId: sessionId,
      userId,
      items: transformedItems,
      total,
      status: 'completed',
      createdAt: new Date().toISOString(),
    });
    
    console.log('Order saved successfully:', order);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error saving order:', error);
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: 'Failed to save order', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
