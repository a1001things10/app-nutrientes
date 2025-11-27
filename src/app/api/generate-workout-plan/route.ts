import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userProfile, planType } = await request.json();

    const days = planType === "daily" ? 1 : 7;
    const dayNames = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];

    const prompt = `Você é um personal trainer especializado em treinos com peso corporal. Crie um plano de treino ${planType === "daily" ? "diário" : "semanal"} personalizado baseado no seguinte perfil:

Idade: ${userProfile.age} anos
Gênero: ${userProfile.gender}
Altura: ${userProfile.height} cm
Peso: ${userProfile.weight} kg
Condições de saúde: ${userProfile.healthConditions.join(", ") || "Nenhuma"}
Objetivo: ${userProfile.mainGoal}
Frequência de exercícios: ${userProfile.exerciseFrequency}

Crie um plano de ${days} dia(s) com exercícios APENAS com peso corporal (sem equipamentos).
Cada exercício deve ter:
- Nome do exercício
- Descrição breve
- Número de séries
- Número de repetições
- URL de imagem ilustrativa do Unsplash (use URLs reais e públicas do Unsplash)
- Instruções passo a passo de execução (3-5 passos)

Considere as condições de saúde e objetivos do usuário.
Para iniciantes, use exercícios mais simples. Para avançados, aumente a intensidade.

Retorne APENAS um JSON válido no seguinte formato:
{
  "plan": [
    {
      "day": "Nome do dia",
      "exercises": [
        {
          "name": "Nome do exercício",
          "description": "Descrição breve",
          "sets": "3",
          "reps": "10-12",
          "imageUrl": "https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop",
          "instructions": [
            "Passo 1",
            "Passo 2",
            "Passo 3"
          ]
        }
      ]
    }
  ]
}

IMPORTANTE: Use URLs reais do Unsplash para exercícios físicos. Exemplos:
- Flexões: https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop
- Agachamento: https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop
- Prancha: https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop
- Abdominais: https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um personal trainer especializado em treinos com peso corporal. Sempre retorne respostas em formato JSON válido com URLs reais do Unsplash.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    
    // Adicionar nomes dos dias se for plano semanal
    if (planType === "weekly" && result.plan) {
      result.plan = result.plan.map((day: any, index: number) => ({
        ...day,
        day: dayNames[index] || `Dia ${index + 1}`,
      }));
    } else if (planType === "daily" && result.plan) {
      result.plan[0].day = "Treino de Hoje";
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao gerar plano de treino:", error);
    return NextResponse.json(
      { error: "Erro ao gerar plano de treino" },
      { status: 500 }
    );
  }
}
