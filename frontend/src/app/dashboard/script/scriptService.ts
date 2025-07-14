import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ScriptResponse {
  message: string;
  script: string;
  title?: string;
  status: string;
  error?: string;
}

export class ScriptService {
  /**
   * Generate a basic script using the AI backend
   * @param prompt The prompt for script generation
   * @returns Promise with the response data
   */
  static async generateScript(prompt: string): Promise<ScriptResponse> {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);

      const response = await axios.post(`${API_URL}/api/model/script/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error generating script:', error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 'error',
          message: 'Failed to generate script',
          script: '',
          error: error.response.data.error || error.message,
        };
      }
      return {
        status: 'error',
        message: 'Failed to generate script',
        script: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Generate a streaming script with title using the AI backend
   * @param prompt The prompt for script generation
   * @returns Promise with the response data
   */
  static async generateStreamScript(prompt: string): Promise<ScriptResponse> {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);

      const response = await axios.post(`${API_URL}/api/model/script/generate-stream`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error generating stream script:', error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 'error',
          message: 'Failed to generate stream script',
          script: '',
          error: error.response.data.error || error.message,
        };
      }
      return {
        status: 'error',
        message: 'Failed to generate stream script',
        script: '',
        error: 'Network error',
      };
    }
  }
}
