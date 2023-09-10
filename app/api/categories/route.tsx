import { GetCategories } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let response = await GetCategories();
  let categories = response.map((collection) => {
    if (collection?.title && collection?.path) {
      return { title: collection?.title || '', path: collection?.path || '' };
    }
  });
  return NextResponse.json({ categories: categories });
}
