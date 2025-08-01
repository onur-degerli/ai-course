import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from '@langchain/community/vectorstores/chroma';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const question = 'What themes does Gone with the Wind explore?';

async function main() {
  const loader = new PDFLoader('books.pdf', {
    splitPages: false,
  });
  const loaderDocs = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    separators: [`. \n`],
  });

  const splittedDocs = await splitter.splitDocuments(loaderDocs);

  const vectorStore = Chroma.fromDocuments(
    splittedDocs,
    new OpenAIEmbeddings(),
    {
      collectionName: 'books',
      url: 'http://localhost:8000/',
    }
  );
  (await vectorStore).addDocuments(splittedDocs);

  const retriever = (await vectorStore).asRetriever({
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
