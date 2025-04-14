import {
    Bot,
    Brain,
    Wrench,
    Frame,
    PieChart,
    Map,
    Files,
    Info,
    type LucideIcon,
    SquareTerminal,
    Network,
    HeartHandshake,
} from "lucide-react";
export interface NavItem {
    navMain?: NavItem[];
    title: string;
    href: string;
    icon: LucideIcon;
    disabled?: boolean;
}




export const sideBarMenuItems = {
    user: {
        name: "Michael",
        email: "mavery@aisemble.com",
        avatar: "/public/robot_orange.png",
    },
    navMain: [

        {
            title: "Your Agents",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Agent 1",
                    url: "/dashboard/agent-1",
                    icon: Bot,
                },
                {
                    title: "Agent 2",
                    url: "/dashboard/agent-2",
                    icon: Bot,
                },
                {
                    title: "Agent 3",
                    url: "/dashboard/agent-3",
                    icon: Bot,
                },
            ],
        },
        {
            title: "Agent Builder",
            url: "#",
            icon: SquareTerminal,
            items: [
                {
                    title: "Agent Builder",
                    url: "/dashboard/create-agent",
                    icon: Bot,
                },
                {
                    title: "Memory",
                    url: "/dashboard/memory",
                    icon: Brain,
                },
                {
                    title: "Tools",
                    url: "/dashboard/tools",
                    icon: Wrench,
                },
            ],
        },
        {
            title: "Agent Teams",
            url: "#",
            icon: Network,
            items: [
                {
                    title: "AIsemble your AI Agent Team",
                    url: "/dashboard/teams",
                    icon: Bot,
                },
                {
                    title: "Memory",
                    url: "/dashboard/memory",
                    icon: Brain,
                },
                {
                    title: "Tools",
                    url: "/dashboard/tools",
                    icon: Wrench,
                },
            ],
        },
        {
            title: "Community",
            url: "#",
            icon: HeartHandshake,
            items: [
                {
                    title: "Docs",
                    url: "/dashboard/docs",
                    icon: Files,
                },
                {
                    title: "Updates",
                    url: "/dashboard/updates",
                    icon: Info,
                }
            ]
        }
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export const AiModelList = [
    {
        name: "Gemini Goggle",
        icon: "/google.png",
    },
    {
        name: "llama By Meta",
        icon: "/meta.png",
    },
    {
        name: "DeepSeek",
        icon: "/deepseek.png",
    },
];