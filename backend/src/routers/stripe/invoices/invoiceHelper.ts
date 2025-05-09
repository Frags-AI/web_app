import stripe from "@/clients/stripe";
import Stripe from "stripe";

export const getCustomerInvoices = async (customer: Stripe.Customer) => {
  const invoiceData = await stripe.invoices.list({
    customer: customer.id
  })

  const invoices = invoiceData.data.map((invoice) => {
    const date = new Date(invoice.created * 1000).toLocaleDateString("en-US", {month: 'long', day: "numeric", year: "numeric"})

    return {
      date: date,
      amount: invoice.amount_due,
      id: invoice.id,
      pdf_link: invoice.invoice_pdf,
      status: invoice.status
    }
  })

  return invoices
}