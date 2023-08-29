interface AuthorType {
    _id: string;
    id: string;
    color: string;
    name: string;
    username: string;
    image: string;
}
interface ThreadProps {
    id: string;
    currentUserId: string;
    repost: string | null;
    parentId: string;
    content: string;
    author: AuthorType;
    createdAt: string;
    comments: {
        author: AuthorType;
    }[];
    isComment?: boolean;
    isMainThread?: boolean;
    votes: number;
    myVote?: VoteType;
}