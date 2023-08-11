import * as z from 'zod'

const ThreadValidation = z.object({
    thread: z.string().min(4, 'Minimum 4 characters'),

})

const CommentValidation = z.object({
    comment: z.string().min(1, 'Minimum 1 characters'),
})

export { ThreadValidation, CommentValidation }