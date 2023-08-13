import { autoCompleteUsernames } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
interface UsersSuggestionsProps {
  textAreaId: string;
  type: "thread" | "comment";
  setFormValue: (value: string) => void;
}
const UsersSuggestions = ({
  textAreaId,
  type,
  setFormValue,
}: UsersSuggestionsProps) => {
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [boxPosition, setBoxPosition] = useState<PositionType>({ x: 0, y: 0 });
  const [searchText, setSearchText] = useState<string>("");
  const [autoCompleteNavigator, setAutoCompleteNavigator] = useState<number>(0);
  useEffect(() => {
    const textArea: HTMLInputElement | null = document.getElementById(
      textAreaId
    ) as HTMLInputElement;
    if (textArea) {
      textArea.onblur = (e) => {
        document.getElementById("text-area-copy")?.remove();
      };
      textArea.onkeydown = (e) => {
        const users = document.getElementById("usersList")?.children;
        if (
          ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(e.code) >
          -1
        ) {
          if (users && users.length > 0) {
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
            if (searchText.length >= 2) {
              fetchUsersByUsername(searchText);
            } else {
              // clear and hide autocomplete box
              clearAutoComplete();
            }
          } else {
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
      const targetY = type === "thread" ? position.y + 30 : position.y + 150;
      const targetX = type === "thread" ? position.x - 26 : position.x + 10;
      setBoxPosition((_) => {
        if (position) return { x: targetX, y: targetY };
        else return { x: 0, y: 0 };
      });
    }
  };
  const clearAutoComplete = () => {
    setUsersList((_) => []);
    setBoxPosition({ x: 0, y: 0 });
    setSearchText((_) => "");
    document.getElementById("text-area-copy")?.remove();
  };

  const fetchUsersByUsername = (input: string) => {
    setSearchText((_) => input);
    // fetch from api with cancel last one ability
    autoCompleteUsernames({ input }).then((usersString: string) => {
      const users: UserType[] = JSON.parse(usersString);
      if (users.length > 0) {
        // show autocomplete box bellow caret position
        setUsersList((_) => users);
      } else {
        clearAutoComplete();
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
    const textArea: HTMLInputElement | null = document.getElementById(
      textAreaId
    ) as HTMLInputElement;
    let splitedVal = textArea.value.split("@");
    splitedVal.pop();
    const setValue = splitedVal.join("@") + "@" + username + " ";
    // @ts-ignore
    setFormValue(setValue);
    setTimeout(() => {
      document.getElementById("text-area-copy")?.remove();
      clearAutoComplete();
      textArea.focus();
      setAutoCompleteNavigator(() => 0);
    }, 20);
  };
  const clickOnSelected = (users: HTMLCollection) => {
    setTimeout(() => {
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
      {usersList.length > 0 ? (
        <ul
          id="usersList"
          className="fixed z-10 w-[230px] h-auto p-0 m-0 list-none bg-dark-1 rounded-lg"
          style={{ left: boxPosition.x + "px", top: boxPosition.y + "px" }}
        >
          {usersList.map((user, index) => {
            // split with searchText

            const user_username = parseFoundText(user.username);
            return (
              <li
                onMouseEnter={(e) => hoverOnItem(index)}
                onClick={(e) => selectUsername(user.username)}
                key={user.username}
                className={`${
                  autoCompleteNavigator === index ? "bg-gray-700" : ""
                } ransition-all duration-150 ease-in-out flex flex-row justify-center 
                items-center gap-3 h-fit shadow-xl rounded-lg  py-2 px-2
              border-b-gray-50 cursor-pointer`}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersSuggestions;
