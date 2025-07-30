import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from '@chroma-core/openai';

const client = new ChromaClient();
const collectionName = 'data-test-2';

const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
});

async function createCollection() {
  const response = await client.getOrCreateCollection({
    name: collectionName,
  });

  console.log(response);
}

async function addData() {
  const collection = await client.getCollection({
    name: collectionName,
    embeddingFunction: embeddingFunction,
  });

  await collection.upsert({
    documents: ['Here is my entry'],
    ids: ['id1'],
  });

  const results = await collection.query({
    queryTexts: ['Here'],
    nResults: 2,
  });

  console.log(results);
}

async function main() {
  await createCollection();
  await addData();
}

main();
