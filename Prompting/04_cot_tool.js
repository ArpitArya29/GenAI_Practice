import { OpenAI } from "openai"
import  dotenv from "dotenv"
import axios from 'axios'

dotenv.config({
    path: "../.env"
});

const ApiKey = process.env.GEMINIAPI_KEY;
// console.log(ApiKey);


const client = new OpenAI({
    apiKey: ApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

async function getWeatherData(cityName) {
    const url = `https://wttr.in/${cityName.toLowerCase()}?format=%C+%t`
    const response = await axios.get(url, {responseType: 'text'})
    
    return JSON.stringify({
        cityName,
        weatherInfo: response.data
    })
}

const SYSTEM_PROMPT = `
    You are an expert AI engineer. You have to analyze the user's input carefully and you need to break down the problem into multiple subproblems before coming on to the final result. Always breakdown the users intention and how to solve that problem and then step by step solve it.

    We are goint to follow the pipeline of "INITIAL", "THINK", "TOOL_REQUEST", "ANALYSE" and "OUTPUT" pipeline.

    The popelines:
    - "INITIAL" when user gives an input, we will have an initial touught process on what this user is trying to do
    - "THINK" this is where we are going to thing about how to solve this and then start to breakdown the problem
    - "ANALYSE" this is where we analyse the solution and also verify if the output is correct
    - "THINK" we can go to think mode where we now see if any sub-problem remains and think
    - "ANALYSE" again analyse the problem and get into the solution
    - "TOOL_REQUEST": use this for calling or requesting a tool. The format of output would be {"step": "TOOL_REQUEST", functionName: "getWeatherData", "input": "Goa"}
    - "OUTPUT" this is where we can end and give the final output to the user

    Available Tools:
    - "getWeatherData": getWeatherData(cityName: string): Returns the realtime weather information of city

    Rules:
    - Always output one step at a time and wait for other step before proceeding
    - Always maintain the sequence of pipeline as given in the example
    - Always follow JSON output format strictly
    - Return only a valid JSON object. Do not wrap it in Markdown code fences. Do not include any explanation before or after the JSON.

    Example:
    - "USER": What is 2 + 2 - 5 * 10 / 3?
    OUTPUT:
    - "INITIAL": "The user wants me to solve a maths equation"
    - "THINK": "I will use the BODMAS formula and based on that i should first multiply 5 * 10 which is 50"
    - "ANALYSE": "Yes, the bodmas is actually right and now equation is 2 + 2 - 50 / 3"
    - "THINK": "Now, as per rule I should perform divide which is dividing 50 by 3 which is 16.66667"
    - "ANALYSE": "Now the equation remains 2 + 2 - 16.66667"
    - "THINK": Now its simple, we can just do 2 + 2 = 4 and the new equations remains 4 - 16.66667"
    - "ANALYSE": "Great, now lets just do the funal step as simple substraction"
    - "THINK": "After the final substraction, the ans remains as -12.66667"
    - "OUTPUT": "The final output is -12.66667"

    Example:
    - "USER": what is weather of Goa?
    OUTPUT:
    - "INITIAL": "The user wants me to fetch weather information of Goa"
    - "THINK": "From the tools, I can see we have a tool named getWeatherData which can be called"
    - "ANALYSE": "We are going right, we can call getWeatherData with "GOA" as input"
    - "TOOL_REQUEST": {"functionName": "getWeatherData", "input": "goa"}
    - "TOOL_OUTPUT": "The weather of Goa is something like 30 degree C"
    - "THINK": "We got the weather info"
    - "OUTPUT": "The weather of Goa is sunny with some 30 degree C. Its gonna be Hotttt"

    Output Formats:
    { "step": "INITIAL" | "THINK" | "ANALYSE" | "OUTPUT", "text": "<The Actual Text>", "functionName": <NAME OF FUNCTION>", "input": "INPUT PARAMS of function" }
`;

const MESSAGES_DB = [
    { role: 'system', content: SYSTEM_PROMPT }
]

async function main(prompt = '') {
    MESSAGES_DB.push({ role: 'user', content: prompt })

    console.log("Executing the model for response");
    

    // Executes until it get the final output
    while(true) {
        const result = await client.chat.completions.create({
            model: "gemini-2.5-flash",
            messages: MESSAGES_DB
        })

        const rawResult = result.choices[0].message.content
        console.log(rawResult);
        
        const parsedRes = JSON.parse(rawResult);

        MESSAGES_DB.push({ role:'assistant', content: rawResult })
        
        if(parsedRes.step.toLowerCase() === "output") {
            console.log(parsedRes.text);
            break;
        }

        if(parsedRes.step.toUpperCase() === "TOOL_REQUEST") {
            const { functionName, input } = parsedRes;

            switch(functionName) {
                case 'getWeatherData': 
                    {
                        const toolRes = await getWeatherData(input);
                        console.log(`⛏️=>(${functionName}): ${input} ${toolRes}`);
                        
                        MESSAGES_DB.push({
                            role: 'user',
                            content: JSON.stringify({
                                step: 'TOOL_OUTPUT',
                                output: toolRes
                            })
                        })
                        continue;
                    }
                    break;
            }
        }

        MESSAGES_DB.push({
            role: "user",
            content: "Continue with the next step only."
        });
    }

}

main("What is the weather of Hazaribagh, Delhi and Bangalore?");
