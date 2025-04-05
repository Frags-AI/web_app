import Stripe from "stripe";
import config from "@/utils/config";

const stripe = new Stripe(config.STRIPE_SECRET)

export default stripe;