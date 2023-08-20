"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";
import { formattedDateString } from "../shared/helpers";
import ActivityIcon from "./ActivityIcon";
import usePagination from "@/hooks/usePagination";
import Avatar from "../shared/Avatar";

const ActivitiesComponent = () => {
  const { getToken } = useAuth();
  const [loading, activities] = usePagination({
    options: {
      baseUrl: "/api/activity",
      postFixQs: "",
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

  return (
    <>
      {activities && activities.length > 0 && (
        <>
          {activities.map((act: any, index: number) => {
            return (
              <Link key={`${act.type}"-"${act.link}-${index}`} href={act.link}>
                <article className="activity-card">
                  <div className="flex flex-col justify-start sm:flex-row sm:justify-between w-full">
                    <div className="flex justify-between overflow-hidden">
                      <div className="relative h-full">
                        <Avatar
                          src={act.subject.image}
                          alt="Profile Picture"
                          width={50}
                          height={50}
                          loadingText={act.subject.username.charAt(0)}
                        />
                        <ActivityIcon
                          type={act.type}
                          message={act.message}
                          styles="flex absolute z-[10] top-10 sm:top-5 left-10 sm:left-7"
                        />
                      </div>
                      <p className="flex flex-col sm:flex-row flex-1 !text-base-regular text-light-1 mt-2 ml-2 leading-[10rem]">
                        <span className="mr-1 text-primary-500 text-ellipsis line-clamp-1 w-max-[132px]  h-full">
                          {act.subject.name}
                        </span>

                        <span className="text-ellipsis line-clamp-1 w-max-[210px] h-full">
                          {act.message}
                        </span>
                        {/* <span className="ml-1 text-light-2">
                            {HTMLReactParser(act.text)}
                          </span> */}
                      </p>
                    </div>
                    <div className="w-30">
                      <h5 className="text-subtle-medium text-gray-1 mt-3 ml-1.5 sm:ml-0">
                        {formattedDateString(act.createdAt)}
                      </h5>
                    </div>
                  </div>
                  {/* <Link
                       href={act.link}
                      className="user-card_btn px-4 py-2 text-center text-body-bold"
                   
                    >
                      View
                    </Link> */}
                </article>
              </Link>
            );
          })}
        </>
      )}
      {!loading && activities && activities.length === 0 && (
        <p className="!text-base-regular text-light-3">No Activity yet</p>
      )}
      {loading && (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default ActivitiesComponent;
