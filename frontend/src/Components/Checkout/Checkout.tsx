import React, { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getClientSecret } from "./checkoutHelper";
import { useAuth } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../Accessories/LoadingScreen";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions, StripePaymentElementOptions } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import Icons from "../icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY! as string)



export default function Checkout () {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const { getToken } = useAuth()
    const location = useLocation()

    const { mutate: createSubscription, isPending, error } = useMutation({
        mutationFn: async () => {
          const token = await getToken()
          const lookupKey = location.state.lookupKey
          return getClientSecret(lookupKey, token)
        },
        onSuccess: (data) => {
          setClientSecret(data.clientSecret)
        },
        onError: (error) => {
          console.log(error)
        }
    })

    useEffect(() => {
        createSubscription()
    }, [])

    if (isPending) {
        return <LoadingScreen />
    }

    const elementOptions: StripeElementsOptions  = {
        clientSecret,
        appearance: {
            theme: "night",
        }
    }

    const paymentOptions: StripePaymentElementOptions = {
        layout: "tabs",

    }

    return (
        
        <div className="flex w-full h-screen justify-center items-center p-4 flex-col justify-between">
            <div className="font-bold flex items-center gap-4">
                <Icons.Lock className="w-20 h-20 font-bold"/>
                <h1 className="text-4xl font-bold">Secure Checkout</h1>
            </div>
            <div className="bg-stone-600 py-10 px-5 rounded-lg flex items-center gap-4 w-full">
                <div className="bg-[#30313C] p-4 rounded-lg w-1/2 h-full flex-1 flex flex-col gap-4 justify-between">
                    <div className="flex flex-col gap-4 border-b-2 border-[#828282] pb-4">
                        <h1 className="text-3xl font-bold">Checkout</h1>
                        <p className="text-md">Complete your purchase</p>
                    </div>
                    <div className="flex flex-col gap-4 border-b-2 border-[#828282] pb-4">
                        <h1 className="text-3xl font-bold">Subscription Model</h1>
                        <p className="text-md">Subscription name</p>
                        <p className="text-md">Subscription description</p>
                    </div>
                    <div className="flex flex-col gap-4 border-b-2 border-[#828282] pb-4">
                        <h1 className="text-3xl font-bold">Total Price</h1>
                        <p className="text-md border-b border-[#828282] w-1/2">Subtotal: $25.00</p>
                        <p className="text-md border-b border-[#828282] w-1/2">Tax: $2.50</p>
                        <p className="text-md">Total: $27.50</p>
                    </div>
                </div>
                <Elements stripe={stripePromise} options={elementOptions}>
                    <form className="w-1/2 h-">
                        <PaymentElement options={paymentOptions} />
                        <Button type="submit" className="mt-4 w-full">Pay</Button>
                    </form>
                </Elements>
            </div>
            <div className="font-bold flex items-center gap-4">
                <FontAwesomeIcon icon={["fab", "stripe"]} className="w-20 h-20 font-bold"/>
                <h1 className="text-4xl font-bold">Powered by Stripe</h1>
            </div>
        </div>  
    )
}