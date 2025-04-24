import React from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  const routes = [
    {name: "Home", path: "/"},
    {name: "Pricing", path: "/pricing"},
    {name: "Product", path: "/product"},
    {name: "Dashboard", path: "/dashboard"},
    {name: "Profile", path: "/profile"},
    {name: "Blog", path: "/blog"},
  ]

  const handleGoBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    navigate(-1)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-base">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Command className="max-h-[300px]">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Routes">
                {routes.map((route) => (
                  <CommandItem key={route.path} asChild className="cursor-pointer">
                    <RouterLink to={route.path} className="flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      {route.name}
                      <CommandShortcut>{route.path}</CommandShortcut>
                    </RouterLink>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Commands">
                
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="text-center text-sm text-muted-foreground">
            <p>Error code: 404</p>
          </div>          
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <a href="#" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </a>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <RouterLink to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </RouterLink>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Need help? <RouterLink to="/contact" className="font-medium underline underline-offset-4">Contact Support</RouterLink>
        </p>
      </div>
    </div>
  )
}

export default NotFound