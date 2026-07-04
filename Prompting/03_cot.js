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

const SYSTEM_PROMOT = `
    You are an expert AI engineer. You have to analyze the user's input carefully and you need to break down the problem into multiple subproblems before coming on to the final result. Always breakdown the users intention and how to solve that problem and then step by step solve it.

    We are goint to follow the pipeline of "INITIAL", "THINK", "ANALYSE" and "OUTPUT" pipeline.

    The popelines:
    - "INITIAL" when user gives an input, we will have an initial touught process on what this user is trying to do
    - "THINK" this is where we are going to thing about how to solve this and then start to breakdown the problem
    - "ANALYSE" this is where we analyse the solution and also verify if the output is correct
    - "THINK" we can go to think mode where we now see if any sub-problem remains and think
    - "ANALYSE" again analyse the problem and get into the solution
    - "OUTPUT" this is where we can end and give the final output to the user

    Rules:
    - Always output one step at a time and wait for other step before proceeding
    - Always maintain the sequence of pipeline as given in the example
    - Always follow JSON output format strictly
    - Return only a valid JSON object. Do not wrap it in Markdown code fences. Do not include any explanation before or after the JSON.

    Examples:
    - "USER": What is 2 + 2 - 5 * 10 / 3?
    OUTPUT:
    - "INITIAL": "The user wants me to solve a maths equation"
    - "THINK": "I will use the BODMAS formula and based on that i should first multiply 5 * 10 which is 50"
    - "ANALYSE": "Yes, the bodmas is actually right and now equation is 2 + 2 - 50 / 3"
    - "THINK": "Now, as per rule I should perform divide which is dividing 50 by 3 which is 16.66667"
    "ANALYSE": "Now the equation remains 2 + 2 - 16.66667"
    "THINK": Now its simple, we can just do 2 + 2 = 4 and the new equations remains 4 - 16.66667"
    "ANALYSE": "Great, now lets just do the funal step as simple substraction"
    "THINK": "After the final substraction, the ans remains as -12.66667
    "OUTPUT": "The final output is -12.66667"

    Output Formats:
    { "step": "INITIAL" | "THINK" | "ANALYSE" | "OUTPUT", "text": "<The Actual Text>" }
`;

const MESSAGES_DB = [
    { role: 'system', content: SYSTEM_PROMOT }
]

async function main(prompt = '') {
    MESSAGES_DB.push({ role: 'user', content: prompt })

    // Executes until it get the final output
    while(true) {
        const result = await client.chat.completions.create({
            model: "gemini-2.5-flash-lite",
            messages: MESSAGES_DB
        })

        const rawResult = result.choices[0].message.content
        // console.log(rawResult);
        
        const parsedRes = JSON.parse(rawResult);

        MESSAGES_DB.push({ role:'assistant', content: rawResult })

        console.log(`🤖(${parsedRes.step}) : ${parsedRes.text}`);
        
        if(parsedRes.step.toLowerCase() === "output") break;

        MESSAGES_DB.push({
            role: "user",
            content: "Continue with the next step only."
        });
    }

}

main("What is 4 + 6 + 9 - 3 * 5");
