import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { Document } from '@langchain/core/documents';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const data = [
  'My name is John',
  'My name is Bob',
  'My favorite food is pizza',
  'My favorite food is pasta',
];

const question = 'What are my favorite foods?';

async function main() {
  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  await vectorStore.addDocuments(
    data.map(
      (content) =>
        new Document({
          pageContent: content,
        })
    )
  );

  const retriever = vectorStore.asRetriever({
    k: 2,
  });

  const retrieverResponse = await retriever.invoke(question);
  const docs = retrieverResponse.map((result) => result.pageContent);

  const template = ChatPromptTemplate.fromMessages([
    [
      'system',
      'Answer the users question based on the following context: {context}',
    ],
    ['user', '{input}'],
  ]);

  const chain = template.pipe(model);
  const response = await chain.invoke({
    input: question,
    context: docs,
  });

  console.log(response.content);
}

main();
