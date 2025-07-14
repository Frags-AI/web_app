import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface VoiceoverResponse {
  message: string;
  file_path: string;
  status: string;
  error?: string;
}

export class VoiceoverService {
  /**
   * Generate a voiceover from text using the AI backend
   * @param text The text to convert to speech
   * @param voice The voice to use
   * @returns Promise with the response data
   */
  static async generateVoiceover(text: string, voice: string = 'Jessica'): Promise<VoiceoverResponse> {
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('voice', voice);

      const response = await axios.post(`${API_URL}/api/model/voiceover/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error generating voiceover:', error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 'error',
          message: 'Failed to generate voiceover',
          file_path: '',
          error: error.response.data.error || error.message,
        };
      }
      return {
        status: 'error',
        message: 'Failed to generate voiceover',
        file_path: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Download a generated voiceover file
   * @param filename The filename of the voiceover to download
   * @returns URL to the file
   */
  static getDownloadUrl(filename: string): string {
    return `${API_URL}/api/model/voiceover/download/${filename}`;
  }
}
