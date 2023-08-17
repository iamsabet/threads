import User from "../models/user.model";

const handleVotesCount = (threads: Omit<Omit<any, never>, never>[], threads_my_votes_only: Omit<any, never>[] | undefined, childrenVotesCount: boolean = false) => {
    let threads_final: any[] = []
    threads.forEach((thread, index) => {
        let newThread = JSON.parse(JSON.stringify(thread));
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

const replaceMentions = async (text: string): Promise<string> => {
    let splitted = text.split(" ")
    let textList = []
    for (let i in splitted) {
        let item = splitted[i]
        if (item.startsWith("@")) {
            const selectedUserName = item.split("@")[1]
            const user = (await User.findOne({ username: selectedUserName })) as UserType
            if (user && user.id) {
                let newTextSlice = `<a class="global-mention" href="/profile/${user.id}">${item}</a>`
                textList.push(newTextSlice)
            }
            else {
                textList.push(item)
            }
        }
        else {
            textList.push(item)
        }
    }

    text = textList.join(" ");
    return text
}

export { handleVotesCount, replaceMentions }