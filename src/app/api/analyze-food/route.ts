import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      )
    }

    // Chamar OpenAI Vision API para análise
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analise esta imagem de comida e forneça uma estimativa nutricional detalhada. 

Retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com esta estrutura exata:
{
  "food": "nome do prato principal identificado",
  "quantity": peso estimado total em gramas (número),
  "protein": gramas de proteína (número),
  "fiber": gramas de fibra (número),
  "carbs": gramas de carboidratos (número),
  "fat": gramas de gordura (número),
  "calories": calorias totais (número),
  "vitamins": "lista das principais vitaminas presentes (ex: A, C, D, E, K, B12)",
  "minerals": "lista dos principais minerais (ex: Cálcio, Ferro, Magnésio, Zinco)",
  "aminoacids": "lista dos principais aminoácidos (ex: Leucina, Isoleucina, Valina, Lisina)"
}

Seja preciso nas estimativas baseando-se no tamanho visual dos alimentos.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Erro da OpenAI:', errorData)
      return NextResponse.json(
        { error: 'Erro ao analisar imagem com IA' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extrair JSON da resposta (remover markdown se houver)
    let nutritionData
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0])
      } else {
        nutritionData = JSON.parse(content)
      }
    } catch (parseError) {
      console.error('Erro ao parsear JSON:', content)
      return NextResponse.json(
        { error: 'Erro ao processar resposta da IA' },
        { status: 500 }
      )
    }

    return NextResponse.json(nutritionData)
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
