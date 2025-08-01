import { InferenceClient } from '@huggingface/inference';
import { writeFile } from 'fs';

const inferenceClient = new InferenceClient(
  process.env.HUGGINGFACE_ACCESS_TOKEN
);

async function embed() {
  const output = await inferenceClient.featureExtraction({
    model: 'BAAI/bge-small-en-v1.5',
    inputs: 'My Cool Embeddings',
  });

  console.log(output);
}

async function translation() {
  const response = await inferenceClient.translation({
    model: 't5-base',
    inputs: 'How is the weather in Paris?',
  });

  console.log(response);
}

async function translation2() {
  const response = await inferenceClient.translation({
    model: 'facebook/nllb-200-distilled-600M',
    inputs: 'How is the weather in Paris?',
    parameters: {
      src_lang: 'en',
      tgt_lang: 'fr',
    },
  });

  console.log(response);
}

async function answerQuestion() {
  const response = await inferenceClient.questionAnswering({
    model: 'deepset/roberta-base-squad2',
    inputs: {
      context: 'The quick brown fox jumps over the lazy dog',
      // question: 'What color is the dog?',
      // question: 'Is the dog lazy?',
      question: 'What is the meaning of life?',
    },
  });

  console.log(response);
}

async function textToImage() {
  const response = await inferenceClient.textToImage({
    model: 'stabilityai/stable-diffusion-2',
    inputs: 'Cat in the hat on a mat',
    parameters: {
      negative_prompt: 'blurry',
    },
  });

  const buffer = Buffer.from(response, 'base64');
  writeFile('image.png', buffer, (err) => {
    if (err) console.error(err);
    else console.log('image saved');
  });
}

// embed();
// translation();
// translation2();
// answerQuestion();
textToImage();
