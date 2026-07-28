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
    const id = body?.id ? String(body.id).trim() : null;
    const title = String(body?.title || '').trim();
    const content = String(body?.content || '').trim();
    const image = String(body?.image || '').trim() || null;
    const gallery = body?.gallery ? String(body.gallery).trim() : null;
    const customDate = body?.customDate ? String(body.customDate).trim() : null;

    if (!content && !title) {
      return NextResponse.json({ success: false, message: 'Le texte est requis.' }, { status: 400 });
    }

    let post;
    if (id || title) {
      const existing = await db.post.findFirst({
        where: {
          OR: [
            ...(id ? [{ id }] : []),
            ...(title ? [{ title: { equals: title } }] : [])
          ]
        }
      }).catch(() => null);

      if (existing) {
        post = await db.post.update({
          where: { id: existing.id },
          data: {
            title: title || content.slice(0, 60),
            content: content || title,
            image,
            gallery,
            customDate,
            published: true,
          },
        });
        return NextResponse.json({ success: true, post }, { status: 200 });
      }
    }

    post = await db.post.create({
      data: {
        ...(id ? { id } : {}),
        title: title || content.slice(0, 60),
        content: content || title,
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
    console.error('Error creating/updating post:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
