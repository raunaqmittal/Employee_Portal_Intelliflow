import { useState } from "react"
import { LayoutDashboard, Users, FolderOpen, BarChart3, Settings, Menu, X, LogOut } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/manager",
    icon: LayoutDashboard,
  },
  {
    title: "Team Management",
    href: "/manager/team",
    icon: Users,
  },
  {
    title: "Projects",
    href: "/manager/projects",
    icon: FolderOpen,
  },
  {
    title: "Analytics",
    href: "/manager/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/manager/settings",
    icon: Settings,
  },
]

export function ManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manager Portal</h2>
              <p className="text-xs text-muted-foreground">Product Design & Prototyping</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )
            }
          >
            <item.icon className={cn(
              "flex-shrink-0 transition-all",
              collapsed ? "h-5 w-5" : "h-5 w-5"
            )} />
            {!collapsed && (
              <span className="truncate">{item.title}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-border mt-auto">
        <Button variant="ghost" className="w-full justify-start text-left p-3">
          <LogOut className={cn(
            "transition-all",
            collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
          )} />
          {!collapsed && (
            <span className="text-sm font-medium">Sign Out</span>
          )}
        </Button>
      </div>
    </div>
  )
}