import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DashboardNav } from "./dashboardnav";

export default function Sidebar() {
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "admin@gmail.com",
    user_metadata: {
      user_role: "admin",
    },
  };
  return (
    <nav
      className={cn(`relative hidden h-screen border-r pt-16 lg:block w-72`)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
              Overview
            </h2> */}
            <DashboardNav items={navItems} user={userData} />
          </div>
        </div>
      </div>
    </nav>
  );
}
