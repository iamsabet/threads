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
import { ChangeEvent, RefObject, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeSharp, IoWarning, IoWarningSharp } from "react-icons/io5";
import {
  RiErrorWarningFill,
  RiErrorWarningLine,
  RiEyeFill,
  RiEyeOffFill,
} from "react-icons/ri";
import { z } from "zod";

const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState(false);

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
          verifyRequest();
        }
      }
    } else if (idx + 1 === inputRefs.length) {
      inputRefs[idx].current?.blur();
      verifyRequest();
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
  const handleResend = () => {
    setCounter((_) => 30);
    const interVal = setInterval(() => {
      setCounter((_prevCounter) => {
        if (_prevCounter - 1 === 0) {
          clearInterval(interVal);
        }
        return _prevCounter - 1;
      });
    }, 1000);
  };
  const checkVerificationsComplete = () => {
    let verificationCode = "";
    inputRefs.forEach((ref: RefObject<HTMLInputElement>) => {
      if (ref.current?.value && ref.current?.value.length === 1) {
        verificationCode += ref.current?.value;
      } else {
        return null;
      }
    });

    return verificationCode.length === 6 ? verificationCode : null;
  };
  const verifyRequest = async () => {
    const verificationCode = checkVerificationsComplete();
    if (verificationCode) {
      setLoading((_) => true);
      console.log("verificationCode :" + verificationCode);
      setTimeout(() => {
        setLoading((_) => false);
      }, 1500);
    }
  };

  const onSubmit = async (values: z.infer<typeof VerifyValidation>) => {
    // console.log(values.username + "/" + values.email + "/" + values.password);
    setLoading((_) => true);
    setTimeout(() => {
      setLoading((_) => false);
    }, 2000);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-row justify-start items-center gap-5">
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
            <div className="text-center my-0 py-0 h-8 mt-5">
              {loading && <Spinner />}
            </div>
          </div>
        </form>
        <div
          className={`flex justify-start gap-1 items-center transition-all duration-150 ease-in-out text-red-600 ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-body-normal">
            <RiErrorWarningFill />
          </span>
          <span className="text-small-medium">Incorrect code</span>
        </div>
      </Form>
      <button
        disabled={counter > 0}
        className={`text-small-regular mt-8 form-link h-5 ${
          counter ? "opacity-50 hover:text-primary-500" : ""
        }`}
        // href="?"
        onClick={(e) => {
          handleResend();
        }}
      >
        Didn't receive a code? Resend {counter ? `(${counter})` : ""}
      </button>
    </div>
  );
};

export default VerifyForm;
