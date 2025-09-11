import { useMemo } from "react";

/**
 * Calcula a sequência (streak) de dias consecutivos com base em um histórico de datas.
 * @param history - Um array de objetos Date representando os dias em que as missões foram concluídas.
 * @returns O número de dias consecutivos na sequência atual.
 */
function calculateStreak(history: Date[]): number {
  if (!history || history.length === 0) {
    return 0;
  }

  // 1. Normaliza e remove duplicatas: cria um conjunto de timestamps à meia-noite.
  const uniqueTimestamps = [
    ...new Set(
      history.map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ),
  ].sort((a, b) => b - a); // 2. Ordena do mais recente para o mais antigo.

  if (uniqueTimestamps.length === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mostRecentCompletion = new Date(uniqueTimestamps[0]);

  const oneDay = 24 * 60 * 60 * 1000;
  const daysSinceLastCompletion =
    (today.getTime() - mostRecentCompletion.getTime()) / oneDay;

  // 3. Verifica se a sequência está ativa (conclusão hoje ou ontem).
  if (daysSinceLastCompletion > 1) {
    return 0; // A sequência foi quebrada.
  }

  let currentStreak = 1;

  // 4. Itera para contar os dias consecutivos.
  for (let i = 0; i < uniqueTimestamps.length - 1; i++) {
    const currentDay = uniqueTimestamps[i];
    const previousDay = uniqueTimestamps[i + 1];
    const diff = (currentDay - previousDay) / oneDay;

    if (diff > 1) {
      break; // A sequência foi quebrada.
    }
    currentStreak++;
  }

  return currentStreak;
}

export const useMissionStreak = (completionHistory: Date[]) => {
  const streak = useMemo(
    () => calculateStreak(completionHistory),
    [completionHistory]
  );
  return streak;
};
