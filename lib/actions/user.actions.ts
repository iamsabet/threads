"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../db/mongoose"
import User from "../models/user.model"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"

interface ParamsType {

    userId: string
    username: string
    name: string
    bio: string
    image: string
    path: string
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

const fetchUser = async (userId: string) => {
    try {
        await connectToDb()
        return await User
            .findOne({ id: userId })
        // .populate({
        //     path: "communities",
        //     model: "Community"
        // })
    } catch (e: any) {
        throw new Error("Failed to fetch user " + e.message)
    }
}

const fetchUserThreads = async (userId: string) => {
    try {
        await connectToDb()
        // fetch all threads authored by the specific user
        // TODO: needs paginate like home threads
        // TODO: Populate Community
        const threads = await User.findOne({ id: userId })
            .populate({
                path: "threads",
                model: Thread,
                populate: {
                    path: "children",
                    model: Thread,
                    populate: {
                        path: "author",
                        model: User,
                        select: "image id name username"
                    }
                }
            }).sort({ createdAt: "desc" }).exec()
        return threads
    } catch (e: any) {
        throw new Error("Failed to fetch user threads " + e.message)
    }
}
interface SearchUsersType {
    searchString: string
    pageNumber: number
    pageSize: number
    userId: string
    sortBy: SortOrder
}
const searchUsers = async ({
    searchString = "",
    pageNumber = 1,
    pageSize = 30,
    userId,
    sortBy = "desc" }: SearchUsersType) => {
    try {
        await connectToDb()
        // paginate 

        const skipAmount = (1 - pageNumber) * pageSize

        // regex search

        const regex = new RegExp(searchString, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId },
        }
        if (searchString.trim().length > 0) {

            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }
        const sortOptions = {
            createdAt: sortBy
        }

        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const hasNext = totalUsersCount > skipAmount + users.length

        return { hasNext, users, totalUsersCount, pageSize, pageNumber }

    } catch (e: any) {
        throw new Error("Failed fetch search users " + e.message)
    }
}
export { updateUser, fetchUser, fetchUserThreads, searchUsers }