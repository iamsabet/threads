import { ClerkProvider } from "@clerk/nextjs";
// import { Inter } from "next/font/google";
import React from "react";
import "../globals.css";
export const metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Clone Application",
};

// const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          // className={`${inter.className} bg-dark-1`}
          className="bg-dark-1"
          suppressHydrationWarning={true}
        >
          <div className="w-full flex flex-row justify-center items-center min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
