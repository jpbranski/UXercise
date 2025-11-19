import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { MarketplaceItem } from '@/types/marketplace';

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Only allow file writing in development
    if (process.env.NODE_ENV === 'production') {
      console.warn('[save-marketplace] Attempted file write in production environment');
      return NextResponse.json(
        { error: 'File editing disabled in production.' },
        { status: 403 }
      );
    }

    // Parse the request body
    const body: MarketplaceItem[] = await request.json();

    // Validate the data structure
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of marketplace items.' },
        { status: 400 }
      );
    }

    // Validate each item has required fields
    const isValid = body.every(item =>
      item.name &&
      item.description &&
      item.url &&
      typeof item.affiliate === 'boolean' &&
      item.image &&
      item.category &&
      Array.isArray(item.tags)
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid item structure. All items must have: name, description, url, affiliate, image, category, and tags.' },
        { status: 400 }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'data', 'marketplace.json');

    // Write the file with pretty formatting
    const jsonContent = JSON.stringify(body, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');

    console.log(`[save-marketplace] Successfully saved ${body.length} items to marketplace.json`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully saved ${body.length} marketplace items.`,
        itemCount: body.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[save-marketplace] Error saving marketplace data:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Failed to save marketplace data.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
