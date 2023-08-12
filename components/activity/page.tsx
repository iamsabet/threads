"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import HTMLReactParser from "html-react-parser";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";
import { formattedDateString } from "../shared/helpers";

const ActivitiesComponent = ({ user_id }: { user_id: string }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { getToken } = useAuth();
  const fetchActivities = async (user_id: string) => {
    if (!loading) {
      setLoading((_) => true);
      const token = await getToken();
      const acts = await fetch(`/api/activity?pageNumber=1&pageSize=10&`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-cache",
      }).then((res) => res.json());
      console.log(acts);
      setActivities((_) => acts.docs);
      setLoading((_) => false);
    }
  };

  useEffect(() => {
    fetchActivities(user_id);

    return () => {};
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
                      <span className="flex justify-center items-center pr-1.5 w-[35px]">
                        {act.type === "vote" && (
                          <Image
                            src={`/assets/arrow_${
                              act.message.split(" ")[0].split("vote")[0]
                            }.svg`}
                            alt={`${act.message.split(" ")[0]} icon`}
                            width="19"
                            height="19"
                            className="cursor-pointer w-[19px] h-auto object-contain transition-all duration-150 ease-in-out hover:scale-110"
                          />
                        )}
                        {act.type === "reply" && (
                          <Image
                            src="/assets/reply.svg"
                            alt="reply"
                            width="30"
                            height="30"
                            className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
                          />
                        )}
                        {act.type === "mention" && (
                          <h1
                            className="font-semibold text-[23px]"
                            style={{ color: "#5C5C7B" }}
                          >
                            @
                          </h1>
                        )}
                      </span>
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
    </>
  );
};

export default ActivitiesComponent;
