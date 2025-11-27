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

    const prompt = `Você é um nutricionista especializado. Crie um plano alimentar ${planType === "daily" ? "diário" : "semanal"} personalizado baseado no seguinte perfil:

Idade: ${userProfile.age} anos
Gênero: ${userProfile.gender}
Altura: ${userProfile.height} cm
Peso: ${userProfile.weight} kg
Condições de saúde: ${userProfile.healthConditions.join(", ") || "Nenhuma"}
Dieta: ${userProfile.diet}
Refeições por dia: ${userProfile.mealsPerDay}
Alergias: ${userProfile.allergies || "Nenhuma"}
Objetivo: ${userProfile.mainGoal}
Frequência de exercícios: ${userProfile.exerciseFrequency}

Crie um plano de ${days} dia(s) com café da manhã, almoço, jantar e 2 lanches saudáveis.
Considere as restrições alimentares, alergias e objetivos do usuário.
Seja específico com porções e alimentos.

Retorne APENAS um JSON válido no seguinte formato:
{
  "plan": [
    {
      "day": "Nome do dia",
      "meals": {
        "breakfast": "Descrição detalhada do café da manhã",
        "lunch": "Descrição detalhada do almoço",
        "dinner": "Descrição detalhada do jantar",
        "snacks": ["Lanche 1", "Lanche 2"]
      }
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista especializado que cria planos alimentares personalizados. Sempre retorne respostas em formato JSON válido.",
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
      result.plan[0].day = "Hoje";
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao gerar plano alimentar:", error);
    return NextResponse.json(
      { error: "Erro ao gerar plano alimentar" },
      { status: 500 }
    );
  }
}
