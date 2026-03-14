import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"

export default function Home() {
  const navigate = useNavigate()
  const user = localStorage.getItem('currentUser')

  useEffect(() => {
    if (!user) {
      navigate('/adminlog')
      return
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="@container/main font-medium">
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-10">
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Dashboard</h1>
          <SectionCards />
          <ChartAreaInteractive />
        </div>
      </SidebarInset>
    </SidebarProvider >
  )
}
