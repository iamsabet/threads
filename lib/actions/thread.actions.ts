"use server"

import { revalidatePath } from "next/cache";
import { connectToDb } from "../db/mongoose"
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { Types } from "mongoose";

interface PropsType {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}
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

interface PaginatePropsType {
    pageNumber: number;
    pageSize: number
}
const fetchThreads = async ({ pageNumber = 1, pageSize = 20 }: PaginatePropsType) => {
    try {
        await connectToDb()

        // Calculate the number of posts to skip (page we are on)
        const skipAmount = (pageNumber - 1) * pageSize
        // fetch threads that have no parent
        const threadsQuery = Thread.find({
            parentId: { $in: [null, undefined] }
        }).sort({ createdAt: "desc" })
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "author",
                model: User
            }).populate({
                path: "children",
                populate: {
                    path: "author",
                    model: User,
                    select: "_id username name parentId image"
                }
            })

        const totalThreadsCount = await Thread.countDocuments({
            parentId: { $in: [null, undefined] }
        })

        const threads = await threadsQuery.exec()

        const hasNext = (totalThreadsCount > skipAmount + threads.length)

        return {
            threads,
            hasNext,
            totalThreadsCount,
            pageNumber,
            pageSize
        }
    }
    catch (e: any) {
        throw new Error("Fetch Threads Error " + e.message)
    }
}
const fetchThreadById = async (id: string) => {
    try {
        await connectToDb()

        // TODO : populate communities
        const thread = await Thread.findById(id)
            .populate({
                path: "author",
                model: User,
                select: "_id id name username image"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: User,
                        select: "_id id name parentId username image",
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "_id id name parentId username image"
                        }
                    }
                ]
            }).exec()


        return thread
    } catch (e: any) {
        throw new Error("Fetch Thread failed " + e.message)
    }
}

interface CommentType {
    authorId: string,
    text: string,
    threadId: string,
    path: string,
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

export { createThread, fetchThreads, fetchThreadById, addCommentToThread }