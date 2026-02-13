export interface TimelineEvent {
  year: number;
  description: string;
}

export interface TimePeriod {
  id: number;
  startYear: number;
  endYear: number;
  category: string;
  events: TimelineEvent[];
}

export interface EllipseProps {
  periods: TimePeriod[];
  className?: string;
}
