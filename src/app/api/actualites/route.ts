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

    if (!content) {
      return NextResponse.json({ success: false, message: 'Le texte est requis.' }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        title: title || content.slice(0, 60),
        content,
        image,
        published: true,
        authorId: 'admin',
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
