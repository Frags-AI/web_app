const BASE_URL = "http://localhost:3000/api/subscription"

const testService = async (amount: number, token: string): Promise<Response> => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({amount: amount})
  })
  return response
}


const subscriptionService = {
  testService
}

export default subscriptionService