
import { ReactNode } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableContainerProps {
  items: { id: string; component: ReactNode }[];
  setItems: (items: { id: string; component: ReactNode }[]) => void;
}

export function SortableContainer({ items, setItems }: SortableContainerProps) {
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((w) => w.id === active.id);
      const newIndex = items.findIndex((w) => w.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  // Componente genérico para cada item arrastável
  const SortableItem = ({ id, children }: { id: string; children: ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: "grab",
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        {items.map((w) => (
          <SortableItem key={w.id} id={w.id}>
            {w.component}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
