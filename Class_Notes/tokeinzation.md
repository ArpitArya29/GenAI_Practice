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

# Embeddings
The process of mapping the tokens into its real world mappings
- Process of mapping the semantic meaning of the tokens mathematically

# Positional Encodings
It adds extra data about the position of the token, esuring the consistent meaning about the data
- Two similar sentences have its specific meaning

# Self Attention mechanism
let tokens talk to each other
```
ICICI BANK
RIVER BANK
```
in the both sentences, the word is same, but it has different meaning

- It gets aware of the context of the meaning of word. **It determines which ones are most relevent to each other**