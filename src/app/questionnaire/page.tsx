"use client";

import { useState } from "react";
import { CheckCircle2, User, Activity, Target, Utensils, AlertCircle, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation, languages } from "@/lib/i18n";

export default function QuestionnairePage() {
  const { language, setLanguage } = useLanguage();
  const t = (key: keyof typeof import("@/lib/i18n").translations["en"]) => getTranslation(language, key);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    healthConditions: [] as string[],
    healthConditionOther: "",
    diet: "",
    dietOther: "",
    mealsPerDay: "",
    hasAllergies: "",
    allergies: "",
    mainGoal: "",
    exerciseFrequency: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(value)
        ? prev.healthConditions.filter((item) => item !== value)
        : [...prev.healthConditions, value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados do questionário:", formData);
    localStorage.setItem("userHealthProfile", JSON.stringify(formData));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-4">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t("thankYou").split("!")[0]}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {t("thankYou").split("!")[1]}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {language === "en" && "Go to Dashboard"}
            {language === "pt-BR" && "Ir para o Dashboard"}
            {language === "es-MX" && "Ir al Panel"}
            {language === "fr" && "Aller au Tableau de bord"}
            {language === "it" && "Vai alla Dashboard"}
            {language === "de" && "Zum Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Language Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">{t("selectLanguage")}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 ${
                  language === lang.code
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-xs">{lang.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t("healthQuestionnaire")}
          </h1>
          <p className="text-lg text-blue-100">
            {language === "en" && "Assess your health status to personalize nutrition recommendations."}
            {language === "pt-BR" && "Avaliar o estado de saúde do usuário para personalizar recomendações de alimentação."}
            {language === "es-MX" && "Evaluar el estado de salud del usuario para personalizar recomendaciones de alimentación."}
            {language === "fr" && "Évaluer votre état de santé pour personnaliser les recommandations nutritionnelles."}
            {language === "it" && "Valutare il tuo stato di salute per personalizzare le raccomandazioni nutrizionali."}
            {language === "de" && "Bewerten Sie Ihren Gesundheitszustand, um Ernährungsempfehlungen zu personalisieren."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Informações Básicas */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3">
                <User className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === "en" && "Basic Information"}
                {language === "pt-BR" && "Informações Básicas"}
                {language === "es-MX" && "Información Básica"}
                {language === "fr" && "Informations de Base"}
                {language === "it" && "Informazioni di Base"}
                {language === "de" && "Grundinformationen"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("age")}
                </label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder={language === "en" ? "Ex: 25" : language === "pt-BR" ? "Ex: 25" : language === "es-MX" ? "Ej: 25" : language === "fr" ? "Ex: 25" : language === "it" ? "Es: 25" : "Bsp: 25"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("gender")}
                </label>
                <div className="space-y-2">
                  {[
                    { value: "male", label: t("male") },
                    { value: "female", label: t("female") },
                    { value: "preferNotToSay", label: t("preferNotToSay") },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-5 h-5 text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("height")}
                </label>
                <input
                  type="number"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder={language === "en" ? "Ex: 170" : language === "pt-BR" ? "Ex: 170" : language === "es-MX" ? "Ej: 170" : language === "fr" ? "Ex: 170" : language === "it" ? "Es: 170" : "Bsp: 170"}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("weight")}
                </label>
                <input
                  type="number"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                  placeholder={language === "en" ? "Ex: 70" : language === "pt-BR" ? "Ex: 70" : language === "es-MX" ? "Ej: 70" : language === "fr" ? "Ex: 70" : language === "it" ? "Es: 70" : "Bsp: 70"}
                />
              </div>
            </div>
          </div>

          {/* Seção 2: Condições de Saúde */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === "en" && "Health Conditions"}
                {language === "pt-BR" && "Condições de Saúde"}
                {language === "es-MX" && "Condiciones de Salud"}
                {language === "fr" && "Conditions de Santé"}
                {language === "it" && "Condizioni di Salute"}
                {language === "de" && "Gesundheitszustände"}
              </h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("preExistingConditions")}
              </label>
              <div className="space-y-2">
                {[
                  { value: "diabetes", label: t("diabetes") },
                  { value: "hypertension", label: t("hypertension") },
                  { value: "highCholesterol", label: t("highCholesterol") },
                  { value: "none", label: t("none") },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(option.value)}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.healthConditions.includes("other")}
                    onChange={() => handleCheckboxChange("other")}
                    className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                  />
                  <span className="text-gray-700">{t("other")}:</span>
                  <input
                    type="text"
                    value={formData.healthConditionOther}
                    onChange={(e) =>
                      setFormData({ ...formData, healthConditionOther: e.target.value })
                    }
                    className="flex-1 px-4 py-2 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    placeholder={language === "en" ? "Specify" : language === "pt-BR" ? "Especifique" : language === "es-MX" ? "Especificar" : language === "fr" ? "Préciser" : language === "it" ? "Specificare" : "Angeben"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Dieta e Alimentação */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === "en" && "Diet and Nutrition"}
                {language === "pt-BR" && "Dieta e Alimentação"}
                {language === "es-MX" && "Dieta y Alimentación"}
                {language === "fr" && "Régime et Nutrition"}
                {language === "it" && "Dieta e Alimentazione"}
                {language === "de" && "Ernährung"}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("specificDiet")}
                </label>
                <div className="space-y-2">
                  {[
                    { value: "vegetarian", label: t("vegetarian") },
                    { value: "vegan", label: t("vegan") },
                    { value: "lowCarb", label: t("lowCarb") },
                    { value: "paleo", label: t("paleo") },
                    { value: "none", label: t("none") },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="diet"
                        value={option.value}
                        checked={formData.diet === option.value}
                        onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                        className="w-5 h-5 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="diet"
                      value="other"
                      checked={formData.diet === "other"}
                      onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                      className="w-5 h-5 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{t("other")}:</span>
                    <input
                      type="text"
                      value={formData.dietOther}
                      onChange={(e) => setFormData({ ...formData, dietOther: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      placeholder={language === "en" ? "Specify" : language === "pt-BR" ? "Especifique" : language === "es-MX" ? "Especificar" : language === "fr" ? "Préciser" : language === "it" ? "Specificare" : "Angeben"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("mealsPerDay")}
                </label>
                <div className="space-y-2">
                  {["1", "2", "3", language === "en" ? "4 or more" : language === "pt-BR" ? "4 ou mais" : language === "es-MX" ? "4 o más" : language === "fr" ? "4 ou plus" : language === "it" ? "4 o più" : "4 oder mehr"].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mealsPerDay"
                        value={option}
                        checked={formData.mealsPerDay === option}
                        onChange={(e) =>
                          setFormData({ ...formData, mealsPerDay: e.target.value })
                        }
                        className="w-5 h-5 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("foodAllergies")}
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="no"
                      checked={formData.hasAllergies === "no"}
                      onChange={(e) =>
                        setFormData({ ...formData, hasAllergies: e.target.value })
                      }
                      className="w-5 h-5 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{t("no")}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="yes"
                      checked={formData.hasAllergies === "yes"}
                      onChange={(e) =>
                        setFormData({ ...formData, hasAllergies: e.target.value })
                      }
                      className="w-5 h-5 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{t("yes")}:</span>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="flex-1 px-4 py-2 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      placeholder={language === "en" ? "Specify your allergies" : language === "pt-BR" ? "Especifique suas alergias" : language === "es-MX" ? "Especifique sus alergias" : language === "fr" ? "Précisez vos allergies" : language === "it" ? "Specificare le allergie" : "Geben Sie Ihre Allergien an"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 4: Objetivos e Atividade Física */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {language === "en" && "Goals and Physical Activity"}
                {language === "pt-BR" && "Objetivos e Atividade Física"}
                {language === "es-MX" && "Objetivos y Actividad Física"}
                {language === "fr" && "Objectifs et Activité Physique"}
                {language === "it" && "Obiettivi e Attività Fisica"}
                {language === "de" && "Ziele und körperliche Aktivität"}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("mainGoal")}
                </label>
                <div className="space-y-2">
                  {[
                    { value: "weightLoss", label: t("weightLoss") },
                    { value: "muscleGain", label: t("muscleGain") },
                    { value: "weightMaintenance", label: t("weightMaintenance") },
                    { value: "generalHealth", label: t("generalHealth") },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="mainGoal"
                        value={option.value}
                        checked={formData.mainGoal === option.value}
                        onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
                        className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t("exerciseFrequency")}
                </label>
                <div className="space-y-2">
                  {[
                    { value: "never", label: t("never") },
                    { value: "rarely", label: t("rarely") },
                    { value: "onceOrTwice", label: t("onceOrTwice") },
                    { value: "threeOrFour", label: t("threeOrFour") },
                    { value: "fiveOrMore", label: t("fiveOrMore") },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="exerciseFrequency"
                        value={option.value}
                        checked={formData.exerciseFrequency === option.value}
                        onChange={(e) =>
                          setFormData({ ...formData, exerciseFrequency: e.target.value })
                        }
                        className="w-5 h-5 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
            >
              {t("submit")} {language === "en" ? "Questionnaire" : language === "pt-BR" ? "Questionário" : language === "es-MX" ? "Cuestionario" : language === "fr" ? "Questionnaire" : language === "it" ? "Questionario" : "Fragebogen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
