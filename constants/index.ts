import { dark } from "@clerk/themes";

export const sidebarLinks = [
    {
        imgURL: "/assets/home.svg",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/search.svg",
        route: "/search",
        label: "Search",
    },
    {
        imgURL: "/assets/create.svg",
        route: "/create-thread",
        label: "Create Thread",
    },
    {
        imgURL: "/assets/heart.svg",
        route: "/activity",
        label: "Activity",
    },
    // {
    //     imgURL: "/assets/community.svg",
    //     route: "/communities",
    //     label: "Communities",
    // },
    {
        imgURL: "/assets/user.svg",
        route: "/profile",
        label: "Profile",
    },
];

export const profileTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "replies", label: "Replies", icon: "/assets/members.svg" },
    { value: "mentioned", label: "Mentioned", icon: "/assets/atsign.svg" },
];

export const communityTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "members", label: "Members", icon: "/assets/members.svg" },
    { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];

export const clerckComponentsOptions: any = {
    baseTheme: dark,
    variables: {},
    layout: {
        logoPlacement: "inside",
        logoImageUrl: "/assets/logo.png",
        shimmer: true,
        socialButtonsVariant: "blockButton",
    },
    elements: {
        formButtonPrimary: "bg-primary-500 hover:bg-opacity-90",
        formButtonPrimary__loading: "bg-secondary-500",
        // footerAction__signIn: "",
        footerActionLink: "text-primary-500",
    },
}