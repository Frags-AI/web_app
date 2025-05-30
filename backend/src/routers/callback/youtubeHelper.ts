import { OAuth2Client } from "@/clients/google-clients";
import { PrismaClient } from "../../clients/prisma";
import * as fs from "fs"
import { Credentials } from "google-auth-library";
import { google } from "googleapis";


export async function storeYoutubeToken(userId: string, token: Credentials) {
    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({ where: { clerk_user_id: userId }})

    if (!user || !token) return null

    OAuth2Client.setCredentials(token)

    const userInfo = (await google.oauth2({auth: OAuth2Client, version: "v2"}).userinfo.get()).data
    const youtubeData = (await google.youtube({ auth: OAuth2Client, version: "v3"}).channels.list({part: ["snippet"], mine: true})).data
    const channel = youtubeData.items?.[0]!

    if (!channel) throw new Error("Could not locate channel")

    const email = userInfo.email || ""
    
    const channelName = channel.snippet?.title!
    const channelId = channel.id!

    const response = await prisma.platform.findUnique({
        where: {
            user_id_provider_scope_external_id: {
                user_id: user.id,
                provider: "Google",
                scope: "YouTube",
                external_id: channelId
            }
        }
    })

    if (response) return

    const platform = await prisma.platform.create({
        data: {
            user_id: user.id,
            provider: "Google",
            scope: "YouTube",
            details: "Channel",
            name: channelName,
            email,
            external_id: channelId
        }
    })

    const data = await prisma.oAuthToken.create({
        data: {
            platform_id: platform.id,
            access_token: token.access_token as string,
            refresh_token: token.refresh_token as string,
            expiry_date: new Date(token.expiry_date as number),
            token_type: token.token_type
        }
    })

    return data
}