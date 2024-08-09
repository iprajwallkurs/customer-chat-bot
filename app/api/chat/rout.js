import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const systemPrompt = `Hello and welcome!
      I’m JARVIS, your personal assistant.
      How can I assist you today?
      Please provide a brief description of your issue or question. Whether it's about our AI-powered interview platform or anything else, I'm here to help!`;

export async function POST(req) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('API Key is missing');
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const data = await req.json();
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...data,
      ],
      model: 'gpt-3.5', // Ensure this is the correct model
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error in API route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
