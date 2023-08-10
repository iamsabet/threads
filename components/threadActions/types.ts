type VoteType = "down" | "up" | "";
interface VoteProps {
    type: "down" | "up";
    threadId: string;
    voterId: string | undefined | null;
    vote: VoteType;
    voteHandler: (type: VoteType) => void;
}

