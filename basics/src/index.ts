import { OpenAI } from 'openai';
import { encoding_for_model } from 'tiktoken';

const openAI = new OpenAI();

async function main() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You respond like a cool bro. You respond in JSON format like this:
          coolnessLevel: 1 - 10,
          answer: your answer
        `,
      },
      {
        role: 'user',
        content: 'How tall is Everest?',
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

async function promptLimitedWords() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'Say something cool in 200 words or less',
      },
    ],
    max_completion_tokens: 100,
  });

  console.log(response.choices[0].message.content);
}

async function promptMultipleResponse() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'Say something cool',
      },
    ],
    n: 2,
  });

  console.log('Response 1: ' + response.choices[0].message.content);
  console.log('Response 2: ' + response.choices[1].message.content);
}

async function promptWithSeed() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'Say something cool in 200 words or less',
      },
    ],
    seed: 555,
  });

  console.log(response.choices[0].message.content);
}

function encodePrompt() {
  const prompt = 'How are you today?';
  const encoder = encoding_for_model('gpt-4o');
  const tokenIds = encoder.encode(prompt);
  console.log(tokenIds);
}

promptWithSeed();
