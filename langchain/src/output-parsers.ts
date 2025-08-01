import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from '@langchain/core/output_parsers';
import { StructuredOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

async function stringParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Write a short decription for the following product {productName}'
  );

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  const response = await chain.invoke({
    productName: 'bicycle',
  });

  console.log(response);
}

async function commaSeparatedParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    'Provide the first 5 ingredients, separated by comma for {word}'
  );

  const parser = new CommaSeparatedListOutputParser();
  const chain = prompt.pipe(model).pipe(parser);
  const response = await chain.invoke({
    word: 'bread',
  });

  console.log(response);
}

async function structuredParser() {
  const templatePrompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
    Formatting instructions: {format_instructions}
    Phrase: {phrase}
  `);

  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: 'the name of the person',
    likes: 'what the person likes',
  });

  const chain = templatePrompt.pipe(model).pipe(outputParser);
  const response = await chain.invoke({
    phrase: 'John likes pineapple pizza',
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log(response);
}

// stringParser();
// commaSeparatedParser();
structuredParser();
