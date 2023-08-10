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
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Vote'
        }
    ],
}, { timestamps: true })

threadSchema.pre('save', async (doc) => {
    // console.log("saved " + this._id + " doc ")
})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)

export default Thread

// Oirignal Thread
//     -> Thread comment 1
//     -> Thread comment 2
//         -> Thread comment 3