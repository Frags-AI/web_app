import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface TranscriptionResponse {
  message: string;
  transcription_id: string;
  status: string;
  error?: string;
}

export class TranscriptionService {
  /**
   * Transcribe a video file using the AI backend
   * @param file The video file to transcribe
   * @param silenceThresh The silence threshold in dB
   * @param minSilenceLen The minimum silence length in ms
   * @returns Promise with the response data
   */
  static async transcribeVideo(
    file: File, 
    silenceThresh: number = -50, 
    minSilenceLen: number = 500
  ): Promise<TranscriptionResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('silence_thresh', silenceThresh.toString());
      formData.append('min_silence_len', minSilenceLen.toString());

      const response = await axios.post(`${API_URL}/api/model/transcription/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error transcribing video:', error);
      if (axios.isAxiosError(error) && error.response) {
        return {
          status: 'error',
          message: 'Failed to transcribe video',
          transcription_id: '',
          error: error.response.data.error || error.message,
        };
      }
      return {
        status: 'error',
        message: 'Failed to transcribe video',
        transcription_id: '',
        error: 'Network error',
      };
    }
  }

  /**
   * Get the transcription text from a transcription ID
   * @param transcriptionId The ID of the transcription
   * @returns Promise with the transcription text
   */
  static async getTranscription(transcriptionId: string): Promise<string> {
    try {
      const response = await axios.get(`${API_URL}/api/model/transcription/download/${transcriptionId}`, {
        responseType: 'text',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting transcription:', error);
      return 'Error retrieving transcription. Please try downloading the file instead.';
    }
  }

  /**
   * Get the download URL for a transcription
   * @param transcriptionId The ID of the transcription
   * @returns The download URL
   */
  static getDownloadUrl(transcriptionId: string): string {
    return `${API_URL}/api/model/transcription/download/${transcriptionId}`;
  }
}
