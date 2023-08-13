interface ThreadsResultType {
    docs: any[];
    hasNext: boolean;
    totalThreadsCount: number;
    pageNumber: number;
    pageSize: number;
}
interface ThreadsTabsPropsType {
    currentUserId: string;
    accountId: string;
    accountType: string;
    label: string;
    threadsResult: ThreadsResultType;
}