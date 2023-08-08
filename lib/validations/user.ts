import * as z from 'zod'

const userValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(4, 'Minimum 4 characters').max(30, 'Maximum 30 characters'),
    username: z.string().min(4, 'Minimum 4 characters').max(30, 'Maximum 30 characters'),
    bio: z.string().min(4, 'Minimum 4 characters').max(500, 'Maximum 500 characters'),

})

export { userValidation }