import { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, format, isToday } from "date-fns";
import { useDayFlow } from "@/hooks/useDayFlow";
import { DayCell } from "@/components/AgendEvents/DayCell";
import { CalendarEvent } from "@/types";
import { Button } from "@/components/ui/button";

export const AgendaPage = () => {
  const { dayProcesses } = useDayFlow();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const events: CalendarEvent[] = dayProcesses
    .filter((d) => d.activities.length > 0)
    .map((d) => ({
      date: d.date,
      activitiesCount: d.activities.length,
    }));

  const nextMonth = () => setCurrentMonth(addDays(monthStart, 32));
  const prevMonth = () => setCurrentMonth(addDays(monthStart, -1));

  const rows: JSX.Element[][] = [];
  let days: JSX.Element[] = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "yyyy-MM-dd");
      const dayEvents = events.filter((e) => e.date === formattedDate);
      days.push(
        <DayCell
          key={formattedDate}
          day={day}
          events={dayEvents}
          isCurrentMonth={isSameMonth(day, currentMonth)}
          isToday={isToday(day)}
          onClick={(d) => console.log("Dia clicado:", d)}
        />
      );
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header do mês */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={prevMonth}>
          {"<"}
        </Button>
        <h2 className="text-2xl font-bold capitalize">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="outline" onClick={nextMonth}>
          {">"}
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm text-gray-600">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Células do calendário */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {rows.flat()}
      </div>
    </div>
  );
};
