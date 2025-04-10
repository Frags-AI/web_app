export const uploadVideo = async (file: File, token: string) => {
    console.log("Uploading video: ", file);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/video`, {
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json();

    return data;
}