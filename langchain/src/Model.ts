import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.8,
  maxTokens: 700,
  // verbose: true,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  // const response1 = await model.invoke('Give me 4 books to read');
  // console.log(response1.content);

  // const response2 = await model.batch(['Hello', 'Give me 4 books to read']);
  // console.log(response2);

  const response3 = await model.stream('Give me 4 books to read');
  for await (const chunk of response3) {
    console.log(chunk.content);
  }
}

main();
