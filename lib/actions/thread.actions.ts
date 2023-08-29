"use server"

import { revalidatePath } from "next/cache";
import { connectToDb } from "../db/mongoose"
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { SortOrder, Types } from "mongoose";
import Vote from "../models/vote.model";
import { handleVotesCount, replaceMentions } from "./_helper.actions";
import { fetchFollowings } from "./follow.action";

const createThread = async ({ text, author, communityId, path, repost }: PropsType) => {
    try {
        await connectToDb();
        // create thread model
        if (!repost)
            text = await replaceMentions(text)
        const newThread = await Thread.create({
            text,
            author,
            community: null,
            repost: repost
        })
        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: newThread._id }
        })

        revalidatePath(path)
        return true
    } catch (e: any) {
        throw new Error("Create Thread Failed " + e.message)
    }
}

const repostThread = async ({ threadId, userId, pathname }: { threadId: string, userId: string, pathname: string }) => {
    try {
        const targetThread = await Thread.findOne({ _id: threadId })
        if (targetThread) {

            return await createThread({
                text: targetThread.text,
                author: userId,
                communityId: null,
                path: pathname,
                repost: threadId,
            });
        }
        else {
            throw new Error(`Thread ${threadId} not found`)
        }
    } catch (e: any) {
        throw new Error("Repsot failed " + e.message)
    }
}


const fetchThreadsByQuery = async ({ pageNumber = 1, pageSize = 30, currentUserId, accountId, label, sortBy = "createdAt" }: PaginatePropsTypeByQuery) => {
    const skipAmount = (pageNumber - 1) * pageSize
    // fetch threads that have no parent
    // console.log(accountId)
    let baseQuery = {};
    if (accountId) {
        if (typeof accountId === "object") {
            baseQuery = { author: { $in: accountId }, parentId: { $in: [null, undefined] } }
        }
        else {
            if (label === "threads")
                baseQuery = { author: { $in: [accountId] }, parentId: { $in: [null, undefined] } }
            else if (label === "replies") {
                baseQuery = { author: { $in: [accountId] }, parentId: { $nin: [null, undefined] } }
            }
            else if (label === "mentioned") {
                const account = (await User.findOne({ _id: accountId }, { username: 1 }))
                if (!account) return { result: false, message: "Account not found", status: 404 }
                const account_id = account.id
                const regex = RegExp(`"${account_id}">`, 'i')  // only username matches having a tag around
                baseQuery = { text: { $regex: regex } }
            }
        }
    } else {
        baseQuery = { parentId: { $in: [null, undefined] } }
    }
    const sort: string | { [key: string]: SortOrder | { $meta: any; }; } | [string, SortOrder][] | null | undefined = {}

    sort[sortBy] = "desc"
    if (sortBy === "createdAt")
        sort["votePoints"] = "desc"
    else
        sort["createdAt"] = "desc"

    const threadsQuery = Thread.find(baseQuery).sort(sort)
        .skip(skipAmount)
        .limit(pageSize)
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
            model: User
        }).populate({
            path: "children",
            populate: [{
                path: "author",
                model: User,
                select: "_id username name parentId image createdAt followersCount followingsCount color"
            }],

        })
    if (label === "replies") {
        threadsQuery.populate({
            path: "parentId",
            model: Thread,
            select: "_id text createdAt author",
            populate: {
                path: "author",
                model: User,
                select: "_id id name username image followersCount followingsCount color"
            }
        })
    }

    const threads = await threadsQuery.exec()
    let threadsMyVotesQuery;
    let threads_my_votes_only
    if (currentUserId) {
        threadsMyVotesQuery = Thread.find(baseQuery).sort(sort)
            .skip(skipAmount)
            .limit(pageSize).populate({
                path: "votes",
                model: Vote,
                match: { voter: currentUserId },
                select: "_id type voter thread",

            });
        threads_my_votes_only = await threadsMyVotesQuery.exec()
    }

    let threads_final = handleVotesCount(threads, threads_my_votes_only)


    // console.log(threads_final)
    const totalThreadsCount = await Thread.countDocuments(baseQuery)

    // self votes
    const hasNext = (totalThreadsCount > skipAmount + threads.length)

    return {
        // @ts-ignore
        docs: threads_final,
        hasNext,
        totalThreadsCount,
        pageNumber,
        pageSize
    }
}

const fetchUserTotalThreadsCount = async ({ accountId, label }: { accountId: string; label: string }) => {
    let baseQuery = {}
    if (label === "threads")
        baseQuery = { author: { $in: [accountId] }, parentId: { $in: [null, undefined] } }
    else if (label === "replies") {
        baseQuery = { author: { $in: [accountId] }, parentId: { $nin: [null, undefined] } }
    }
    else if (label === "mentioned") {
        const account = (await User.findOne({ _id: accountId }, { username: 1 }))
        if (!account) return { result: false, message: "Account not found", status: 404 }
        const account_id = account.id
        const regex = RegExp(`"${account_id}">`, 'i')  // only username matches having a tag around
        baseQuery = { text: { $regex: regex } }
    }
    const totalThreadsCount = await Thread.countDocuments(baseQuery)
    return totalThreadsCount
}

const fetchThreads = async ({ pageNumber = 1, pageSize = 30, currentUserId, sortBy = "createdAt" }: PaginatePropsType) => {
    try {
        await connectToDb()
        // Calculate the number of posts to skip(page we are on)
        return await fetchThreadsByQuery({ pageNumber, pageSize, currentUserId, accountId: null, sortBy })
    }
    catch (e: any) {
        console.error("Fetch Threads Error " + e.message)
        return null;
    }
}

const fetchFollowingsThreads = async ({ pageNumber = 1, pageSize = 30, currentUserId, sortBy = "createdAt" }: PaginatePropsType) => {
    try {
        await connectToDb()
        // Calculate the number of posts to skip(page we are on)
        const followings = await fetchFollowings({ accountId: currentUserId, pageNumber: 1, pageSize: 1000 })
        if (followings && followings.docs) {
            const followingsIds = followings.docs.reduce((ids, item) => {
                return ids.concat(item.following._id.toString())
            }, []) as string[]

            return await fetchThreadsByQuery({ pageNumber, pageSize, currentUserId, accountId: followingsIds, sortBy })
        }
        else {
            return null
        }

    }
    catch (e: any) {
        console.error("Fetch Followings Threads Error " + e.message)
        return null;
    }
}

const fetchAllChildThreads = async (threadId: string): Promise<any[]> => {
    const childThreads = await Thread.find({ parentId: threadId });

    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }
    return descendantThreads;
}
const deleteThread = async (id: string, userId: string, path: string): Promise<void> => {
    try {
        await connectToDb();

        // Find the thread to be deleted (the main thread)
        const mainThread = await Thread.findOne({ _id: id, author: userId })
            .populate("author")
            .populate({
                path: "repost",
                model: Thread,
                populate: {
                    path: "author",
                    model: User
                }
            });

        if (!mainThread) {
            throw new Error("Thread not found");
        }
        // Fetch all child threads and their descendants recursively
        const descendantThreads = await fetchAllChildThreads(id);

        // Get all descendant thread IDs including the main thread ID and child thread IDs
        const descendantThreadIds = [
            id,
            ...descendantThreads.map((thread) => thread._id),
        ];

        // Extract the authorIds and communityIds to update User and Community models respectively
        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
                mainThread.author?._id?.toString(),
            ].filter((id) => id !== undefined)
        );

        // Recursively delete child threads and their descendants
        await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

        // Update User model
        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        );

        // Update Community model
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}


const fetchThreadById = async (id: string, currentUserId: string) => {
    try {
        await connectToDb()
        // TODO : populate communities
        const thread = await Thread.findById(id)
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
                select: "_id id name username image createdAt followersCount followingsCount color"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId username image createdAt followersCount followingsCount color",
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: [{
                            path: "author",
                            model: User,
                            select: "_id id name parentId username image createdAt followersCount followingsCount color"
                        }]
                    },
                ]
            }).exec()
        const threadWithMyVote = await Thread.findById(id)
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
                select: "_id id name username image createdAt followersCount followingsCount color"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "votes",
                        model: Vote,
                        match: { voter: currentUserId },
                        select: "_id type voter thread",

                    }
                ]
            }).populate({
                path: "votes",
                model: Vote,
                match: { voter: currentUserId },
                select: "_id type voter thread",

            }).exec()
        let threads_final = handleVotesCount([thread], [threadWithMyVote], true)
        return threads_final[0]
    } catch (e: any) {
        console.log("Fetch Thread failed " + e.message)
        return null
    }
}


const addCommentToThread = async (
    {
        authorId,
        text,
        threadId,
        path
    }: CommentType) => {

    try {
        await connectToDb()
        //adding comment
        // find original thread by id
        // console.log(threadId)

        const originalThread = await Thread.findById(threadId)
        if (!originalThread) throw new Error("Thread Not Found")
        text = await replaceMentions(text)
        // create new thread with comment text
        const commentThread = new Thread({
            text: text,
            author: authorId,
            // parentId: new Types.ObjectId(threadId),
            parentId: threadId

        })
        const savedCommentThread = await commentThread.save()

        // update original(parent) thread to include new comment
        originalThread.children.push(savedCommentThread._id)
        await originalThread.save()
        revalidatePath(path)
    } catch (e: any) {
        throw new Error("Add Comment Failed " + e.message)
    }

}

const voteToThread = async (userId: string, type: VoteType, threadId: string) => {
    try {
        await connectToDb()
        // const user = await User.findOne({ id: userId })
        // console.log(userId, "?", threadId)
        if (userId) {
            const model = await Vote.findOneAndUpdate(
                { voter: userId, thread: threadId },
                { type: type }, { upsert: true, new: true }
            )
            // calculate votePoints
            const upVotes = await Vote.countDocuments({ thread: threadId, type: "up" })
            const downVotes = await Vote.countDocuments({ thread: threadId, type: "down" })
            const votePoints = upVotes - downVotes
            // console.log(model)
            if (type === "") {
                await Thread.findOneAndUpdate({ _id: model.thread }, {
                    $pull: { votes: model._id }, $set: { votePoints: votePoints }
                });
            }
            else {
                await Thread.findOneAndUpdate({ _id: model.thread }, {
                    $addToSet: { votes: model._id }, $set: { votePoints: votePoints }
                });
            }
        }
        return true
    } catch (e: any) {
        throw new Error("Vote Failed " + e.message)
    }
}
export {
    createThread,
    repostThread,
    fetchThreads,
    fetchFollowingsThreads,
    fetchUserTotalThreadsCount,
    fetchThreadById,
    addCommentToThread,
    voteToThread,
    fetchThreadsByQuery,
    deleteThread
}