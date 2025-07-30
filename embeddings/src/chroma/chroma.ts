import { ChromaClient } from 'chromadb';

const client = new ChromaClient();
const collectionName = 'data-test';

async function createCollection() {
  await client.deleteCollection({ name: collectionName });
  const response = await client.getOrCreateCollection({
    name: collectionName,
  });

  console.log(response);
}

async function addData() {
  const collection = await client.getCollection({
    name: collectionName,
  });

  await collection.upsert({
    documents: [
      'This is a document about pineapple',
      'This is a document about oranges',
    ],
    ids: ['id1', 'id2'],
  });

  const results = await collection.query({
    queryTexts: ['This is a query document about florida'],
    nResults: 2,
  });

  console.log(results);
}

async function main() {
  await createCollection();
  await addData();
}

main();
