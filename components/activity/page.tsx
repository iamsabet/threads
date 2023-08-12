"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import HTMLReactParser from "html-react-parser";
import { useAuth } from "@clerk/nextjs";
import Spinner from "../Spinner";

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
  const formattedDateString = (date: string) => {
    const newDate = new Date(date);

    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      year: "numeric",
    };

    return (
      newDate
        // @ts-ignore
        .toLocaleString("en-US", options)
        .split(", ")
        .reverse()
        .join(", ")
    );
  };

  useEffect(() => {
    fetchActivities(user_id);

    return () => {};
  }, []);

  return (
    <>
      {activities && activities.length > 0 && (
        <>
          {activities.map((activity: any) => {
            const act = activity.item;
            const type = activity.type;
            return (
              <article key={`${type}"/"${act._id}`} className="activity-card">
                {type === "mention" || type === "reply" ? (
                  <>
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between overflow-hidden">
                        <Link href={`/profile/${act.author.id}`}>
                          <Image
                            src={act.author.image}
                            alt="Profile Picture"
                            width="36"
                            height="36"
                            className="rounded-full object-cover mr-2 mt-0"
                          />
                        </Link>
                        <p className="flex-1 !text-base-regular text-light-1 text-ellipsis line-clamp-1 mt-2 leading-[10rem]">
                          <Link href={`/profile/${act.author.id}`}>
                            <span className="mr-1 text-primary-500">
                              {act.author.name}
                            </span>
                          </Link>{" "}
                          replied to your thread :
                          {/* <span className="ml-1 text-light-2">
                            {HTMLReactParser(act.text)}
                          </span> */}
                        </p>
                      </div>
                      <div className="w-30">
                        <h5 className="text-subtle-medium text-gray-1 mt-3">
                          {formattedDateString(act.createdAt)}
                        </h5>
                      </div>
                    </div>
                    <Link
                      className="user-card_btn px-4 py-2 text-center text-body-bold"
                      href={`/thread/${act.parentId}`}
                    >
                      View
                    </Link>
                  </>
                ) : (
                  <></>
                )}
              </article>
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
