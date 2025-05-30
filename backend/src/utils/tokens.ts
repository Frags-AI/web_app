import { PrismaClient } from "@/clients/prisma";
import { OAuth2Client } from "@/clients/google-clients";

export async function getOrRefreshGoogleAccessToken(platformId: string) {
    const prisma = new PrismaClient()

    const platform = await prisma.platform.findUniqueOrThrow({ 
        where: { id: platformId }, 
        include: { token: true }
    })

    if (!platform.token) throw new Error("Unable to locate platform")

    const {refresh_token, access_token, expiry_date} = platform?.token
    const currentTime = Date.now()
    const expirationTime = expiry_date?.getTime()

    if (!expirationTime || expirationTime - currentTime < 300000) { // 5 minutes or less from expiring

        OAuth2Client.setCredentials({ refresh_token })
        const { credentials } = await OAuth2Client.refreshAccessToken();

        const newToken = credentials.access_token

        if (!newToken) throw new Error("Failed to refresh access token")

        const tokenInfo = await OAuth2Client.getTokenInfo(newToken)

        await prisma.oAuthToken.update({
            where: {platform_id: platformId},
            data: {
                access_token: newToken,
                expiry_date: credentials.expiry_date ? new Date(credentials.expiry_date) : null
            }
        })

        return newToken
    } else return access_token
}