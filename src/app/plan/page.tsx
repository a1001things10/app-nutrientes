"use client";

import { useState, useEffect } from "react";
import { Calendar, Dumbbell, Utensils, ChevronRight, Loader2, AlertCircle } from "lucide-react";

interface UserProfile {
  age: string;
  gender: string;
  height: string;
  weight: string;
  healthConditions: string[];
  diet: string;
  mealsPerDay: string;
  allergies: string;
  mainGoal: string;
  exerciseFrequency: string;
}

interface Exercise {
  name: string;
  description: string;
  sets: string;
  reps: string;
  imageUrl: string;
  instructions: string[];
}

interface MealPlan {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
}

interface WorkoutPlan {
  day: string;
  exercises: Exercise[];
}

export default function PlanPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"meal" | "workout">("meal");
  const [planType, setPlanType] = useState<"daily" | "weekly">("weekly");

  useEffect(() => {
    const profile = localStorage.getItem("userHealthProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const generatePlans = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      // Gerar plano alimentar
      const mealResponse = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, planType }),
      });
      const mealData = await mealResponse.json();
      setMealPlan(mealData.plan);

      // Gerar plano de treino
      const workoutResponse = await fetch("/api/generate-workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile, planType }),
      });
      const workoutData = await workoutResponse.json();
      setWorkoutPlan(workoutData.plan);
    } catch (error) {
      console.error("Erro ao gerar planos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Perfil não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Complete o questionário de saúde primeiro para gerar seu plano personalizado.
          </p>
          <button
            onClick={() => (window.location.href = "/questionnaire")}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Ir para Questionário
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Seu Plano Personalizado
          </h1>
          <p className="text-lg text-indigo-100">
            Plano de alimentação e treino baseado no seu perfil e objetivos
          </p>
        </div>

        {/* Tipo de Plano */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={() => setPlanType("daily")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  planType === "daily"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Plano Diário
              </button>
              <button
                onClick={() => setPlanType("weekly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  planType === "weekly"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Plano Semanal
              </button>
            </div>
            <button
              onClick={generatePlans}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Planos"
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab("meal")}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "meal"
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Utensils className="w-5 h-5" />
            Plano Alimentar
          </button>
          <button
            onClick={() => setActiveTab("workout")}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "workout"
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            Plano de Treino
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === "meal" && (
          <div className="space-y-6">
            {mealPlan.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Clique em "Gerar Planos" para criar seu plano alimentar personalizado
                </p>
              </div>
            ) : (
              mealPlan.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    {day.day}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🌅</span>
                        Café da Manhã
                      </h4>
                      <p className="text-gray-700">{day.meals.breakfast}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">☀️</span>
                        Almoço
                      </h4>
                      <p className="text-gray-700">{day.meals.lunch}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🌙</span>
                        Jantar
                      </h4>
                      <p className="text-gray-700">{day.meals.dinner}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-2xl">🍎</span>
                        Lanches
                      </h4>
                      <ul className="space-y-1">
                        {day.meals.snacks.map((snack, i) => (
                          <li key={i} className="text-gray-700 flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-1 text-purple-500" />
                            {snack}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "workout" && (
          <div className="space-y-6">
            {workoutPlan.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Clique em "Gerar Planos" para criar seu plano de treino personalizado
                </p>
              </div>
            ) : (
              workoutPlan.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2">
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    {day.day}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.exercises.map((exercise, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 hover:shadow-lg transition-all"
                      >
                        <img
                          src={exercise.imageUrl}
                          alt={exercise.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 className="font-bold text-gray-800 text-lg mb-2">
                          {exercise.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {exercise.description}
                        </p>
                        <div className="flex gap-4 mb-3">
                          <div className="bg-white rounded-lg px-3 py-2 text-center">
                            <p className="text-xs text-gray-500">Séries</p>
                            <p className="font-bold text-blue-600">{exercise.sets}</p>
                          </div>
                          <div className="bg-white rounded-lg px-3 py-2 text-center">
                            <p className="text-xs text-gray-500">Repetições</p>
                            <p className="font-bold text-blue-600">{exercise.reps}</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-700 mb-2">
                            Como executar:
                          </p>
                          <ul className="space-y-1">
                            {exercise.instructions.map((instruction, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-gray-600 flex items-start gap-2"
                              >
                                <span className="text-blue-500 font-bold">{idx + 1}.</span>
                                {instruction}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
