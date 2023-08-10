import mongoose from 'mongoose'
const voteSchema = new mongoose.Schema({
    type: {
        type: String,
        validate: {
            validator: (value: string) => {
                return ["down", "up", ""].includes(value);
            },
            message: 'Invalid type value / only ["down", "up", ""] are allowed'
        }
    },
    voter: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    thread: {
        type: mongoose.Types.ObjectId,
        ref: 'Thread'
    },
}, { timestamps: true })

voteSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema)

export default Vote



// const fetchThreads = async ({ pageNumber = 1, pageSize = 20, currentUserId }: PaginatePropsType) => {
//     try {
//         await connectToDb()

//         // Calculate the number of posts to skip(page we are on)
//         const skipAmount = (pageNumber - 1) * pageSize
//         // fetch threads that have no parent
//         const threadsQuery = Thread.find({
//             parentId: { $in: [null, undefined] }
//         }).sort({ createdAt: "desc" })
//             .skip(skipAmount)
//             .limit(pageSize)
//             .populate({
//                 path: "author",
//                 model: User
//             }).populate({
//                 path: "children",
//                 populate: {
//                     path: "author",
//                     model: User,
//                     select: "_id username name parentId image createdAt"
//                 }
//             })

//         if (currentUserId) {
//             threadsQuery.populate({
//                 path: "votes",
//                 model: Vote,
//                 match: { voter: currentUserId },
//                 select: "_id type voter thread",

//             });
//         }

//         const totalThreadsCount = await Thread.countDocuments({
//             parentId: { $in: [null, undefined] }
//         })

//         const threads = await threadsQuery.exec()
//         // self votes
//         const hasNext = (totalThreadsCount > skipAmount + threads.length)

//         return {
//             threads,
//             hasNext,
//             totalThreadsCount,
//             pageNumber,
//             pageSize
//         }
//     }
//     catch (e: any) {
//         throw new Error("Fetch Threads Error " + e.message)
//     }
// }