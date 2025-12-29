export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  type: 'start' | 'action' | 'branch' | 'end';
  childId?: string | null;
  branches?: { True: string | null; False: string | null };
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  label: string | null;
}
