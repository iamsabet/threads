import { useEffect, useState } from "react";
const usePagination = ({ options, initialValues, getToken }: UsePaginationProps): [boolean, any[] | null, Function] => {
    const { initailDocs, initialLoading, initialHasNext, initialPageNumber } = initialValues
    const [activities, setActivities] = useState<any[] | null>(initailDocs);
    const [loading, setLoading] = useState<boolean>(initialLoading);
    const [reaching, setReaching] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const { baseUrl, pageSize, postFixQs } = options;
    const [postFixQsState, setPostFixQsState] = useState(postFixQs)
    const [hasNext, setHasHext] = useState<boolean>(initialHasNext);
    const [lastSentPostFix, setLastSentPostFix] = useState<string>(postFixQs)

    const fetchActivities = async (page: number, next: boolean, postFix: string) => {
        if ((!loading && next) || (lastSentPostFix !== postFix)) {
            // console.log("trigger fetching");
            setLoading((_) => true);
            console.log("search", postFix)
            let headers: { Authorization?: string } = {}
            const token = await getToken();
            if (token)
                headers["Authorization"] = `Bearer ${token}`
            setLastSentPostFix((_) => postFix)
            const acts = await fetch(
                `${baseUrl}?pageNumber=${page}&pageSize=${pageSize}${postFix}`,
                {
                    headers: headers,
                    cache: "no-cache",
                }
            ).then((res) => res.json());

            setHasHext((_) => acts.hasNext);
            setActivities((_acts) => {
                // console.log(acts.hasNext);
                if (!_acts || (pageNumber === 1 && (lastSentPostFix === postFix))) {
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
        fetchActivities(pageNumber, true, postFixQs);
        attachScrollHandler();
        return () => {
            return clearScrollHandler();
        };
    }, []);

    useEffect(() => {
        if (pageNumber > initialPageNumber) fetchActivities(pageNumber, hasNext, lastSentPostFix);
    }, [pageNumber]);

    const reset = ({ searchString = "" }: { searchString: string }) => {
        setActivities((_) => initailDocs)
        setLoading((_) => initialLoading)
        setReaching((_) => false)
        setHasHext((_) => initialHasNext)
        // setPostFixQsState(`&search=${searchString}&sort=desc`)
        setPageNumber((_) => initialPageNumber)
        setTimeout(() => {
            fetchActivities(1, true, `&search=${searchString}&sort=desc`);
        }, 20)
        // fetchActivities(1, true);
        return
    };

    return [loading, activities, reset]

}
export default usePagination