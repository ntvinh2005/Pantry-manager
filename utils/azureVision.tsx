import axios from 'axios';

const endpoint = process.env.AZURE_VISION_ENDPOINT;
const subscriptionKey = process.env.AZURE_VISION_KEY;

export const analyzeImage = async (imageUrl: string) => {
  try {
    const response = await axios.post(
      `${endpoint}/vision/v3.2/describe`,
      { url: imageUrl },
      {
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};
