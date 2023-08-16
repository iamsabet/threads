"use server"

import { revalidatePath } from "next/cache"
import { connectToDb } from "../db/mongoose"
import User from "../models/user.model"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import { ErrorMessage } from "uploadthing/server"
import clerkClient from "@clerk/clerk-sdk-node"
import { fetchThreadsByQuery } from "./thread.actions"
import Vote from "../models/vote.model"

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

const fetchUser = async (userId: string): Promise<any> => {
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

        const skipAmount = (pageNumber - 1) * pageSize

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

const getActivity = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    try {
        await connectToDb()
        if (currentUserId) {
            // currentUserId = JSON.parse(currentUserId)
            const user = (await User.findOne({ id: currentUserId }))
            if (user && user._id) {

                const repliesDoc = await getReplies({ pageNumber, pageSize, currentUserId: user._id })
                const votesDoc = await getVotes({ pageNumber, pageSize, currentUserId: user._id })
                const mentionsDoc = await getMentions({ pageNumber, pageSize, currentUserId: user._id })

                const hasNext = repliesDoc.hasNext || votesDoc.hasNext || mentionsDoc.hasNext
                let docs: any = []
                const mentions = mentionsDoc.mentions.reduce((acc, item) => {
                    return acc.concat({
                        type: "mention",
                        message: "mentioned you here",
                        subject: item.author,
                        link: "/thread/" + item._id,
                        createdAt: item.createdAt
                    })
                }, [])
                const replies = repliesDoc.replies.reduce((acc, item) => {
                    return acc.concat({
                        type: "reply",
                        message: "replied to your thread",
                        subject: item.author,
                        link: "/thread/" + item.parentId,
                        createdAt: item.createdAt
                    })
                }, [])
                const votes = votesDoc.votes.reduce((acc, item) => {

                    return acc.concat({
                        type: "vote",
                        message: `${item.type.toString().toLowerCase()}voted your thread`,
                        subject: item.voter,
                        link: "/thread/" + item.thread._id,
                        createdAt: item.createdAt
                    })
                }, [])
                docs = docs.concat(mentions)
                docs = docs.concat(replies)
                docs = docs.concat(votes)
                const sortedDocs = docs.sort(function (a: any, b: any) {
                    return b.createdAt - a.createdAt;
                });
                return { hasNext, docs: sortedDocs, pageSize, pageNumber };
            }
            else {
                return []
            }
        }
        else {
            return []
        }

    } catch (e: any) {
        throw new Error("Failed to fetch activity " + e.message)
    }
}

const getVotes = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    const skipAmount = (pageNumber - 1) * pageSize
    const userThreads = await Thread.find({ author: currentUserId })
    const threadsIds = userThreads.reduce((acc, userThread) => {
        return acc.concat(userThread._id);
    }, []);
    const baseQuery = { voter: { $ne: currentUserId }, thread: { $in: threadsIds } }

    const votes = await Vote.find(baseQuery)
        .populate({
            path: "voter",
            model: User,
            select: "_id id name username image"
        })
        .populate({
            path: "thread",
            model: Thread,
            select: "_id text"
        })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalVotes = await Vote.countDocuments(baseQuery)
    const hasNext = totalVotes > skipAmount + votes.length
    return { hasNext, votes, totalVotes, pageSize, pageNumber }
}
const getMentions = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {

    const skipAmount = (pageNumber - 1) * pageSize
    const accountUsername = (await User.findOne({ _id: currentUserId }, { username: 1 })).username
    const regex = RegExp(`>@${accountUsername}</`, 'i') // only username matches having a tag around
    const baseQuery = { text: { $regex: regex }, author: { $ne: currentUserId } }

    const mentions = await Thread.find(baseQuery)
        .populate({
            path: "repost",
            model: Thread,
            populate: {
                path: "author",
                model: User
            }
        })
        .populate({
            path: "author",
            model: User,
            select: "_id id name username image"
        })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalMentions = await Thread.countDocuments(baseQuery)
    const hasNext = totalMentions > skipAmount + mentions.length
    return { hasNext, mentions, totalMentions, pageSize, pageNumber }
}

const getReplies = async ({ pageNumber = 1, pageSize = 10, currentUserId }: PaginatePropsType) => {
    const skipAmount = (pageNumber - 1) * pageSize
    const userThreads = await Thread.find({ author: currentUserId })

    const childThreadIds: any = userThreads.reduce((acc, userThread) => {
        return acc.concat(userThread.children);
    }, []);
    const query = {
        _id: { $in: childThreadIds },
        author: { $ne: currentUserId }
    }
    const replies = await Thread.find(query).populate({
        path: "author",
        model: User,
        select: "_id id name username image"
    })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)

    const totalRepliesCount = await Thread.countDocuments(query)


    const hasNext = totalRepliesCount > skipAmount + replies.length

    return { hasNext, replies, totalRepliesCount, pageSize, pageNumber }
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
        return JSON.stringify(await User.find({ username: { $regex: regex } }, { _id: 1, id: 1, username: 1, image: 1, name: 1 }))
    } catch (e: any) {
        console.error("Check user exists error : " + e.message)
        return JSON.stringify([])

    }
}

export { updateUser, fetchUser, fetchUserThreads, searchUsers, getActivity, checkUsernameExists, autoCompleteUsernames }

