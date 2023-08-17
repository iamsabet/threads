import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { checkUsernameExists, fetchUser } from '@/lib/actions/user.actions';
export async function GET(req: Request) {
    const { userId } = auth();
    if (userId) {
        const image = (await fetchUser(userId)).image
        return NextResponse.json({ image });
    } else {
        return NextResponse.json({ "result": false, message: "Not Authorized" }, { status: 401 })
    }
}