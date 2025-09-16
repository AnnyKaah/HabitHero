import React, { useState } from "react";
import { Users, BarChart2, UserPlus } from "lucide-react";
import { useUser } from "./UserContext";
import RankingTab from "../components/RankingTab";
import FriendsTab from "../components/FriendsTab";
import RequestsTab from "../components/RequestsTab";

const mockFriends = [
  {
    id: "friend1",
    username: "MagoPoderoso",
    level: 15,
    avatarId: "avatar2",
    xp: 1550,
  },
  {
    id: "friend2",
    username: "GuerreiraVeloz",
    level: 12,
    avatarId: "avatar5",
    xp: 1230,
  },
  {
    id: "friend3",
    username: "ArqueiraPrecisa",
    level: 18,
    avatarId: "avatar8",
    xp: 1980,
  },
];

const mockRequests = [
  { id: "req1", username: "BardoViajante", level: 9, avatarId: "avatar11" },
  {
    id: "req2",
    username: "ClérigoCurandeiro",
    level: 11,
    avatarId: "avatar15",
  },
];

type Tab = "ranking" | "friends" | "requests";

export default function SocialPage() {
  const { state } = useUser();
  const { user } = state;
  const [activeTab, setActiveTab] = useState<Tab>("ranking");

  // Garante que o componente só renderize quando o usuário estiver carregado.
  if (!user) {
    return null; // Ou um componente de carregamento (spinner)
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "ranking", label: "Ranking", icon: BarChart2 },
    { id: "friends", label: "Amigos", icon: Users },
    { id: "requests", label: "Pedidos", icon: UserPlus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "ranking":
        return <RankingTab currentUser={user} friends={mockFriends} />;
      case "friends":
        return <FriendsTab friends={mockFriends} />;
      case "requests":
        return <RequestsTab requests={mockRequests} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-screen-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-brand-cyan mb-8">
        Comunidade
      </h1>

      <div className="flex border-b border-brand-light-slate mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-3 px-4 font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-brand-purple border-b-2 border-brand-purple"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {tab.id === "requests" && mockRequests.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {mockRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
