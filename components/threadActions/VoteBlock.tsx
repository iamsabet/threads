"use client";
import { useState } from "react";
import Image from "next/image";
import { voteToThread } from "@/lib/actions/thread.actions";
type VoteType = "down" | "up" | "";
interface VoteProps {
  threadId: string;
  voterId: string | undefined | null;
  myVote: VoteType;
  votes: number;
}
const VoteBlock = ({ threadId, voterId, myVote, votes }: VoteProps) => {
  const [voteState, setVoteState] = useState<VoteType>(myVote);
  const [votesCount, setVotesCount] = useState<number>(votes);

  const voteAction = async (
    userId: string,
    vote_type: VoteType,
    threadId: string
  ) => {
    return await voteToThread(userId, vote_type, threadId);
  };
  const voteHanlder = (type: VoteType) => {
    if (voterId) {
      if (voteState === type) {
        setVotesCount((_prev) => {
          return voteState === "up" ? _prev - 1 : _prev + 1;
        });
      } else {
        if (type === "down") {
          setVotesCount((_prev) => {
            return voteState === "up" ? votesCount - 2 : votesCount - 1;
          });
        } else {
          setVotesCount((_prev) => {
            return voteState === "down" ? votesCount + 2 : votesCount + 1;
          });
        }
      }
      const targetType = voteState === type ? "" : type;
      voteAction(voterId, targetType, threadId).then((result) => {
        // console.log("Vote result : " + result);
      });
      setVoteState((prev_type) => {
        // console.log("prev : " + prev + " / type : " + type);
        if (prev_type === type) {
          return "";
        } else {
          return type;
        }
      });
    } else {
      // show login popup instead later
      alert("You need to login first :)");
      // redirect("/sign-in");
    }
  };
  return (
    <>
      <div onClick={() => voteHanlder("down")}>
        <Image
          src={`/assets/arrow_down${voteState === "down" ? "_filled" : ""}.svg`}
          alt={`down_vote${voteState === "down" ? "_filled" : ""}`}
          width="17"
          height="17"
          className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
        />
      </div>
      <p className="text-light-3 w-5 text-center">{votesCount}</p>
      <div onClick={() => voteHanlder("up")}>
        <Image
          src={`/assets/arrow_up${voteState === "up" ? "_filled" : ""}.svg`}
          alt={`up_vote${voteState === "up" ? "_filled" : ""}`}
          width="17"
          height="17"
          className="cursor-pointer object-contain transition-all duration-150 ease-in-out hover:scale-110"
        />
      </div>
    </>
  );
};

export default VoteBlock;
