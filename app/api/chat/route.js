// import { NextResponse } from 'next/server'
// import { OpenAI } from 'openai'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const dynamic = 'force-dynamic'

// export async function POST(request) {
//   try {
//     const { messages } = await request.json()

//     if (!messages || messages.length === 0) {
//       return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
//     }

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: `You are a helpful nutrition and food tracking AI assistant. 
//           You help users with nutrition advice, meal planning, and healthy eating habits.
//           Be friendly, supportive, and provide evidence-based advice.
//           Keep responses concise and actionable.`,
//         },
//         ...messages,
//       ],
//       temperature: 0.7,
//       max_tokens: 200,
//     })

//     const aiMessage = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

//     return NextResponse.json({
//       result: {
//         message: aiMessage,
//       },
//     })
//   } catch (error) {
//     console.error('Chat error:', error)
//     return NextResponse.json(
//       { error: error.message || 'Chat failed' },
//       { status: 500 }
//     )
//   }
// }