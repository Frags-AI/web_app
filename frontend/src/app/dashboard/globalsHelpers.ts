export const getSubscriptionData = async (token: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/subscription`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json()
    return data
}