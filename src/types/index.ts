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
  createdAt: string;
  updatedAt: string;
}

export interface CommitmentData {
  date: string;
  level: number;
  activitiesCount: number;
}