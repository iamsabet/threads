import mongoose from 'mongoose'
const threadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,

        // must be like this as a function not a value like Date.now()
        default: Date.now,

    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)

export default Thread

// Oirignal Thread
//     -> Thread comment 1
//     -> Thread comment 2
//         -> Thread comment 3