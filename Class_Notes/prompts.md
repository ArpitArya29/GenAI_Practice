# Prompting
The approach of giving instructions or prompts to the models

>**1. Zero Shot prompting**:  
 A process of giving the direct prompt to the AI models for getting the result.  
Direct instructions to direct answer  
[code: zero-shot](../Prompting/01_zero.js)

>**2. Few shot prompting**:  
 Process of giving the prompt to the AI models with some examples, keeping/referencing that example, the model responds according to the example.  
Basically we can control our model slightly  
[code: few-shot](../Prompting/02_few_shot.js)

>**3. Chain of Thought Prompting**:  
 Here the instructions/problems is breaked up into several steps, and it is getting solved before giving the final output  
In this process, we give out model a **System Prompt** including several breakdown rules, and steps what to perform on the given instructions  
[code: COT](../Prompting/03_cot.js)