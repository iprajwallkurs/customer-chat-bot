const HfInference = require("@huggingface/inference").HfInference;

// Initialize HfInference with your API key
const inference = new HfInference("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");

// Define an async function to handle the streaming completion
async function getChatCompletion() {
  try {
    for await (const chunk of inference.chatCompletionStream({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [{ role: "user", content: "What is the capital of France?" }],
      max_tokens: 500,
    })) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the async function
getChatCompletion();





