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
    setShow((_) => {
      if (window.scrollY > 150 && !show) {
        return true;
      } else {
        return false;
      }
    });
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
      className={`fixed px-2 py-1 rounded-full shadow-lg flex justify-center items-center right-7 md:right-8 xl:right-[298px] ${
        show
          ? "bottom-20 md:bottom-10 lg:bottom-10 sm:bottom-28  opacity-100"
          : "bottom-[-50px] opacity-0"
      }z-50 bg-primary-500 transition-all duration-300 ease-in-out hover:bg-secondary-500 hover:text-dark-2`}
    >
      <div className="rotate-90 mb-0.5">
        <IoChevronBackSharp size="26" />
      </div>
    </Button>
  );
};
export default JumpTopButton;
