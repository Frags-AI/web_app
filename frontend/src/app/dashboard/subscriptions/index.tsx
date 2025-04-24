import React, { useState } from "react"
import { CreditCard, Calendar, CheckCircle, AlertCircle, Clock, Download, ChevronRight, Shield } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import { getSubscriptionData } from "./subscriptionHelper"
import LoadingScreen from "@/app/accessories/LoadingScreen"
import { SubscriptionDataProps } from "@/types"
import { planFeatures } from "./planFeatures"


// Mock billing history
const billingHistory = [
  { id: "INV-001", date: "March 15, 2025", amount: "$29.99", status: "Paid" },
  { id: "INV-002", date: "February 15, 2025", amount: "$29.99", status: "Paid" },
  { id: "INV-003", date: "January 15, 2025", amount: "$29.99", status: "Paid" },
  { id: "INV-004", date: "December 15, 2024", amount: "$29.99", status: "Paid" },
]

// Available plans
const availablePlans = [
  { 
    id: "clipper", 
    name: "Clipper", 
    price: "$9.99", 
    cycle: "/ month",
    features: planFeatures.Clipper,
  },
  { 
    id: "creator", 
    name: "Creator", 
    price: "$29.99", 
    cycle: "/ month",
    features: planFeatures.Creator,
    current: true
  },
  { 
    id: "business", 
    name: "Business", 
    price: "$99.99", 
    cycle: "/ month",
    features: planFeatures.Business,
  }
]

const Subscription: React.FC = () => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const { getToken } = useAuth()

  const { data: subscriptionData, isLoading, error } = useQuery<SubscriptionDataProps>({
    queryKey: ["subscriptionData"],
    queryFn: async () => {
      const token = await getToken()
      return getSubscriptionData(token)
    }
  })

  if (isLoading) return <LoadingScreen />

  if (error) return <div>Error loading subscription data</div>

  return (
    <div className="container mx-auto max-w-4xl p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Subscription</h1>
      
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
        </TabsList>
        
        {/* Current Plan Tab */}
        <TabsContent value="current" className="space-y-6">
          {/* Subscription Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {subscriptionData.type} Plan
                  </CardTitle>
                  <CardDescription>
                    Your current subscription details
                  </CardDescription>
                </div>
                <Badge variant={subscriptionData.status === "active" ? "default" : "destructive"}>
                  {subscriptionData.status === "active" ? (
                    <>
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {subscriptionData.status}
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subscription Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Billing Amount</p>
                  <p className="font-semibold text-xl">{subscriptionData.rate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <p>{subscriptionData.endDate}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Payment Method */}
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <div className="flex items-center p-3 border rounded-md">
                  <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {subscriptionData.default_payment.card_type} ending in {subscriptionData.default_payment.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {subscriptionData.default_payment.exp_date}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Update
                  </Button>
                </div>
              </div>
              
              {/* Features */}
              <div>
                <h3 className="font-medium mb-2">Included Features</h3>
                <ul className="grid gap-2 md:grid-cols-2">
                  {planFeatures[subscriptionData.type].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel Subscription</Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Are you sure you want to cancel your subscription? You'll lose access to all Pro features at the end of your current billing period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="rounded-md bg-muted text-black p-4">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 " />
                        <p className="text-sm">
                          Your subscription will remain active until <span className="font-medium">{subscriptionData.endDate}</span>
                        </p>
                      </div>
                    </div>
                    <RadioGroup defaultValue="too-expensive">
                      <div className="space-y-2">
                        <Label className="font-medium">Reason for cancellation</Label>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="too-expensive" id="too-expensive" />
                          <Label htmlFor="too-expensive">Too expensive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="not-using" id="not-using" />
                          <Label htmlFor="not-using">Not using it enough</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="missing-features" id="missing-features" />
                          <Label htmlFor="missing-features">Missing features I need</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other reason</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setCancelDialogOpen(false)}>
                      Keep Subscription
                    </Button>
                    <Button variant="destructive">
                      Confirm Cancellation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button>Manage Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Billing History Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge variant="outline" className="ml-2">
                        {invoice.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Available Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col ${plan.current ? "border-primary" : ""}`}>
                {plan.current && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium rounded-t-md">
                    Current Plan
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.cycle}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-1 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    className="w-full" 
                    variant={plan.current ? "outline" : "default"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : `Switch to ${plan.name}`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="bg-muted/50">
            <CardHeader>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <CardTitle className="text-base">Need a custom plan?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Contact our sales team for a custom plan tailored to your specific needs.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Sales
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Subscription