import { useEffect, useState } from "react";
const usePagination = ({ options, initialValues, getToken }: UsePaginationProps): [boolean, any[] | null] => {
    const { initailDocs, initialLoading, initialHasNext, initialPageNumber } = initialValues
    const [activities, setActivities] = useState<any[] | null>(initailDocs);
    const [loading, setLoading] = useState<boolean>(initialLoading);
    const [reaching, setReaching] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const { baseUrl, pageSize } = options;
    const [hasNext, setHasHext] = useState<boolean>(initialHasNext);

    const fetchActivities = async (page: number, next: boolean) => {
        if (!loading && next) {
            // console.log("trigger fetching");
            setLoading((_) => true);

            let headers: { Authorization?: string } = {}
            if (getToken) {
                const token = await getToken();
                headers["Authorization"] = `Bearer ${token}`
            }

            const acts = await fetch(
                `${baseUrl}?pageNumber=${page}&pageSize=${pageSize}`,
                {
                    headers: headers,
                    cache: "no-cache",
                }
            ).then((res) => res.json());

            setHasHext((_) => acts.hasNext);
            setActivities((_acts) => {
                // console.log(acts.hasNext);
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
        fetchActivities(pageNumber, true);
        attachScrollHandler();
        return () => {
            return clearScrollHandler();
        };
    }, []);

    useEffect(() => {
        if (pageNumber > 1) fetchActivities(pageNumber, hasNext);
    }, [pageNumber]);


    return [loading, activities]

}
export default usePagination