import { CalendarEvent } from "@/types";
import { format, isSameDay } from "date-fns";

interface DayCellProps {
  day: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  onClick?: (date: Date) => void;
}

const activityColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export const DayCell = ({ day, events, isCurrentMonth, onClick }: DayCellProps) => {
  const hasEvents = events.length > 0;
  const today = isSameDay(day, new Date());

  // cor do bloco de acordo com número de atividades
  const bgColor = hasEvents ? activityColors[events.length % activityColors.length] + "33" : undefined;

  return (
    <div
      onClick={() => onClick?.(day)}
      className={`p-2 h-24 flex flex-col justify-between border rounded-lg cursor-pointer transition-all duration-200
        ${!isCurrentMonth ? "opacity-40" : ""}
        ${today ? "border-primary" : ""}
        hover:brightness-105
      `}
      style={{ backgroundColor: bgColor }}
    >
      {/* Número do dia */}
      <div className={`text-right font-semibold ${today ? "text-primary" : ""}`}>
        {format(day, "d")}
      </div>

      {/* Número de atividades */}
      {hasEvents && (
        <div className="mt-2 flex justify-center gap-1 flex-wrap">
          {events.map((e, idx) => (
            <span
              key={idx}
              className="text-xs  py-1 rounded-full text-white font-medium text-center h-9 w-9 flex items-center justify-center"
              style={{
                backgroundColor: activityColors[idx % activityColors.length],
              }}
            >
              {e.activitiesCount > 1 ? `${e.activitiesCount}` : "0"}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
