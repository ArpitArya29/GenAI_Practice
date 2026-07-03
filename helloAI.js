import { OpenAI } from "openai"
import dotenv from "dotenv"

dotenv.config();

const ApiKey = process.env.OPENAI_KEY || process.env.GEMINIAPI_KEY;
// console.log(ApiKey);

// const client = new OpenAI({
//     apiKey: ApiKey
// })

// Here we are using the API key of Gemini, but they do not follow the standard of OpenAI
// For this, an compatibility of GeminiAI is created for OpenAI
const client = new OpenAI({
    apiKey: ApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

// now, by adding the baseURL of googleAPI/../openai, we can use the API key of gemini for OpenAI
client.chat.completions
    .create({
        model: 'gemini-3.5-flash',
        messages:[
            { role: 'user', content: 'Hello, How are you?' }
        ]
    })
    .then((response) => {
        console.log(response.choices[0].message.content);
    })