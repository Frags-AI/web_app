import { CheckCircle, Package, ArrowRight, Home, FileText } from 'lucide-react'
import { Link } from "react-router-dom"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Header from '../base/Header'
import Footer from '../base/Footer'

export default function CheckoutSuccessPage() {
  const orderDetails = {
    orderId: "ORD-12345-ABCDE",
    date: "March 18, 2025",
    total: "$129.99",
    items: [
      { name: "Premium Subscription (Annual)", price: "$99.99", quantity: 1 },
      { name: "One-time Setup Fee", price: "$30.00", quantity: 1 },
    ],
    email: "customer@example.com",
    estimatedDelivery: "Immediate Access",
  }

  localStorage.removeItem("lookupKey")

  return (
    <>
        <Header />
        <div className="container max-w-3xl mx-auto px-4 py-12 mt-16">
        <div className="text-center mb-8">
            <CheckCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been confirmed.
            </p>
        </div>

        <Card className="mb-8">
            <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order #{orderDetails.orderId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="font-medium">Date</span>
                <span>{orderDetails.date}</span>
            </div>
            <div className="flex justify-between">
                <span className="font-medium">Email</span>
                <span>{orderDetails.email}</span>
            </div>
            <Separator />
            <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                    <div>
                    <span>{item.name}</span>
                    <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                    </div>
                    <span>{item.price}</span>
                </div>
                ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{orderDetails.total}</span>
            </div>
            </CardContent>
        </Card>

        <Card className="mb-8">
            <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                <p className="font-medium">Order Confirmation</p>
                <p className="text-muted-foreground">
                    A receipt has been sent to {orderDetails.email}
                </p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-primary mt-0.5" />
                <div>
                <p className="font-medium">Access to Your Purchase</p>
                <p className="text-muted-foreground">
                    {orderDetails.estimatedDelivery}. You can access your subscription from your account dashboard.
                </p>
                </div>
            </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-2">
            <Button variant="outline" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                View Order Details
                </Link>
            </Button>
            <Button asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
            </CardFooter>
        </Card>

        <div className="text-center">
            <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return to Homepage
            </Link>
            </Button>
        </div>
        </div>
        <Footer />
    </>
  )
}