import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      image: true,
      gallery: true,
      customDate: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ posts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body?.title || '').trim();
    const content = String(body?.content || '').trim();
    const image = String(body?.image || '').trim() || null;
    const gallery = body?.gallery ? String(body.gallery).trim() : null;
    const customDate = body?.customDate ? String(body.customDate).trim() : null;

    if (!content) {
      return NextResponse.json({ success: false, message: 'Le texte est requis.' }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        title: title || content.slice(0, 60),
        content,
        image,
        gallery,
        customDate,
        published: true,
        authorId: 'admin',
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        gallery: true,
        customDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
