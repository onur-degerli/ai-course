import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from '@chroma-core/openai';
import OpenAI from 'openai';

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

const openAI = new OpenAI();
const client = new ChromaClient();
const collectionName = 'personal-info';

const embeddingFunction = new OpenAIEmbeddingFunction({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-3-small',
});

async function getOrCreateCollection() {
  return await client.getOrCreateCollection({
    name: collectionName,
    embeddingFunction,
  });
}

async function populateCollection() {
  const collection = await getOrCreateCollection();

  await collection.upsert({
    documents: [studentInfo, clubInfo, universityInfo],
    ids: ['id1', 'id2', 'id3'],
  });
}

async function askQuestion() {
  // const question = 'What does Alexandra Thompson like to do in her free time?';
  const question =
    'What does Alexandra Thompson like to do in her free time besides swimming?';
  // const question = 'How old is Alexandra Thompson?';
  // const question = 'Tell me about the university';
  const collection = await getOrCreateCollection();

  const results = await collection.query({
    queryTexts: [question],
    nResults: 3,
  });

  let relevantAnswer = '';
  for (const document of results.documents[0]) {
    relevantAnswer += document;
  }

  if (relevantAnswer) {
    const response = await openAI.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0,
      messages: [
        {
          role: 'assistant',
          content: `Answer the question using this information ${relevantAnswer}`,
        },
        {
          role: 'user',
          content: question,
        },
      ],
    });

    const responseMessage = response.choices[0].message;
    console.log(responseMessage.content);
  }
}

async function main() {
  await populateCollection();
  await askQuestion();
}

main();
