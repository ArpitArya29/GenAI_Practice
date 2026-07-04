import { OpenAI } from "openai"
import  dotenv from "dotenv"

dotenv.config({
    path: "../.env"
});

const ApiKey = process.env.GEMINIAPI_KEY;
// console.log(ApiKey);


const client = new OpenAI({
    apiKey: ApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

async function main() {
    const result = await client.chat.completions.create({
        model: "gemini-2.5-flash-lite",
        messages: [
            { 
                role: 'user', 
                content: `
                What is 2 + 2 equals?
                Examples:
                - What is 5 + 4?
                    Expected Output: 9 (Nine)
                - What is 10 + 10?
                    Expected Output: 20 (Twenty)
                `
            }
        ]
    })

    console.log(`Ans from OpenAI API: ${result.choices[0].message.content}`);
}

main();
