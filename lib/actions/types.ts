interface PropsType {
    text: string,
    author: string,
    communityId: string | null,
    path: string
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
    currentUserId: string | null;
}
interface PaginatePropsTypeByQuery extends PaginatePropsType {
    accountId?: string | null
}