import { PrismaClient } from "../../clients/prisma";

export async function getAllMediaPlatforms(userId: string) {
    const prisma = new PrismaClient()

    const user = await prisma.user.findUnique({ 
        where: {clerk_user_id: userId },
        include: {
            platforms: true
        }

    })

    const data = user?.platforms.map((platform) => {
        const obj = {
            scope: platform,
            provider: platform.provider,
            name: platform.name,
            email: platform.email
        }

        return obj
    })
    return data
}