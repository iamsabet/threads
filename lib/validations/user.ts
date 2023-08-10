import * as z from 'zod'
import { checkUsernameExists } from '../actions/user.actions'

const checkExists = async (value: string) => {
    return await checkUsernameExists(value)
}

const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(4, 'Minimum 4 characters').max(30, 'Maximum 30 characters'),
    // must check username does not have . / > < ( ) ? $ # @ ! % ^ & * = + [] {}
    username: z.string()
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "The username must contain only letters[a-z,A-Z], numbers[0-9] and underscore (_)"
        ).min(4, 'Minimum 4 characters')
        .max(30, 'Maximum 30 characters').refine(checkExists, "Username is already taken"),
    bio: z.string().min(4, 'Minimum 4 characters').max(500, 'Maximum 500 characters'),

})

export { UserValidation }