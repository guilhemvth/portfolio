export type ProjectCategory = 'biomechanics' | 'mechanics' | 'composites' | 'simulation';

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  category: ProjectCategory;
  tags: string[];
  tools: string[];
  metrics?: {
    value: string;
    label: string;
  };
  keyTakeaways: string[];
  interactiveType: 'taekwondo' | 'carbon-beam' | 'pollution' | '3d-printer' | 'descender' | 'tripteron' | 'topological-beam' | 'fracture';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  category: 'professional' | 'academic' | 'other';
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  description?: string;
}

export interface SkillGroup {
  category: string;
  skills: { name: string; level: number; iconName: string }[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
