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
  };
  return (
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
              <FormControl className="border-none bg-transparent text-light-1">
                <Input
                  className="no-focus text-light-1 outline-none"
                  type="text"
                  placeholder="Comment..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn bg-primary-500">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
