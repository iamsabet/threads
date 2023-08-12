"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../db/mongoose"
import User from "../models/user.model"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import { ErrorMessage } from "uploadthing/server"
import clerkClient from "@clerk/clerk-sdk-node"
import { fetchThreadsByQuery } from "./thread.actions"

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
    try {
        await connectToDb()
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
        // TODO: update user profile For Clerk as well
        const params = {
            username,
            firstName: name,
        };
        // See table below for all supported attributes
        const clerkUpdatedUser = await clerkClient.users.updateUser(
            userId,
            params
        );
        // console.log(clerkUpdatedUser);
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

const fetchUserThreads = async ({ pageNumber = 1, pageSize = 30, currentUserId, accountId, label }: PaginatePropsTypeByQuery) => {
    try {
        await connectToDb()
        // fetch all threads authored by the specific user
        // TODO: needs paginate like home threads
        // TODO: Populate Community
        const result = await fetchThreadsByQuery({ pageNumber, pageSize, currentUserId, accountId, label })
        return result
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

const getActivity = async (userId: string) => {
    try {
        await connectToDb()
        const userThreads = await Thread.find({ author: userId })

        // collect all the child thread id's from the 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        }).populate({
            path: "author",
            model: User,
            select: "_id name username image createdAt"
        })

        return replies

    } catch (e: any) {
        throw new Error("Failed to fetch activity " + e.message)
    }
}

const checkUsernameExists = async (username: string) => {
    try {
        await connectToDb();
        return !(await User.exists({ username: username }));
    } catch (e: any) {
        throw new Error("Check user exists error : " + e.message)
    }
}

const autoCompleteUsernames = async ({ input }: { input: string }) => {
    try {
        if (input.length < 2) {
            return JSON.stringify([])
        }
        await connectToDb()
        const regex = RegExp(input, 'i')
        return JSON.stringify(await User.find({ username: { $regex: regex } }, { _id: 1, username: 1, image: 1, name: 1 }))
    } catch (e: any) {
        console.error("Check user exists error : " + e.message)
        return JSON.stringify([])

    }
}

export { updateUser, fetchUser, fetchUserThreads, searchUsers, getActivity, checkUsernameExists, autoCompleteUsernames }

