import type { ScheduleItem } from '../types';

export function toYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getScheduleForDate(schedule: ScheduleItem[], targetDate: Date): ScheduleItem[] {
  const targetDateStr = toYYYYMMDD(targetDate);
  const targetDayOfWeek = targetDate.getDay(); // 0 (Dom) a 6 (Sab)

  return schedule.filter(item => {
    const startDate = item.date; // A data que foi criado/iniciou

    // 1. Se a data alvo for ANTES do início da tarefa, não mostra.
    if (targetDateStr < startDate) return false;

    // 2. Se tiver data de fim e a data alvo for DEPOIS, não mostra.
    if (item.endDate && targetDateStr > item.endDate) return false;

    // 3. Verifica a Frequência
    switch (item.frequency) {
      case 'once':
        // Só mostra se for exatamente o dia
        return item.date === targetDateStr;
      
      case 'daily':
        // Mostra todo dia
        return true;
      
      case 'weekly':
        // Se tiver dias específicos definidos (ex: [1, 3, 5] para Seg/Qua/Sex), verifica
        if (item.daysOfWeek && item.daysOfWeek.length > 0) {
          return item.daysOfWeek.includes(targetDayOfWeek);
        }
        // Se não tiver dias definidos, assume que repete no mesmo dia da semana da data de início
        // (Lógica simplificada para o MVP)
        return true;

      case 'monthly':
        // Verifica se o dia do mês é o mesmo (ex: dia 10 de cada mês)
        // Nota: Isso pode falhar em meses sem dia 31, mas serve para o MVP
        const itemStartDay = parseInt(item.date.split('-')[2]);
        const targetDay = targetDate.getDate();
        return itemStartDay === targetDay;

      default:
        return false;
    }
  }).sort((a, b) => a.startTime.localeCompare(b.startTime)); // Ordena por horário
}