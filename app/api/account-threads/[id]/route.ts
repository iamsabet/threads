import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { fetchUser, fetchUserThreads } from '@/lib/actions/user.actions';
export async function GET(req: Request, params: { params: { id: string } }) {
    const { searchParams, } = new URL(req.url)
    let pageNumber = searchParams.get('pageNumber') || "1"
    let pageSize = searchParams.get('pageSize') || "10"
    let label = searchParams.get('label') || "threads"
    let accountId = params?.params?.id
    const { userId } = auth();
    let currentUserId;
    if (userId)
        currentUserId = (await fetchUser(userId))._id
    const pageNumber_int = parseInt(pageNumber)
    const pageSize_int = parseInt(pageSize)
    const data = await fetchUserThreads({ pageNumber: pageNumber_int, pageSize: pageSize_int, currentUserId: currentUserId, label, accountId });
    if (data.status && data.status === 404) {
        return NextResponse.json(data, { status: data.status })
    }
    return NextResponse.json(data);
}