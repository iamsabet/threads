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
// @ts-ignore
export const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [searchText, setSearchText] = useState<string>("");
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
    },
  });

  useEffect(() => {
    const textArea: HTMLInputElement | null = document.getElementById(
      "thread-text-area"
    ) as HTMLInputElement;
    if (textArea) {
      textArea.onblur = (e) => {
        console.log("unfocus()");
        document.getElementById("text-area-copy")?.remove();
      };
      textArea.onkeydown = (e) => {
        if (
          ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(e.code) >
          -1
        ) {
          switch (e.code) {
            // if box is open must e.preventDefault and navigate up and down to selected options
            // else just continue the default
            case "ArrowLeft":
              console.log("Left key");
              break;
            case "ArrowUp":
              console.log("Up key");
              break;
            case "ArrowRight":
              console.log("Right key");
              break;
            case "ArrowDown":
              console.log("Down key");
              break;
          }

          // if box is open must e.preventDefault and select the already hovered option and e.preventDefault
          // else just continue the default
        } else {
          if (["Space", "Enter"].indexOf(e.code)) {
          }
          const test: HTMLElement | null = document.getElementById("test");
          setCaretPosition(textArea, test);

          const textValue = textArea.value + e.key;

          let splitedTextByAtSign = textValue
            .split(" ")
            [textValue.split(" ").length - 1].split("@");
          if (splitedTextByAtSign.length > 1) {
            const searchText =
              splitedTextByAtSign[splitedTextByAtSign.length - 1];
            console.log(searchText);
            if (searchText.length >= 3) {
              fetchUsersByUsername(searchText);
            } else {
              // clear and hide autocomplete box
              // console.log("Clear");
              clearAutoComplete();
            }
          } else {
            // console.log("Clear");
            clearAutoComplete();
            // clear and hide autocomplete box
          }
        }
      };
    }

    return () => {
      return;
    };
  }, []);
  const setCaretPosition = (
    textArea: HTMLInputElement,
    test: HTMLElement | null
  ) => {
    var position = getCaretPosition(textArea);
    if (test && position) {
      test.style.left = position.x + 26 + "px";
      test.style.top = position.y + 26 + "px";
      setBoxPosition((_) => {
        if (position) return { x: position.x - 26, y: position.y + 30 };
        else return { x: 0, y: 0 };
      });
    }
  };
  const clearAutoComplete = () => {
    setUsersList((_) => []);
    setBoxPosition({ x: 0, y: 0 });
    setSearchText((_) => "");
  };
  const fetchUsersByUsername = (input: string) => {
    setSearchText((_) => input);
    // fetch from api with cancel last one ability
    autoCompleteUsernames({ input }).then((usersString: string) => {
      const users: UserType[] = JSON.parse(usersString);
      if (users.length > 0) {
        // show autocomplete box bellow caret position
        setUsersList((_) => users);

        console.log(users);
      } else {
        clearAutoComplete();
        // clear and hide autocomplete box
        // console.log("Clear");
      }
    });
  };
  const createCopy = (textArea: HTMLInputElement) => {
    var copy = document.createElement("div");
    copy.id = "text-area-copy";
    copy.textContent = textArea.value;
    var style = getComputedStyle(textArea);
    [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "wordWrap",
      "whiteSpace",
      "borderLeftWidth",
      "borderTopWidth",
      "borderRightWidth",
      "borderBottomWidth",
    ].forEach((key) => {
      // @ts-ignore
      copy.style[key] = style[key];
    });
    copy.style.overflow = "auto";
    copy.style.width = textArea.offsetWidth + "px";
    copy.style.height = textArea.offsetHeight + "px";
    copy.style.position = "absolute";
    copy.style.left = textArea.offsetLeft + "px";
    copy.style.top = textArea.offsetTop + "px";
    document.body.appendChild(copy);
    return copy;
  };

  const getCaretPosition = (textArea: HTMLInputElement) => {
    var start = textArea.selectionStart;
    var end = textArea.selectionEnd;
    var copy = createCopy(textArea);
    var range = document.createRange();
    try {
      // @ts-ignore
      range.setStart(copy.firstChild, start);
      // @ts-ignore
      range.setEnd(copy.firstChild, end);
      var selection = document.getSelection();
      // @ts-ignore
      selection.removeAllRanges();
      // @ts-ignore
      selection.addRange(range);
      var rect = range.getBoundingClientRect();
      document.body.removeChild(copy);
      textArea.selectionStart = start;
      textArea.selectionEnd = end;
      textArea.focus();
      return {
        x: rect.left - textArea.scrollLeft,
        y: rect.top - textArea.scrollTop,
      };
    } catch (e) {
      console.log(e);
    }
  };

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });
    router.push("/");
  };
  const parseFoundText = (name: string) => {
    const usernameSplited = name.split(searchText);

    if (usernameSplited[0] === "") {
      return (
        <>
          <span className="text-primary-500">{searchText}</span>
          {usernameSplited[1]}
        </>
      );
    } else if (usernameSplited[1] === "") {
      return (
        <>
          {usernameSplited[0]}
          <span className="text-primary-500">{searchText}</span>
        </>
      );
    } else {
      return usernameSplited[1] ? (
        <>
          {usernameSplited[0]}
          <span className="text-primary-500">{searchText}</span>
          {usernameSplited[1]}
        </>
      ) : (
        usernameSplited[0]
      );
    }
  };
  return (
    <>
      {usersList.length > 0 && (
        <ul
          className="fixed z-10 w-[230px] h-auto p-0 m-0 list-none bg-transparent"
          style={{ left: boxPosition.x + "px", top: boxPosition.y + "px" }}
        >
          {usersList.map((user) => {
            // split with searchText

            const user_username = parseFoundText(user.username);
            return (
              <li
                key={user.name}
                className="flex flex-row justify-center items-center gap-3 h-fit bg-dark-1 shadow-xl rounded-lg  py-2 px-2 border-b-gray-500 hover:bg-gray-700 cursor-pointer"
              >
                <Image
                  className="rounded-full shadow-lg object-contain"
                  src={user.image}
                  alt="Profile Image"
                  width="40"
                  height="40"
                />

                <div className="flex flex-col flex-1 items-start justify-start line-clamp-1 text-ellipsis">
                  <h4 className="text-light-2">@{user_username}</h4>
                  <h5 className="text-light-3">{user.name}</h5>
                </div>
              </li>
            );
          })}
        </ul>
      )}
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
