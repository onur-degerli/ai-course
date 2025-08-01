import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function fromTemplate() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Write a short decription for the following product {productName}'
  );

  const wholePrompt = await prompt.format({
    productName: 'bicycle',
  });

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    productName: 'bicycle',
  });

  console.log(response);
}

async function fromMessage() {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      'Write a short description for the product provided by the user',
    ],
    ['human', '{productName}'],
  ]);

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    productName: 'bicycle',
  });

  console.log(response.content);
}

// fromTemplate();
fromMessage();
