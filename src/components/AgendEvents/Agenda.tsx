// components/AgendEvents/Agenda.tsx
import { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DayCell } from "./DayCell";
import { CalendarEvent } from "@/types";

interface AgendaProps {
  events: CalendarEvent[];
  onDayClick?: (date: Date) => void;
}

export const Agenda = ({ events, onDayClick }: AgendaProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

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
          onClick={onDayClick}
        />
      );
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth}>{"<"}</Button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button onClick={nextMonth}>{">"}</Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-medium text-sm">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {rows.flat()}
      </div>
    </div>
  );
};
