import stripe from "@/clients/stripe";
import Stripe from "stripe";
import currencyMap from "@/lib/currencyMap";

export const createSubscription = async (customer: {id?: string}, lookupKey: string) => {

    if (!customer.id) {
        throw new Error('Customer ID is required to create a subscription')
    }

    const price = (await stripe.prices.search({query: `lookup_key:'${lookupKey}'`})).data[0]

    if (!price) {
        throw new Error('Price not found')
    }

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
            price: price.id
        }],
        payment_behavior: "default_incomplete",
        expand: ['latest_invoice.confirmation_secret'],
        payment_settings: {
            save_default_payment_method: "on_subscription",

        }
    })

    if (!subscription.latest_invoice) {
        throw new Error('Subscription creation failed')
    }

    const invoice = subscription.latest_invoice as Stripe.Invoice & { confirmation_secret: Stripe.Invoice.ConfirmationSecret }
    const clientSecret = invoice.confirmation_secret.client_secret as string

    return {
        subscriptionId: subscription.id, 
        clientSecret
    }

}

export const getSubscription = async (customer: Stripe.Customer) => {
    if (!customer.id) {
        throw new Error('Customer ID is required to get a subscription')
    }

    const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "active",
        limit: 1,
        expand: ["data.default_payment_method"],
    })

    if (subscriptions.data.length === 0) {
        let freeTier 
    }
    const subscription = subscriptions.data[0]
    const paymentMethod = subscription.default_payment_method as Stripe.PaymentMethod

    let default_payment
    let object;

    if (paymentMethod.card) {
        object = {
            brand: paymentMethod.card.brand.charAt(0).toUpperCase() + paymentMethod.card.brand.slice(1),
            last4: paymentMethod.card.last4,
            card_type: paymentMethod.card.funding.charAt(0).toUpperCase() + paymentMethod.card.funding.slice(1),
            exp_date: paymentMethod.card.exp_month.toString().padStart(2,'0') + "/" + paymentMethod.card.exp_year.toString().slice(-2),
        }
    } else if (paymentMethod.us_bank_account) {
        object = {
            bank_name: paymentMethod.us_bank_account.bank_name,
            account_type: paymentMethod.us_bank_account.account_type,
            account_holder_type: paymentMethod.us_bank_account.account_holder_type,
            routing_number: paymentMethod.us_bank_account.routing_number,
            last4: paymentMethod.us_bank_account.last4,
        }
    } else return null

    default_payment = {
        type: paymentMethod.type,
        formatted_type: paymentMethod.type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        billing: paymentMethod.billing_details,
        ...object
    }
    

    const lookupKey = (subscription.items.data[0].price.lookup_key as string).split("_")
    const type = lookupKey[0].charAt(0).toUpperCase() + lookupKey[0].slice(1).toLowerCase()
    const planRate = " / " + (lookupKey[1] === "monthly" ? "month" : "year")
    const endDate = new Date(subscription.items.data[0].current_period_end * 1000).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    })

    const rawPrice = subscription.items.data[0].price.unit_amount as number
    const price = rawPrice / 100
    const rate = currencyMap(subscription.items.data[0].price.currency as string) + price.toString() + planRate


    const subscriptionData = {
        type,
        rate,
        status: subscription.status,
        endDate,
        default_payment
    }

    return subscriptionData
}