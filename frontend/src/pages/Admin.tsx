// frontend/src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // No changes needed here
import { PageLayout } from "../components/PageLayout";
import { apiService } from "./apiService"; // Importando o serviço de API centralizado

interface Quest {
  id: number;
  title: string;
  description: string;
}

export default function AdminPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingQuestId, setDeletingQuestId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      setIsLoading(true);
      const data = await apiService<Quest[]>("/admin/quests");
      setQuests(data);
    } catch (error) {
      toast.error("Falha ao carregar missões.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (questData: Omit<Quest, "id"> & { id?: number }) => {
    const { id, title, description } = questData;
    const method = id ? "PUT" : "POST";
    const url = id ? `/admin/quests/${id}` : "/admin/quests";

    setIsSubmitting(true);
    try {
      await apiService(url, {
        method,
        body: JSON.stringify({ title, description }),
      });

      toast.success(`Missão ${id ? "atualizada" : "criada"} com sucesso!`);
      setEditingQuest(null);
      fetchQuests(); // Recarrega a lista
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar esta missão?")) {
      try {
        await apiService(`/admin/quests/${id}`, { method: "DELETE" });
        setDeletingQuestId(id);
        toast.success("Missão deletada com sucesso!");
        fetchQuests();
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setDeletingQuestId(null);
      }
    }
  };

  return (
    <PageLayout className="p-8 text-slate-200 justify-start">
      <h1 className="text-3xl font-bold text-brand-cyan mb-6">
        Painel de Administração - Missões Diárias
      </h1>

      {editingQuest ? (
        <QuestForm
          quest={editingQuest}
          onSave={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => setEditingQuest(null)}
        />
      ) : (
        <>
          <button
            onClick={() =>
              setEditingQuest({ id: 0, title: "", description: "" })
            }
            className="mb-6 bg-brand-purple text-white font-bold py-2 px-4 rounded hover:bg-brand-purple/80"
          >
            Adicionar Nova Missão
          </button>
          <QuestList
            quests={quests}
            onEdit={setEditingQuest}
            onDelete={handleDelete}
            deletingQuestId={deletingQuestId}
            isLoading={isLoading}
          />
        </>
      )}
    </PageLayout>
  );
}

// Componente da Lista de Missões
const QuestList = ({
  quests,
  onEdit,
  onDelete,
  deletingQuestId,
  isLoading,
}: any) => {
  if (isLoading) return <p>Carregando missões...</p>;
  return (
    <div className="space-y-4">
      {quests.map((quest: Quest) => (
        <div
          key={quest.id}
          className="bg-brand-slate/50 p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <h2 className="font-bold text-lg">{quest.title}</h2>
            <p className="text-slate-400">{quest.description}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(quest)}
              className="bg-blue-500 text-white py-1 px-3 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(quest.id)}
              disabled={deletingQuestId === quest.id}
              className="bg-red-500 text-white py-1 px-3 rounded disabled:bg-red-500/50 disabled:cursor-wait"
            >
              {deletingQuestId === quest.id ? "Deletando..." : "Deletar"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente do Formulário de Missão
const QuestForm = ({ quest, onSave, onCancel, isSubmitting }: any) => {
  const [title, setTitle] = useState(quest?.title || "");
  const [description, setDescription] = useState(quest?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...quest, title, description });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-slate/50 p-6 rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {quest?.id ? "Editar Missão" : "Adicionar Nova Missão"}
      </h2>
      <div>
        <label htmlFor="title" className="block mb-1 font-semibold">
          Título
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-brand-deep-slate border border-brand-light-slate"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1 font-semibold">
          Descrição
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-brand-deep-slate border border-brand-light-slate"
          required
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-wait"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
