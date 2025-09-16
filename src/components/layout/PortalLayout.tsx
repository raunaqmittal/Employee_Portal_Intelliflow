import { PortalSidebar } from './PortalSidebar'

interface PortalLayoutProps {
  children: React.ReactNode
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar */}
      <PortalSidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}