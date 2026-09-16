# Tokenization
User's natural language is being converted into numbers which is previously determined by the specific companies, depending into the company's vocabulary

> The vocabulary varies depening upon the companies / LLM providers

- A = 1
- B = 2.....just an assumption

```
"Hello, Welcome to the world"
> These words will be breaked into multiple tokens like {"Hell", "lo,", "Welco", "me ", "to the", "wo", "rld"}
this completely depends on the llm provider and each token has its value
```

> [code file: token.js](../token.js)