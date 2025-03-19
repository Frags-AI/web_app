const BASE_URL = "http://localhost:3000/api"

export const uploadVideo = async (file: File, token: string) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await fetch(`${BASE_URL}/video`, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json()
    return data
}

export const fetchVideos = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/video`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        },
      }
      );

      const data = await response.json();
      return data
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
};

export const getUserData = async (token: string) => {
    const response = await fetch(`${BASE_URL}/user`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data
}