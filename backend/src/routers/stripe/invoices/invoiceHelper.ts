import stripe from "@/clients/stripe";
import Stripe from "stripe";

export const getCustomerInvoices = async (customer: Stripe.Customer) => {
  const invoiceData = await stripe.invoices.list({
    customer: customer.id,
    status: "paid"
  })

  const invoices = invoiceData.data.map((invoice) => {
    const date = new Date(invoice.created * 1000).toLocaleDateString("en-US", {month: 'long', day: "numeric", year: "numeric"})
    const amount = invoice.amount_due / 100
    const status = invoice.status!.charAt(0).toUpperCase() + invoice.status!.slice(1).toLowerCase()
    console.log(invoice.receipt_number)

    return {
      date,
      amount,
      number: invoice.number,
      pdf_link: invoice.invoice_pdf,
      status
    }
  })

  return invoices
}