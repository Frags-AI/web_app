import config from "../utils/config";
import Stripe from "stripe";

const stripe = new Stripe(config.STRIPE_SECRET);

export default stripe