"use client";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const SidebarLinks = ({
  type,
  text_class,
}: {
  type: "leftsidebar_link" | "bottombar_link";
  text_class: string;
}) => {
  const pathname = usePathname();
  return (
    <>
      {sidebarLinks.map((item, id) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <Link
            href={item.route}
            key={item.label}
            className={`${type} ${isActive && "bg-primary-500"}`}
          >
            <Image src={item.imgURL} alt={item.label} width="24" height="24" />
            <p className={`${text_class}`}>
              {type === "leftsidebar_link"
                ? item.label
                : item.label.split(" ")[0]}
            </p>
          </Link>
        );
      })}
    </>
  );
};

export default SidebarLinks;
