interface UsePaginationProps {
    options: {
        baseUrl: string;
        pageSize: number;
    };
    initialValues: {
        initailDocs: any[] | null;
        initialLoading: boolean;
        initialHasNext: boolean;
        initialPageNumber: number;
    };
    getToken?: Function;
}