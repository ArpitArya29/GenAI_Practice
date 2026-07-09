import { OpenAIEmbeddings } from "@langchain/openai"
import { QdrantVectorStore } from "@langchain/qdrant"

import { OpenAI } from "openai"

import dotenv from "dotenv"

dotenv.config({
    path: "../.env"
})

const OPENROUTER_MODEL = "openai/text-embedding-3-small";
const OPENROUTER_URL = "https://openrouter.ai/api/v1";

const GEMINI_MODEL = "gemini-embedding-001";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;
const GEMINI_API_KEY = process.env.GEMINIAPI_KEY;

const client = new OpenAI({
    apiKey: GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})


async function query(userQuery) {
    // convert user query to vector embeddings
    const embeddings = new OpenAIEmbeddings({
        apiKey: OPENROUTER_API_KEY,
        model: OPENROUTER_MODEL,
        batchSize: 80,
        configuration: {
            baseURL: OPENROUTER_URL
        }
    })

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333',
            collectionName: 'ragDB'
        }
    )

    
    // search the vectors in the qdrant
    // get similar vectors and chunks
    const vectorRetriever = vectorStore.asRetriever({ k: 5});

    const results = await vectorRetriever.invoke(userQuery);

    // feed those chunks to llm model
    const SYSTEM_PROMPT = `
        You are an expert in answering user query based on the provided context about document.
        Do not answer anything beyond what is not provided and always response in short paragraph of not more than 100 words and tell on which page number the content is available

        User Documents:
        ${results.map(e => JSON.stringify({
            pageContent: e.pageContent,
            pageNumber: e.metadata.loc.pageNumber
        })).join('\n\n')}
    `;
    
    const llmResult = await client.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userQuery }
        ],
        stream: true
    });

    console.log(`LLM Response: \n${llmResult.choices[0].message.content}`);
    
}

query("What are Queue in Data Structure?")