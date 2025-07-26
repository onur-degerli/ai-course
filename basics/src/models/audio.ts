import { OpenAI } from 'openai';
import { createReadStream, writeFileSync } from 'fs';

const openAI = new OpenAI();

async function createTranscription() {
  const response = await openAI.audio.transcriptions.create({
    file: createReadStream('AudioSample.m4a'),
    model: 'whisper-1',
    language: 'en',
  });

  console.log(response);
}

async function translate() {
  const response = await openAI.audio.translations.create({
    file: createReadStream('FrenchSample.m4a'),
    model: 'whisper-1',
  });

  console.log(response);
}

async function textToSpeech() {
  const sampleText =
    'France is a country from Europe. It is located in Western Europe and is known for its rich history, world-famous cuisine, and stunning architecture.';

  const response = await openAI.audio.speech.create({
    input: sampleText,
    voice: 'alloy',
    model: 'tts-1',
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync('France.mp3', buffer);
}

textToSpeech();
