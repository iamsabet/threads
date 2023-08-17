import usePagination from "@/hooks/usePagination";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect } from "react";
import UserCard from "../cards/UserCard";
import Spinner from "../Spinner";

const UsersCards = ({ searchString }: { searchString: string }) => {
  const { getToken } = useAuth();
  const [loading, users] = usePagination({
    options: {
      baseUrl: "/api/user/search",
      postFixQs: `&search=${searchString}&sort=desc`,
      pageSize: 20,
    },
    initialValues: {
      initialHasNext: true,
      initailDocs: null,
      initialLoading: false,
      initialPageNumber: 1,
    },
    getToken: getToken,
  });

  useEffect(() => {
    return () => {
      // cleanups
    };
  }, []);

  return (
    <>
      <div className="mt-12 flex flex-col gap-9 justify-center items-center">
        {
          // @ts-ignore
          users && users.length === 0 ? (
            <p className="no-result">No Users</p>
          ) : (
            <>
              {users && (
                <>
                  {
                    // @ts-ignore
                    users.map((person) => (
                      <UserCard
                        key={person.id}
                        user={person}
                        personType="User"
                      />
                    ))
                  }
                </>
              )}
            </>
          )
        }
      </div>
      <div className="w-full my-0 py-0 h-8 mt-5 flex justify-center">
        {loading && <Spinner />}
      </div>
    </>
  );
};

export default UsersCards;
