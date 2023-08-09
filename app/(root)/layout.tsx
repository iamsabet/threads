import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "../globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Clone Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          // className={inter.className}
          suppressHydrationWarning={true}
        >
          <TopBar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          {children}
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}