import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware

export default authMiddleware({
    publicRoutes: [
        '/', '/api/webhook/clerk', '/api/user/username', '/api/thread', '/api/user/search'
    ],
    ignoredRoutes: [
        '/api/webhook/clerk', '/api/user/username'
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
