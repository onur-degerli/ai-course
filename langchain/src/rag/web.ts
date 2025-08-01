import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const question = 'What are langchain libraries?';

async function main() {
  const loader = new CheerioWebBaseLoader(
    'https://js.langchain.com/docs/introduction/'
  );
  const loaderDocs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
  });

  const splittedDocs = await splitter.splitDocuments(loaderDocs);

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());
  await vectorStore.addDocuments(splittedDocs);

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
