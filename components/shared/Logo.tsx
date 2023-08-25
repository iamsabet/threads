import React from "react";
import Image from "next/image";
const Logo = ({ size = 34 }: { size?: number }) => {
  return (
    <Image
      src="/assets/logo_gradient_2.svg"
      alt="logo"
      width={size}
      height={size}
    />
  );
};

export default Logo;
