"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../db/mongoose"
import User from "../models/user.model"

interface ParamsType {

    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;

}

const updateUser = async ({
    userId,
    username,
    name,
    bio,
    image,
    path
}: ParamsType): Promise<void> => {
    await connectToDb()
    try {
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            }, { upsert: true }
        )
        if (path === "/profile/edit") {
            revalidatePath(path)
        }

    } catch (e: any) {
        throw new Error(`Failed to create update user ${e.message}`)
    }
}

export { updateUser }