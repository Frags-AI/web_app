import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface BackgroundResponse {
  message: string;
  image_id: string;
  status: string;
  error?: string;
}

export class BackgroundService {
  /**
   * Generate a background image using the AI backend
   * @param prompt The text prompt for image generation
   * @param style The style of the image (realistic, anime, etc.)
   * @returns Promise with the response data
   */
  static async generateBackground(prompt: string, style: string = 'realistic'): Promise<BackgroundResponse> {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('style', style);

      const response = await axios.post(`${API_URL}/api/model/background/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error generating background image:', error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 'error',
          message: 'Failed to generate background image',
          image_id: '',
          error: error.response.data.error || error.message,
        };
      }
      return {
        status: 'error',
        message: 'Failed to generate background image',
        image_id: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Get the URL for viewing a generated image
   * @param imageId The ID of the generated image
   * @returns URL to view the image
   */
  static getImageUrl(imageId: string): string {
    return `${API_URL}/api/model/background/view/${imageId}`;
  }

  /**
   * Get the download URL for a generated image
   * @param imageId The ID of the generated image
   * @returns URL to download the image
   */
  static getDownloadUrl(imageId: string): string {
    return `${API_URL}/api/model/background/download/${imageId}`;
  }
}
