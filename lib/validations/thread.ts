import * as z from 'zod'

const ThreadValidation = z.object({
    thread: z.string().min(4, 'Minimum 4 characters').max(6000, 'Maximum 6000 characters'),

})

const CommentValidation = z.object({
    comment: z.string().min(1, 'Minimum 1 characters').max(3000, 'Maximum 3000 characters'),
})

export { ThreadValidation, CommentValidation }