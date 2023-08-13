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
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";
import { autoCompleteUsernames } from "@/lib/actions/user.actions";
import Image from "next/image";
import UsersSuggestions from "../shared/UserSuggestions";
// @ts-ignore
export const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });
    router.push("/");
  };

  const setFormValue = (value: string): void => {
    form.setValue("thread", value);
  };

  return (
    <>
      <UsersSuggestions
        type="thread"
        textAreaId="thread-text-area"
        setFormValue={setFormValue}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-start gap-10 mt-10"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 w-full ">
                <FormLabel className="text-base-semibold text-light-2 mt-1">
                  Content
                </FormLabel>
                <FormControl
                  className="no-focus border border-dark-4
              resize-none bg-dark-3 text-light-1"
                >
                  <Textarea rows={15} {...field} id="thread-text-area" />
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
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-primary-500">
            Post Thread
          </Button>
        </form>
      </Form>
    </>
  );
};

export default PostThread;
