import { OpenAI } from 'openai';
import { createReadStream, writeFileSync } from 'fs';

const openAI = new OpenAI();

async function generateFreeImage() {
  const response = await openAI.images.generate({
    prompt: 'A photo of a cat on a mat',
    model: 'dall-e-2',
    n: 1,
  });

  console.log(response);
}

async function generateFreeBase64Image() {
  const response = await openAI.images.generate({
    prompt: 'A photo of a cat on a mat',
    model: 'dall-e-2',
    n: 1,
    response_format: 'b64_json',
  });

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFileSync('cat.png', Buffer.from(rawImage, 'base64'));
  }
}

async function generateAdvanceImage() {
  const response = await openAI.images.generate({
    prompt: 'A photo of a city with skyscrapers',
    model: 'dall-e-3',
    quality: 'hd',
    size: '1024x1024',
    response_format: 'b64_json',
  });

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFileSync('city.png', Buffer.from(rawImage, 'base64'));
  }
}

async function generateImageVariation() {
  const response = await openAI.images.createVariation({
    image: createReadStream('city.png'),
    model: 'dall-e-2',
    response_format: 'b64_json',
    n: 1,
  });

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFileSync('city-variation.png', Buffer.from(rawImage, 'base64'));
  }
}

async function editImage() {
  const response = await openAI.images.edit({
    image: createReadStream('city.png'),
    prompt: 'Add thunderstorm to the city',
    model: 'dall-e-2',
    response_format: 'b64_json',
  });

  const rawImage = response.data![0].b64_json;
  if (rawImage) {
    writeFileSync('city-edited.png', Buffer.from(rawImage, 'base64'));
  }
}

editImage();
