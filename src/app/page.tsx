import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">NutriTracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/meals">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-green-800">Refeições do Dia</h2>
            <p className="text-muted-foreground">Resumo das refeições...</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Adicionar Refeição
            </button>
          </div>
        </Link>
        <Link href="/medications">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">Medicações</h2>
            <p className="text-muted-foreground">Próximas medicações...</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Ver Medicamentos
            </button>
          </div>
        </Link>
        <Link href="/symptoms">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2 text-red-800">Sintomas</h2>
            <p className="text-muted-foreground">Registrar sintomas...</p>
            <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Registrar Sintoma
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}