import Stripe from "stripe";
import config from "@/utils/config";

const stripe = new Stripe(
    config.STRIPE_SECRET, 
    {
        typescript: true,
        maxNetworkRetries: 3,
        telemetry: false,
    }
)

export default stripe;