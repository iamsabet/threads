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
      className={`fixed px-2 py-1 rounded-full shadow-lg flex justify-center items-center ${
        show
          ? "right-8 xl:right-[298px] opacity-100"
          : "-right-[50px] opacity-0"
      } bottom-20 lg:bottom-10 z-50 bg-primary-500 transition-all duration-500 ease-in-out hover:bg-secondary-500`}
    >
      <div className="rotate-90 mb-0.5">
        <IoChevronBackSharp size="26" />
      </div>
    </Button>
  );
};
export default JumpTopButton;
