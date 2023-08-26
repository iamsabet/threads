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
import { ChangeEvent, useRef, useState } from "react";
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
      "1": -1,
      "2": -1,
      "3": -1,
      "4": -1,
      "5": -1,
      "6": -1,
    },
  });
  const keyItems = [1, 2, 3, 4, 5, 6];
  const inputRefs = keyItems.map((x) => useRef<HTMLInputElement>(null));
  const handlerForward = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    let value = e.currentTarget.value;
    if (value) {
      try {
        let int_value = parseInt(value);
        if (isNaN(int_value)) {
          e.currentTarget.value = "";
        }
      } catch (e) {}
    }
    if (e.currentTarget.value !== "" && idx + 1 <= inputRefs.length - 1) {
      if (inputRefs && inputRefs[idx + 1].current) {
        const next = inputRefs[idx + 1].current;
        if (next) {
          next.focus();
        }
      }
    }
    if (idx + 1 === inputRefs.length) {
      inputRefs[idx].current?.blur();
    }
  };
  // @ts-ignore
  const handlerBackward = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    e.currentTarget.value = "";
    let target = idx - 1;
    if (target < 0) return;
    if (e.key.toString() === "Backspace" || e.key.toString() === "Delete") {
      if (inputRefs && inputRefs[target].current) {
        const prev = inputRefs[target].current;
        if (prev) {
          const prevVal = prev.value;
          prev.focus();
          setTimeout(() => {
            prev.value = prevVal;
            prev.selectionStart = 0;
            prev.selectionEnd = 1;
          }, 1);
        }
      }
    }
  };
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
  };

  return (
    <div className="w-full">
      <div></div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-row justify-between">
            <div className="flex flex-row justify-between gap-2">
              {keyItems.map((item, index) => {
                const itemStr = item.toString() as
                  | "1"
                  | "2"
                  | "3"
                  | "4"
                  | "5"
                  | "6";
                return (
                  <FormField
                    control={form.control}
                    name={itemStr}
                    render={({ field }) => (
                      <FormItem className="flex">
                        <FormControl className="no-focus bg-opacity-10 bg-dark-3 text-light-1 border-0 border-b-2 rounded-none">
                          <Input
                            className="w-7 p-1 text-center transition-colors duration-150 ease-in-out
                            border-b-light-1 border-opacity-20 focus:border-b-purple-600 focus:border-opacity-100 
                            border-b-2 text-[20px]"
                            type="text"
                            maxLength={1}
                            ref={inputRefs[index]}
                            onFocus={(e) => {
                              e.currentTarget.selectionStart = 0;
                              e.currentTarget.selectionEnd = 1;
                            }}
                            onChange={(e) => handlerForward(index, e)}
                            onKeyDown={(e) => handlerBackward(index, e)}
                            id={itemStr}
                            // {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
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
