import { useState } from "react"
import { LayoutDashboard, CheckSquare, User, Menu, X, LogOut } from "lucide-react" // 1. Imported LogOut icon
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Overview & Profile"
  },
  { 
    title: "My Tasks", 
    url: "/tasks", 
    icon: CheckSquare,
    description: "Task Management"
  },
  { 
    title: "Profile", 
    url: "/profile", 
    icon: User,
    description: "Personal Settings"
  },
]

export function PortalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  return (
    <div className={cn(
      // The parent is a flex-col, which allows us to push the footer to the bottom
      "flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EP</span>
            </div>
            <span className="font-semibold text-foreground">Employee Portal</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {/* Changed the collapse icon to a more standard 'Menu' */}
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className={({ isActive: navIsActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                "hover:bg-accent hover:text-accent-foreground",
                navIsActive || isActive(item.url)
                  ? "bg-primary text-primary-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className={cn(
              "transition-all",
              collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
            )} />
            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 2. Removed the old footer and added this new section */}
      {/* The 'mt-auto' class pushes this div to the very bottom */}
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