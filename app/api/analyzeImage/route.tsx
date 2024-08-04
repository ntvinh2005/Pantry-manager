import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const endpoint = process.env.AZURE_VISION_ENDPOINT;
const subscriptionKey = process.env.AZURE_VISION_KEY;

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

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

    const description = response.data.description.captions[0].text; 

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}

