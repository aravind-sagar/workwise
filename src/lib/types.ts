
export type WorkLog = {
  id: string;
  date: string; // Stored as ISO string
  description: string;
  tags: string[];
  ticket?: string;
};
