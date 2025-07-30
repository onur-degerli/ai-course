import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECODE_API_KEY!,
});

type CoolType = {
  coolness: number;
  reference: string;
};

async function createNamespace() {
  const index = getIndex();
  const namespace = index.namespace('cool-namespace');
}

function getIndex() {
  const index = pinecone.index<CoolType>('cool-index');
  return index;
}

async function createIndex() {
  await pinecone.createIndex({
    name: 'cool-index',
    dimension: 1536,
    metric: 'cosine',
    spec: {
      serverless: {
        cloud: 'aws',
        region: 'us-east-1',
      },
    },
  });
}

async function listIndexes() {
  const response = await pinecone.listIndexes();
  console.log(response);
}

function embeddingFunction() {}

async function upsertVectors() {
  const embedding = generateNumberArray(1536);
  const index = getIndex();

  const upsertResponse = await index.upsert([
    {
      id: 'id-1',
      values: embedding,
      metadata: {
        coolness: 3,
        reference: 'abcd',
      },
    },
  ]);
}

function generateNumberArray(length: number) {
  return Array.from({ length }, () => Math.random());
}

async function queryVectors() {
  const index = getIndex();
  const response = await index.query({
    id: 'id-1',
    topK: 1,
    includeMetadata: true,
  });

  console.log(response);
}

async function main() {
  // await listIndexes();
  // await upsertVectors();
  await queryVectors();
}

main();
