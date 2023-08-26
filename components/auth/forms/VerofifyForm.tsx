"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifyValidation } from "@/lib/validations/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeSharp } from "react-icons/io5";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { z } from "zod";

const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm({
    resolver: zodResolver(VerifyValidation),
    defaultValues: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof VerifyValidation>) => {
    // console.log(values.username + "/" + values.email + "/" + values.password);
    setLoading((_) => true);
    // await createThread({
    //   text: values.thread,
    //   author: userId,
    //   communityId: null,
    //   path: pathname,
    //   repost: null,
    // });
    //
    // use login server action
    setTimeout(() => {
      setLoading((_) => false);
    }, 2000);

    // will be redirected by the server
    // router.push("/profile/" + user_id);
  };

  //   const setFormUsername = (value: string): void => {
  //     form.setValue("username", value);
  //   };
  //   const setFormPassword = (value: string): void => {
  //     form.setValue("password", value);
  //   };

  return (
    <div className="w-full">
      <div></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-row justify-between">
            <FormField
              control={form.control}
              name="1"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl
                    className="no-focus border-0 border-opacity-30 bg-dark-3 text-light-1 rounded-md shadow-md
                    "
                  >
                    <Input
                      className="form-input w-8 p-1"
                      type="text"
                      maxLength={1}
                      id="1"
                      // maxLength={30}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />]
                </FormItem>
              )}
            />
          </div>
          {/* <div className="text-center my-0 py-0 h-8 mt-5">
            {loading && <Spinner />}
          </div>
          <p className="text-gray-2 text-[13px]">
            Have an account?{" "}
            <Link href="/login" className="form-link">
              Sign In
            </Link>
          </p> */}
          {/* <Button
            className="rounded-md bg-primary-500 hover:bg-secondary-500 text-light-1 hover:text-dark-1 
                transition-colors duration-150 ease-in-out shadow-md"
            disabled={loading}
            type="submit"
          >
            Continue
          </Button> */}
        </form>
      </Form>
    </div>
  );
};

export default VerifyForm;
