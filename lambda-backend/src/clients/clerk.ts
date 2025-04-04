import { createClerkClient } from "@clerk/backend";
import config from "@/utils/config";

const clerkClient = createClerkClient({
    secretKey: config.CLERK_SECRET,
    publishableKey: config.CLERK_PUBLIC,
});

export default clerkClient;