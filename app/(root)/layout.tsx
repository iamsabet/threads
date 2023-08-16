import { ClerkProvider, currentUser } from "@clerk/nextjs/app-beta";
import "../globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import TopBar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import BottomBar from "@/components/shared/BottomBar";
import { ThemeProvider } from "@/components/theme/theme.-provider";
import JumpTopButton from "@/components/shared/JumpTopButton";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads Clone Application",
};

export default async function RootLayout({
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
          <BottomBar />
          <JumpTopButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
