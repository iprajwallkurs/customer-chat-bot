import { NextResponse } from 'next/server';
const HfInference = require('@huggingface/inference').HfInference;

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req) {
  const data = await req.json();

  try {
    const response = [];
    for await (const chunk of inference.chatCompletionStream({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: data.messages,
      max_tokens: 500,
    })) {
      response.push(chunk.choices[0]?.delta?.content || "");
    }
    return NextResponse.json({ content: response.join('') });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "I'm sorry, but I encountered an error. Please try again later." }, { status: 500 });
  }
}
