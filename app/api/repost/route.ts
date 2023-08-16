import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { repostThread } from '@/lib/actions/thread.actions';
export async function POST(req: Request) {
    const { pathname, threadId } = await req.json()

    const { userId } = auth();

    if (!userId)
        NextResponse.json({ "message": "Not Authenticated" }, { status: 401 })
    if (!pathname || !threadId)
        NextResponse.json({ "message": "Bad Request" }, { status: 400 })
    if (userId) {
        const currentUserId = (await fetchUser(userId))._id
        const data = await repostThread({ userId: currentUserId, pathname, threadId });

        return NextResponse.json(data);
    }
}