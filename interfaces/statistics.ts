export interface Statistic {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  type: StatisticType;
  values: StatisticValue[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatisticValue {
  id: string;
  statisticId: string;
  createdAt: string;
  time: string;
  number: number;
  boolean: boolean;
  text: string;
}

export interface StatisticDetailModalProps {
  onOpenChange: () => void;
  isOpen: boolean;
  statistic?: Statistic;
}

export type StatisticType = "time" | "boolean" | "number" | "text";
