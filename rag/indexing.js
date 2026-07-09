import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { OpenAIEmbeddings } from "@langchain/openai"
import { QdrantVectorStore } from "@langchain/qdrant"
import dotenv from "dotenv"

dotenv.config({
    path: "../.env"
})

const OPENROUTER_MODEL = "openai/text-embedding-3-small";
const OPENROUTER_URL = "https://openrouter.ai/api/v1";

const GEMINI_MODEL = "gemini-embedding-001";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

const API_KEY = process.env.OPENROUTER_KEY;

async function generateVectorEmbeddingsForFile(filePath) {
    const loader = new PDFLoader(filePath);
    const document = await loader.load(); // Already chunks data page-by-page

    console.log(document.length);
    

    const embeddings = new OpenAIEmbeddings({
        apiKey: API_KEY,
        model: OPENROUTER_MODEL,
        batchSize: 80,
        configuration: {
            baseURL: OPENROUTER_URL
        }
    })

    console.log(embeddings.batchSize);
    

    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: 'http://localhost:6333',
            collectionName: 'ragDB'
        }
    )

    await vectorStore.addDocuments(document)

    console.log("Documents Indexed...");
}

generateVectorEmbeddingsForFile("./data_structure.pdf")