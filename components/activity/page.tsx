"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
// import HTMLReactParser from "html-react-parser";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";
import { formattedDateString } from "../shared/helpers";
import ActivityIcon from "./ActivityIcon";
import JumpTopButton from "../shared/JumpTopButton";

const ActivitiesComponent = ({ user_id }: { user_id: string }) => {
  const [activities, setActivities] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const pageSize = 10;
  const [pageNumber, setPageNumber] = useState(2);
  const fetchActivities = async (user_id: string) => {
    if (!loading) {
      setLoading((_) => true);
      const token = await getToken();
      const acts = await fetch(`/api/activity?pageNumber=1&pageSize=10&`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-cache",
      }).then((res) => res.json());
      setActivities((_) => acts.docs);
      setLoading((_) => false);
    }
  };
  const scrollHandler = () => {
    // console.log(
    //   window.scrollY,
    //   "/",
    //   window.innerHeight,
    //   "/",
    //   window.outerHeight
    // );

    if (window.scrollY > 200) {
      // console.log("middle")
    }
    if (window.scrollY > window.innerHeight - 200) {
      // console.log("reaches bottom");
    }
  };

  const attachScrollHandler = () => {
    window.addEventListener("scroll", scrollHandler);
  };
  const clearScrollHandler = () => {
    window.removeEventListener("scroll", scrollHandler);
  };

  useEffect(() => {
    fetchActivities(user_id);
    attachScrollHandler();
    return () => {
      return clearScrollHandler();
    };
  }, []);

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
                      <ActivityIcon
                        type={act.type}
                        message={act.message}
                        styles="hidden xs:flex"
                      />
                      <Image
                        src={act.subject.image}
                        alt="Profile Picture"
                        width="40"
                        height="40"
                        className="rounded-full object-fill mr-2 mt-2 w-[50px] h-[50px] sm:mt-0 sm:w-[40px] sm:h-[40px] "
                      />
                      <p className="flex flex-col sm:flex-row flex-1 !text-base-regular text-light-1 mt-2 leading-[10rem]">
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
      <JumpTopButton />
    </>
  );
};

export default ActivitiesComponent;
