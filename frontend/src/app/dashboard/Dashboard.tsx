import Sidebar from "./Sidebar"
import Header from "./Header"
import AIChat from "./AIButton"
import Container from "./Container"
import { useState } from "react"
import { Outlet } from "react-router-dom"

/* When using this component, make sure to create a component for each page and add it under the dashboard route in the App.tsx file.
For example, if you have a page called "Home", create a folder called "home" and add an index.tsx file inside it with the component for that page. 
Then, in the App.tsx file, add a route like this:

<Route path="/dashboard" element={<DashboardLayout />}>
   <Route index element={<Home />} /> // Home page
   <Route path="settings" element={<Settings />} /> // Settings page
</Route>

MAKE SURE YOUR IMPORTING THE COMPONENTS CORRECTLY

This will ensure that the sidebar and header are displayed correctly for each page under the dashboard route.

With index.ts file, you can import the component directly from the folder without specifying the file name. 
This is a common practice in React projects to keep the code clean and organized.
*/

export default function DashboardLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className="w-screen flex flex-col relative" style={{ height: "100dvh" }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="fixed top-0 left-0 h-full" sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded}/>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <Container sidebarExpanded={sidebarExpanded}>
              <Outlet />
            </Container> 
          </div>
      </div>
      <AIChat />
    </div>
  )
}