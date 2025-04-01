

export const getClientSecret = async (lookupKey: string, token: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lookupKey }),
  })

  const data = await response.json()
  return data
}

export const setUserSubscription = async (subscriptionId: string, token: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/subscription`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subscriptionId }),
  })
  const data = await response.json()
  return data
}