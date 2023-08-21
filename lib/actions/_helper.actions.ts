import User from "../models/user.model";

const handleVotesCount = (threads: Omit<Omit<any, never>, never>[], threads_my_votes_only: Omit<any, never>[] | undefined, childrenVotesCount: boolean = false) => {

    let new_threads = JSON.parse(JSON.stringify(threads))
    new_threads.forEach((newThread: any, index: any) => {
        if (threads_my_votes_only) {
            let my_index = threads_my_votes_only.findIndex((item) => (item._id.toString() === newThread._id))
            if (my_index > -1) {
                newThread.myVote = threads_my_votes_only[my_index].votes[0] ? threads_my_votes_only[my_index].votes[0].type : "";
            }
            else {
                newThread.myVote = ""
            }
        }
        else {
            newThread.myVote = ""
        }
        if (childrenVotesCount) {
            if (newThread.children && newThread.children.length > 0) {

                newThread.children.forEach((newChildThread: any, childIndex: any) => {
                    if (threads_my_votes_only) {
                        let my_index = threads_my_votes_only.findIndex((item) => (item._id.toString() === newChildThread._id))
                        if (my_index > -1) {
                            newChildThread.myVote = threads_my_votes_only[my_index].votes[0] ? threads_my_votes_only[my_index].votes[0].type : "";
                        }
                        else {
                            newChildThread.myVote = ""
                        }
                    }
                    else {
                        newChildThread.myVote = ""
                    }
                })
            }
        }
    });
    return new_threads;
}

const replaceMentions = async (text: string): Promise<string> => {
    let splitted = text.split(" ")
    let textList = []
    for (let i in splitted) {
        let item = splitted[i]
        if (item.startsWith("@")) {
            const selectedUserName = item.split("@")[1]
            const user = (await User.findOne({ username: selectedUserName }, { id: 1 })) as UserType
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