
interface PropsType {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
    repost: string | null
}
interface CommentType {
    authorId: string,
    text: string,
    threadId: string,
    path: string,
}
interface PaginatePropsType {
    pageNumber: number;
    pageSize: number;
    currentUserId: any;
    currentUser?: UserType;
    sortBy?: "votePoints" | "createdAt"
}
interface PaginatePropsTypeByQuery extends PaginatePropsType {
    accountId?: string | string[] | null,
    label?: string
}

interface FollowType {
    follower: string
    following: string
    path: string

}


