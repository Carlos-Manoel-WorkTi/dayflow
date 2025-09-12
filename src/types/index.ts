export interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Activity {
  id: string;
  startTime: string;
  endTime: string;
  description: string;
  tags: Tag[];
  isPrivate?: boolean;
}

export interface DayProcess {
  id: string;
  date: string;
  activities: Activity[];
  commitmentLevel?: number;
  isCompleted: boolean;
  finalizado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommitmentData {
  date: string;
  level: number;
  activitiesCount: number;
}

export interface User {
  name: string;
  email: string;
  photo?: string; // opcional
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasProfile: boolean;
  getAvatar: () => string; // retorna foto ou inicial
}

export interface GeminiResponse {
  text: string;
  raw: any;
}

export interface SystemInstruction {
  system: string;  // exemplo: "analisar rotinas", "gerar insights"
  prompt: string;  // texto ou descrição a enviar
}