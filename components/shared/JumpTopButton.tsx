"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoChevronBackSharp } from "react-icons/io5";
const JumpTopButton = () => {
  const [show, setShow] = useState<boolean>(false);
  useEffect(() => {
    attachScrollHandler();

    return () => {
      clearScrollHandler();
    };
  }, []);

  const scrollHandler = () => {
    // console.log(
    //   window.scrollY,
    //   "/",
    //   window.innerHeight,
    //   "/",
    //   window.outerHeight
    // );

    setShow((_) => {
      if (window.scrollY > 150 && !show) {
        return true;
      } else {
        return false;
      }
    });
  };

  const attachScrollHandler = () => {
    window.addEventListener("scroll", scrollHandler);
  };
  const clearScrollHandler = () => {
    window.removeEventListener("scroll", scrollHandler);
  };
  const jumpToTop = () => {
    window.scrollTo({
      top: 1,
      behavior: "smooth",
    });
  };
  return (
    <Button
      type="button"
      onClick={jumpToTop}
      className={`fixed p-2 rounded-full shadow-lg flex justify-center items-center ${
        show ? "right-7 opacity-100" : "-right-[100px] opacity-0"
      } bottom-20 z-50 bg-primary-500 transition-all duration-200 ease-out`}
    >
      <div className="rotate-90">
        <IoChevronBackSharp size="32" />
      </div>
    </Button>
  );
};
export default JumpTopButton;
