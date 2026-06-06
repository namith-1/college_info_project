export type Course = {
  id: string;
  name: string;
  degree: string;
  duration: string;
  fees: number;
  seats: number;
};

export type Placement = {
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
};

export type Exam = {
  code: string;
  name: string;
};

export type Cutoff = {
  courseName: string;
  minRank: number;
  maxRank: number;
  category: string;
  exam: Exam;
};

export type Review = {
  id: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
};

export type College = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: string;
  ownership: string;
  overview: string;
  rating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  imageUrl: string;
  placement: Placement | null;
  courses: Course[];
  cutoffs?: Cutoff[];
  reviews?: Review[];
};

export type Filters = {
  cities: string[];
  states: string[];
  courses: string[];
  exams: Exam[];
};
