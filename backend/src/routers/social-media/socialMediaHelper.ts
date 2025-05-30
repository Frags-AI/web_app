import { prisma } from "@/clients/db";

export async function getAllMediaPlatforms(userId: string) {

    const user = await prisma.user.findUnique({ 
        where: {clerk_user_id: userId },
        include: {
            platforms: true
        }

    })

    const data = user?.platforms.map((platform) => {
        const obj = {
            scope: platform.scope,
            provider: platform.provider,
            name: platform.name,
            email: platform.email,
            details: platform.details,
            id: platform.id
        }

        return obj
    })
    return data
}