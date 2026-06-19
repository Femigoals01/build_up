


import { ReactNode } from "react";
import UnreadBadge from "@/components/chat/UnreadBadge";
import SidebarItem from "@/components/sidebar/SidebarItem";

type UserRole =
  | "VOLUNTEER"
  | "ORGANIZATION"
  | "MENTOR"
  | "ADMIN"
  | string;

type NavItem = {
  icon: ReactNode;
  label: ReactNode;
  href: string;
  active?: boolean;
  trailing?: ReactNode;
};

export default function SidebarContent({
  collapsed = false,
  user,
}: {
  collapsed?: boolean;
  user: { name?: string | null; role?: string | null };
}) {
  const role = (user.role || "VOLUNTEER") as UserRole;
  const navItems = getNavItems(role);

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          collapsed={collapsed}
          active={item.active}
          trailing={item.trailing}
        />
      ))}
    </nav>
  );
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "MENTOR":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/mentor",
          active: true,
        },
        {
          icon: "🧑‍🏫",
          label: "Mentorship Requests",
          href: "/dashboard/mentor/requests",
        },
        {
          icon: "📅",
          label: "Bookings",
          href: "/dashboard/mentor/bookings",
        },
    {
  icon: "🏆",
  label: "Leaderboard",
  href: "/leaderboard?type=mentors",
},
        {
          icon: "🕒",
          label: "Availability",
          href: "/dashboard/mentor/availability",
        },
        {
          icon: "💼",
          label: "Assigned Projects",
          href: "/projects",
        },
        {
          icon: "🎁",
          label: "Referrals",
          href: "/dashboard/referrals",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/messages",
        },

        {
  icon: "💬",
  label: "Community Chat",
  href: "/dashboard/community/chat",
},

        {
  icon: "🌐",
  label: "Community",
  href: "/dashboard/community",
},
        {
          icon: "🔔",
          label: "Notifications",
          href: "/dashboard/notifications",
        },
        {
  icon: "📈",
  label: "Analytics",
  href: "/dashboard/mentor/analytics",
},

{
  icon: "🎓",
  label: "Certification",
  href: "/dashboard/mentor/certification",
},
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];

    case "ORGANIZATION":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/organization",
          active: true,
        },
        {
          icon: "📁",
          label: "My Projects",
          href: "/projects",
        },
        {
          icon: "🎁",
          label: "Referrals",
          href: "/dashboard/referrals",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/organization/inbox",
          trailing: <UnreadBadge />,
        },
        {
          icon: "📩",
          label: "Invite History",
          href: "/dashboard/organization/invites",
        },
        {
          icon: "➕",
          label: "Post a Project",
          href: "/projects/new",
        },

        {
  icon: "📢",
  label: "Opportunities",
  href: "/dashboard/organization/opportunities",
},

{
  icon: "📈",
  label: "Analytics",
  href: "/dashboard/organization/analytics",
},

{
  icon: "✅",
  label: "Verification",
  href: "/dashboard/organization/verification",
},

{
  icon: "💬",
  label: "Community Chat",
  href: "/dashboard/community/chat",
},

{
  icon: "🌐",
  label: "Community",
  href: "/dashboard/community",
},
        {
          icon: "🔔",
          label: "Notifications",
          href: "/dashboard/notifications",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];

    case "ADMIN":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/admin",
          active: true,
        },
        {
          icon: "👥",
          label: "Users",
          href: "/dashboard/admin/users",
        },
        {
          icon: "✅",
          label: "Approvals",
          href: "/dashboard/admin/approvals",
        },
        {
          icon: "💼",
          label: "Projects",
          href: "/projects",
        },
        {
  icon: "📢",
  label: "Sponsorships",
  href: "/dashboard/admin/sponsorships",
},

{
  icon: "📢",
  label: "Opportunities",
  href: "/dashboard/admin/opportunities",
},

{
  icon: "🌍",
  label: "Community",
  href: "/dashboard/admin/community",
},
        {
          icon: "💸",
          label: "Withdrawals",
          href: "/dashboard/admin/withdrawals",
        },
        {
          icon: "🎁",
          label: "Referrals",
          href: "/dashboard/referrals",
        },

        {
  icon: "🏢",
  label: "Org Verifications",
  href: "/dashboard/admin/organization-verifications",
},

        {
  icon: "🎓",
  label: "Certifications",
  href: "/dashboard/admin/certifications",
},

{
  icon: "💬",
  label: "Community Chat",
  href: "/dashboard/community/chat",
},

{
  icon: "🌐",
  label: "Community",
  href: "/dashboard/community",
},
        {
          icon: "🔔",
          label: "Notifications",
          href: "/dashboard/notifications",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];

    case "VOLUNTEER":
    default:
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/volunteer",
          active: true,
        },
        {
          icon: "💼",
          label: "Projects",
          href: "/projects",
        },
        {
          icon: "🧑‍🏫",
          label: "Mentors",
          href: "/dashboard/volunteer/mentors",
        },

   {
  icon: "🏆",
  label: "Leaderboard",
  href: "/leaderboard",
},

{
  icon: "🤖",
  label: "AI Mentor Match",
  href: "/dashboard/volunteer/mentor-match",
},
        {
          icon: "📅",
          label: "My Bookings",
          href: "/dashboard/volunteer/bookings",
        },
        {
          icon: "🌍",
          label: "Portfolio",
          href: "/portfolio",
        },
        {
          icon: "💰",
          label: "Wallet",
          href: "/dashboard/wallet",
        },
        {
          icon: "🎁",
          label: "Referrals",
          href: "/dashboard/referrals",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/messages",
        },

        {
  icon: "💬",
  label: "Community Chat",
  href: "/dashboard/community/chat",
},

        {
  icon: "🌐",
  label: "Community",
  href: "/dashboard/community",
},
        {
          icon: "🔔",
          label: "Notifications",
          href: "/dashboard/notifications",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];
  }
}