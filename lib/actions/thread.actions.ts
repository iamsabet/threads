"use server"

import { revalidatePath } from "next/cache";
import { connectToDb } from "../db/mongoose"
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { Types } from "mongoose";
import Vote from "../models/vote.model";
import { handleVotesCount } from "./_helper.actions";


const createThread = async ({ text, author, communityId, path }: PropsType) => {
    try {
        await connectToDb();
        // create thread model
        const newThread = await Thread.create({
            text,
            author,
            community: null,
            // community : {
            //     communityId
            // }

        })
        // update user model
        await User.findByIdAndUpdate(author, {
            $push: { threads: newThread._id }
        })

        revalidatePath(path)
    } catch (e: any) {
        throw new Error("Create Thread Failed " + e.message)
    }
}


const fetchThreadsByQuery = async ({ pageNumber = 1, pageSize = 30, currentUserId, accountId }: PaginatePropsTypeByQuery) => {
    const skipAmount = (pageNumber - 1) * pageSize
    // fetch threads that have no parent
    // console.log(accountId)
    const baseQuery = accountId ? { author: { $in: [accountId] }, parentId: { $in: [null, undefined] } } : { parentId: { $in: [null, undefined] } }
    const threadsQuery = Thread.find(baseQuery).sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
            path: "author",
            model: User
        }).populate({
            path: "children",
            populate: [{
                path: "author",
                model: User,
                select: "_id username name parentId image createdAt"
            }],

        })
    threadsQuery.populate({
        path: "votes",
        model: Vote,
        // match: { voter: currentUserId },
        select: "_id type voter thread",

    });
    const threads = await threadsQuery.exec()
    let threadsMyVotesQuery;
    let threads_my_votes_only
    if (currentUserId) {
        threadsMyVotesQuery = Thread.find(baseQuery).sort({ createdAt: "desc" })
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
        threads: threads_final,
        hasNext,
        totalThreadsCount,
        pageNumber,
        pageSize
    }
}

const fetchThreads = async ({ pageNumber = 1, pageSize = 30, currentUserId }: PaginatePropsType) => {
    try {
        await connectToDb()
        // Calculate the number of posts to skip(page we are on)
        return await fetchThreadsByQuery({ pageNumber, pageSize, currentUserId, accountId: null })
    }
    catch (e: any) {
        throw new Error("Fetch Threads Error " + e.message)
    }
}
const fetchThreadById = async (id: string, currentUserId: string) => {
    try {
        await connectToDb()
        // TODO : populate communities
        const thread = await Thread.findById(id)
            .populate({
                path: "author",
                model: User,
                select: "_id id name username image createdAt"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId username image createdAt",
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: [{
                            path: "author",
                            model: User,
                            select: "_id id name parentId username image createdAt"
                        }]
                    },
                    {
                        path: "votes",
                        model: Vote,
                        // match: { voter: currentUserId },
                        select: "_id type voter thread",

                    }
                ]
            }).populate({
                path: "votes",
                model: Vote,
                // match: { voter: currentUserId },
                select: "_id type voter thread",

            }).exec()
        const threadWithMyVote = await Thread.findById(id)
            .populate({
                path: "author",
                model: User,
                select: "_id id name username image createdAt"
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
        throw new Error("Fetch Thread failed " + e.message)
    }
}


const addCommentToThread = async (
    {
        authorId,
        text,
        threadId,
        path
    }: CommentType) => {
    await connectToDb()
    try {
        //adding comment
        // find original thread by id
        // console.log(threadId)
        const originalThread = await Thread.findById(threadId)
        if (!originalThread) throw new Error("Thread Not Found")

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
        const model = await Vote.findOneAndUpdate(
            { voter: JSON.parse(userId), thread: JSON.parse(threadId) },
            {
                type: type
            }, { upsert: true, new: true }
        )

        // console.log(model)
        if (type === "") {
            await Thread.findOneAndUpdate({ _id: model.thread }, {
                $pull: { votes: model._id }
            });
        }
        else {
            await Thread.findOneAndUpdate({ _id: model.thread }, {
                $addToSet: { votes: model._id }
            });
        }
        return true
    } catch (e: any) {
        throw new Error("Vote Failed " + e.message)
    }
}
export { createThread, fetchThreads, fetchThreadById, addCommentToThread, voteToThread, fetchThreadsByQuery }