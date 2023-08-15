import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser, fetchUserThreads } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { searchParams, } = new URL(req.url)
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "10"
    let label = searchParams.get('label') || "threads"
    let accountId = req.url.split("/")[req.url.split("/").length - 1].split("?")[0]
    const { userId } = auth();
    let currentUserId;
    if (userId)
        currentUserId = (await fetchUser(userId))._id
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)
    const data = await fetchUserThreads({ pageNumber: pageNumber_int, pageSize: pageSize_int, currentUserId: currentUserId, label, accountId });

    return NextResponse.json(data);
}