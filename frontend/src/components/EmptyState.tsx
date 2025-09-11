import { Rocket } from "lucide-react";
// No changes needed here
interface EmptyStateProps {
  onAddHabit: () => void;
}

export default function EmptyState({ onAddHabit }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-700">
      <Rocket className="mx-auto h-12 w-12 text-slate-500" />
      <h3 className="mt-4 text-lg font-semibold text-slate-300">
        Nenhuma missão encontrada
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        Parece que sua jornada ainda não começou. Crie sua primeira missão!
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onAddHabit}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
        >
          Criar primeira missão
        </button>
      </div>
    </div>
  );
}
