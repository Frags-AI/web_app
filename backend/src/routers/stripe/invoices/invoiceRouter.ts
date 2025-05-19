import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { getCustomerInvoices } from "./invoiceHelper";
import { getStripeUser } from "../stripeHelper";

export const invoiceRouter = new Hono()

invoiceRouter.get("/", async (c) => {
    const auth = getAuth(c)

    if (!auth?.userId) return c.json({message: "You are not logged in"}, 401)

    const customer = await getStripeUser(auth.userId)
    const invoices = await getCustomerInvoices(customer)

    return c.json(invoices , 200)
})
