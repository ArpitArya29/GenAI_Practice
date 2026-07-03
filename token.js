import { get_encoding } from "tiktoken";

const encodingForGPT2 = get_encoding('gpt2');

// Encoding the text
const encoded = encodingForGPT2.encode("Hello, Welcome to the world of GenAI");
console.log(encoded);

// Decoding the encoded text
const decoded = encodingForGPT2.decode(encoded)

// now decode the decoded token into text format
console.log(new TextDecoder().decode(decoded));

