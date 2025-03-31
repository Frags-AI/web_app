import React from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const NotFound: React.FC = () => {
  const navigate = useNavigate()

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
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for content..."
              className="pl-8"
            />
          </div>
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