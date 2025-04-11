import stripe from "@/clients/stripe";
import Stripe from "stripe";

export const getAllPaymentMethods = async (customer: Stripe.Customer) => {
    const payments = await stripe.paymentMethods.list({
        customer: customer.id,
    }).then((res) =>  res.data)
    

    const paymentMethods = payments.map((paymentMethod) => {
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
        }
        if (!object) {
            return null
        } else return {
            type: paymentMethod.type,
            formatted_type: paymentMethod.type.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            billing: paymentMethod.billing_details,
            ...object
        }
    })

    return paymentMethods.filter((paymentMethod) => paymentMethod !== null)
}