import { OpenAI } from 'openai';

const openAI = new OpenAI();

async function main() {
  const response = await openAI.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'How tall is Everest?',
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();
