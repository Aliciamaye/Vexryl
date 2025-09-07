import { Router } from 'itty-router';
import { validateToken } from '../auth/index.js';

const marketplaceRouter = Router({ base: '/api/marketplace' });

// Mock marketplace storage
const marketplaceItems = new Map();

function requireAuth(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.substring(7);
  const user = validateToken(token);
  if (!user) {
    throw new Error('Invalid token');
  }
  
  return user;
}

// Get marketplace items
marketplaceRouter.get('/', async (request) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');
  
  let items = Array.from(marketplaceItems.values());
  
  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }
  
  if (search) {
    items = items.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Sort by downloads/popularity
  items.sort((a, b) => b.downloads - a.downloads);
  
  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

// Upload to marketplace
marketplaceRouter.post('/', async (request) => {
  try {
    const user = requireAuth(request);
    const itemData = await request.json();
    
    if (!itemData.name || !itemData.type) {
      return new Response(JSON.stringify({ error: 'Name and type are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const item = {
      id: Date.now().toString(),
      userId: user.id,
      author: user.username,
      name: itemData.name,
      description: itemData.description || '',
      type: itemData.type, // 'command' or 'event'
      category: itemData.category || 'general',
      data: itemData.data || {},
      downloads: 0,
      rating: 0,
      reviews: [],
      tags: itemData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    marketplaceItems.set(item.id, item);

    return new Response(JSON.stringify({ success: true, item }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Download from marketplace
marketplaceRouter.post('/:id/download', async (request) => {
  try {
    const user = requireAuth(request);
    const itemId = request.params.id;
    
    const item = marketplaceItems.get(itemId);
    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Increment download count
    item.downloads += 1;
    marketplaceItems.set(itemId, item);

    return new Response(JSON.stringify({ 
      success: true, 
      data: item.data,
      name: item.name,
      type: item.type
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Rate marketplace item
marketplaceRouter.post('/:id/rate', async (request) => {
  try {
    const user = requireAuth(request);
    const itemId = request.params.id;
    const { rating, review } = await request.json();
    
    const item = marketplaceItems.get(itemId);
    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: 'Rating must be between 1 and 5' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add or update review
    const existingReviewIndex = item.reviews.findIndex(r => r.userId === user.id);
    const newReview = {
      userId: user.id,
      username: user.username,
      rating,
      review: review || '',
      createdAt: new Date().toISOString()
    };

    if (existingReviewIndex >= 0) {
      item.reviews[existingReviewIndex] = newReview;
    } else {
      item.reviews.push(newReview);
    }

    // Recalculate average rating
    const totalRating = item.reviews.reduce((sum, r) => sum + r.rating, 0);
    item.rating = Math.round((totalRating / item.reviews.length) * 10) / 10;
    
    marketplaceItems.set(itemId, item);

    return new Response(JSON.stringify({ success: true, rating: item.rating }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get user's uploads
marketplaceRouter.get('/my-uploads', async (request) => {
  try {
    const user = requireAuth(request);
    const userItems = Array.from(marketplaceItems.values()).filter(item => item.userId === user.id);
    
    return new Response(JSON.stringify({ items: userItems }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Delete marketplace item
marketplaceRouter.delete('/:id', async (request) => {
  try {
    const user = requireAuth(request);
    const itemId = request.params.id;
    
    const item = marketplaceItems.get(itemId);
    if (!item || item.userId !== user.id) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    marketplaceItems.delete(itemId);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export function handleMarketplace(request) {
  return marketplaceRouter.handle(request);
}
