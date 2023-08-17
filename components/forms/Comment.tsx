"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { autoCompleteUsernames } from "@/lib/actions/user.actions";
import UsersSuggestions from "../shared/UserSuggestions";
// import { addComment } from "@/lib/actions/thread.actions";
interface PropsType {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
  currentUserName: string;
}
const Comment = ({
  threadId,
  currentUserImage,
  currentUserId,
  currentUserName,
}: PropsType) => {
  const pathname = usePathname();
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [searchText, setSearchText] = useState<string>("");
  const [autoCompleteNavigator, setAutoCompleteNavigator] = useState<number>(0);
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      threadId: threadId,
      text: values.comment,
      authorId: JSON.parse(currentUserId),
      path: pathname,
    });

    form.reset();
    setTimeout(() => {
      const articles = document.querySelectorAll("article h5");
      articles[articles.length - 1]?.scrollIntoView({
        behavior: "smooth",
      });
    }, 1000);
  };
  const setFormValue = (value: string): void => {
    form.setValue("comment", value);
  };
  return (
    <>
      <UsersSuggestions
        type="comment"
        textAreaId="comment-text-area"
        setFormValue={setFormValue}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-3 items-center w-full">
                <FormLabel>
                  <Image
                    src={currentUserImage}
                    alt="profile picture"
                    width="48"
                    height="48"
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-dark-3 text-light-1">
                  <Textarea
                    rows={1}
                    className="no-focus resize-none text-light-1 outline-none"
                    // type="text"
                    placeholder="Comment..."
                    id="comment-text-area"
                    {...field}
                  />
                </FormControl>
                <div
                  id="test"
                  className="hidden"
                  style={{
                    width: "2px",
                    height: "1.2em",
                    background: "red",
                    position: "absolute",
                  }}
                />
              </FormItem>
            )}
          />
          <Button type="submit" className="comment-form_btn bg-primary-500">
            Reply
          </Button>
        </form>
      </Form>
    </>
  );
};

export default Comment;
