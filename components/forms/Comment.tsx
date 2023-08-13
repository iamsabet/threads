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
      // window.scrollTo({
      //   top: window.document.body.offsetHeight + 100,
      //   behavior: "smooth",
      // });
    }, 700);
  };

  useEffect(() => {
    const textArea: HTMLInputElement | null = document.getElementById(
      "thread-text-area"
    ) as HTMLInputElement;
    if (textArea) {
      textArea.onblur = (e) => {
        document.getElementById("text-area-copy")?.remove();
      };
      textArea.onkeydown = (e) => {
        // console.log(e.code);
        const users = document.getElementById("usersList")?.children;
        if (
          ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(e.code) >
          -1
        ) {
          if (users && users.length > 0) {
            console.log("2" + e.code);
            // if box is open must e.preventDefault and navigate up and down to selected options
            // else just continue the default
            e.preventDefault();
            switch (e.code) {
              case "ArrowLeft":
                setAutoCompleteNavigator(() => 0);
                break;
              case "ArrowUp":
                setAutoCompleteNavigator((prev) => {
                  if (prev === 0) return users.length - 1;
                  else return prev - 1;
                });
                break;
              case "ArrowRight":
                setAutoCompleteNavigator((_prev) => users.length - 1);
                break;
              case "ArrowDown":
                setAutoCompleteNavigator((prev) => {
                  if (prev === users.length - 1) return 0;
                  else return prev + 1;
                });

                break;
            }
          } else {
            // nop -- continue the default operation
          }

          // if box is open must e.preventDefault and select the already hovered option and e.preventDefault
          // else just continue the default
        } else {
          if (["Space", "Enter"].indexOf(e.code) > -1) {
            if (users && users.length > 0) {
              e.preventDefault();
              clickOnSelected(users);
              return;
            }
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
            if (searchText.length >= 2) {
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
      return clearAutoComplete();
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
        if (position) return { x: position.x, y: position.y + 160 };
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
      "borderRadius",
      "outline",
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
  const selectUsername = (username: string) => {
    // clearAutoComplete();
    const textArea: HTMLInputElement | null = document.getElementById(
      "thread-text-area"
    ) as HTMLInputElement;
    let splitedVal = textArea.value.split("@");
    splitedVal.pop();
    // console.log(splitedVal);
    const setValue = splitedVal.join("@") + "@" + username + " ";
    console.log(setValue);
    // textArea.value = setValue;
    form.setValue("comment", setValue);
    // textArea.selectionEnd = textArea.value.length;
    setTimeout(() => {
      document.getElementById("text-area-copy")?.remove();
      clearAutoComplete();
      textArea.focus();
      setAutoCompleteNavigator(() => 0);
    }, 20);
  };
  const clickOnSelected = (users: HTMLCollection) => {
    setTimeout(() => {
      console.log(autoCompleteNavigator);
      let selectedIndex = 0;
      for (let i in users) {
        const item = users[i];
        // means its the selected one
        if (item.classList && item.classList[0].startsWith("bg-gray")) {
          selectedIndex = parseInt(i);
        }
      }
      // @ts-ignore
      users[selectedIndex]?.click();
      return;
    }, 1);
  };
  const hoverOnItem = (index: number) => {
    setAutoCompleteNavigator((_) => index);
  };

  return (
    <>
      <UsersSuggestions
        usersList={usersList}
        parseFoundText={parseFoundText}
        boxPosition={boxPosition}
        hoverOnItem={hoverOnItem}
        selectUsername={selectUsername}
        autoCompleteNavigator={autoCompleteNavigator}
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
                    id="thread-text-area"
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
