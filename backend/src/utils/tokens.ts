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

    if (expirationTime && expirationTime - currentTime < 300000) { // 5 minutes or less from expiring
        OAuth2Client.setCredentials({ refresh_token })
        const token = (await OAuth2Client.getAccessToken()).token

        if (!token) throw new Error("Failed to refresh access token")

        const tokenInfo = await OAuth2Client.getTokenInfo(token)

        await prisma.oAuthToken.update({
            where: {platform_id: platformId},
            data: {
                access_token: token,
                expiry_date: new Date(tokenInfo.expiry_date)
            }
        })

        return token
    } else return access_token
}