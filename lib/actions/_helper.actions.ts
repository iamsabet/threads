const handleVotesCount = (threads: Omit<Omit<any, never>, never>[], threads_my_votes_only: Omit<any, never>[] | undefined, childrenVotesCount: boolean = false) => {
    let threads_final: any[] = []
    threads.forEach((thread, index) => {
        let newThread = JSON.parse(JSON.stringify(thread));
        const voteCounts = thread.votes.reduce((acc: { upVotes: number, downVotes: number }, vote: VoteProps) => {
            if (vote.type === "up") {
                acc.upVotes++;
            } else if (vote.type === "down") {
                acc.downVotes++;
            }
            return acc;
        }, { upVotes: 0, downVotes: 0 });
        newThread.votes = voteCounts.upVotes - voteCounts.downVotes;
        if (threads_my_votes_only) {
            newThread.myVote = threads_my_votes_only[index].votes[0] ? threads_my_votes_only[index].votes[0].type : "";
        }
        else {
            newThread.myVote = ""
        }
        if (childrenVotesCount) {
            if (thread.children && thread.children.length > 0) {
                let finalChildren: any[] = [];
                thread.children.forEach((childThread: any, childIndex: any) => {
                    let newChildThread = JSON.parse(JSON.stringify(childThread));
                    const childVoteCounts = childThread.votes.reduce((acc: { upVotes: number, downVotes: number }, vote: VoteProps) => {
                        if (vote.type === "up") {
                            acc.upVotes++;
                        } else if (vote.type === "down") {
                            acc.downVotes++;
                        }
                        return acc;
                    }, { upVotes: 0, downVotes: 0 });
                    newChildThread.votes = childVoteCounts.upVotes - childVoteCounts.downVotes;
                    if (threads_my_votes_only) {
                        newChildThread.myVote = threads_my_votes_only[index].children[childIndex].votes[0] ? threads_my_votes_only[index].children[childIndex].votes[0].type : "";
                    }
                    else {
                        newChildThread.myVote = ""
                    }
                    finalChildren.push(newChildThread)
                })
                newThread.children = finalChildren;
            }
        }
        threads_final.push(newThread)
    });
    return threads_final;
}

export { handleVotesCount }