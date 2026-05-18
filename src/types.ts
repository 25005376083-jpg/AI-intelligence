export interface RoadmapPhase {
  phase: string;
  topics: string[];
  description: string;
}

export interface RoadmapData {
  roadmap: RoadmapPhase[];
  projects: { title: string; description: string }[];
}

export interface ResumeAnalysis {
  atsScore: number;
  strengths: string[];
  missingSkills: string[];
  suggestions: string[];
  professionalSummary: string;
}

export interface InterviewQuestions {
  technical: string[];
  behavioral: string[];
}

export type CareerGoal = 
  | 'Frontend Developer' 
  | 'Backend Developer' 
  | 'Full Stack Developer' 
  | 'UI/UX Designer' 
  | 'AI Engineer' 
  | 'Mobile App Developer' 
  | 'Data Analyst';
