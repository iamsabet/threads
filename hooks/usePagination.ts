import { useEffect, useState } from "react";
const usePagination = ({ options, initialValues, getToken }: UsePaginationProps): [boolean, any[] | null] => {
    const { initailDocs, initialLoading, initialHasNext, initialPageNumber } = initialValues
    const [activities, setActivities] = useState<any[] | null>(initailDocs);
    const [loading, setLoading] = useState<boolean>(initialLoading);
    const [reaching, setReaching] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const { baseUrl, pageSize, postFixQs } = options;
    const [hasNext, setHasHext] = useState<boolean>(initialHasNext);


    const fetchActivities = async (page: number, next: boolean, abortController: AbortController) => {
        if ((!loading && next)) {
            setLoading((_) => true);

            let headers: { Authorization?: string } = {}
            const token = await getToken();
            if (token)
                headers["Authorization"] = `Bearer ${token}`
            const acts = await fetch(
                `${baseUrl}?pageNumber=${page}&pageSize=${pageSize}${postFixQs}`,
                {
                    headers: headers,
                    cache: "no-cache",
                    signal: abortController.signal
                }
            ).then((res) => res.json());

            setHasHext((_) => acts.hasNext);
            setActivities((_acts) => {
                if (!_acts) {
                    return acts.docs;
                } else {
                    return _acts.concat(acts.docs);
                }
            });
            setLoading((_) => false);

        }
    };
    const scrollHandler = () => {
        setReaching((prev) => {
            if (
                Math.round(window.scrollY) + window.outerHeight >=
                document.body.offsetHeight
            ) {
                if (!prev) {
                    setPageNumber((prev) => prev + 1);
                }
                return true;
            } else {
                return false;
            }
        });
    };

    const attachScrollHandler = () => {
        window.addEventListener("scroll", scrollHandler);
    };
    const clearScrollHandler = () => {
        window.removeEventListener("scroll", scrollHandler);
    };

    useEffect(() => {
        const abortController = new AbortController()
        fetchActivities(pageNumber, true, abortController);
        attachScrollHandler();
        return () => {
            abortController.abort()
            return clearScrollHandler();
        };
    }, []);


    useEffect(() => {
        const abortController = new AbortController()
        if (pageNumber > initialPageNumber) fetchActivities(pageNumber, hasNext, abortController);
        return () => {
            abortController.abort()
        }
    }, [pageNumber]);

    return [loading, activities]

}
export default usePagination