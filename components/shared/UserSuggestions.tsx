import Image from "next/image";
const UsersSuggestions = ({
  usersList,
  parseFoundText,
  selectUsername,
  hoverOnItem,
  boxPosition,
  autoCompleteNavigator,
}: UsersSuggestionsProps) => {
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
