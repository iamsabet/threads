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
import { ResetPassValidation } from "@/lib/validations/reset-pass";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import { z } from "zod";

const ResetPassForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const form = useForm({
    resolver: zodResolver(ResetPassValidation),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPassValidation>) => {
    const email = localStorage.getItem("verificationEmail");
    const code = localStorage.getItem("verificationCode");

    console.log(values.password, "/", values.confirm);

    console.log(email, "/", code);
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-0 w-full relative">
                <FormLabel className="font-semibold text-[13px] text-light-2 mb-0 ml-0.5">
                  Password
                </FormLabel>
                <FormControl className="no-focus border border-gray-2 border-opacity-30 bg-dark-3 text-light-1 rounded-md shadow-md">
                  <Input
                    className="form-input"
                    type={showPass ? "text" : `password`}
                    id="password"
                    // maxLength={30}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
                <Button
                  className="bg-dark-1 w-6 h-6 p-0.5 absolute right-3 top-7 rounded-md z-50 text-light-2 flex flex-col justify-center"
                  onMouseDown={(e) => {
                    if (!showPass) setShowPass((_prev) => !_prev);
                  }}
                  onMouseUp={(e) => {
                    if (showPass) setShowPass((_prev) => !_prev);
                  }}
                >
                  {showPass ? (
                    <RiEyeOffFill size={16} color="#FFFFFF" />
                  ) : (
                    <RiEyeFill size={16} color="#FFFFFF" />
                  )}
                </Button>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-0 w-full relative">
                <FormLabel className="font-semibold text-[13px] text-light-2 mb-0 ml-0.5">
                  Password
                </FormLabel>
                <FormControl className="no-focus border border-gray-2 border-opacity-30 bg-dark-3 text-light-1 rounded-md shadow-md">
                  <Input
                    className="form-input"
                    type={showPass ? "text" : `password`}
                    id="password"
                    // maxLength={30}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
                <Button
                  className="bg-dark-1 w-6 h-6 p-0.5 absolute right-3 top-7 rounded-md z-50 text-light-2 flex flex-col justify-center"
                  onMouseDown={(e) => {
                    if (!showPass) setShowPass((_prev) => !_prev);
                  }}
                  onMouseUp={(e) => {
                    if (showPass) setShowPass((_prev) => !_prev);
                  }}
                >
                  {showPass ? (
                    <RiEyeOffFill size={16} color="#FFFFFF" />
                  ) : (
                    <RiEyeFill size={16} color="#FFFFFF" />
                  )}
                </Button>
              </FormItem>
            )}
          />
          <Button
            className="rounded-md bg-primary-500 hover:bg-secondary-500 text-light-1 hover:text-dark-1 
                transition-colors duration-150 ease-in-out shadow-md"
            disabled={loading}
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Form>
      <div className="text-center my-0 py-0 h-8 mt-5">
        {loading && <Spinner />}
      </div>
      <p className="text-gray-2 text-[13px]">
        Have an account?{" "}
        <Link href="/login" className="form-link">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ResetPassForm;
