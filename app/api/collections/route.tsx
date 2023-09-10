import { getCollections } from 'lib/saleor';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let response = await getCollections();
  let collections = response.map((collection) => {
    if (collection?.title && collection?.path) {
      return { title: collection?.title || '', path: collection?.path || '' };
    }
  });
  return NextResponse.json({ collections: collections });
}
