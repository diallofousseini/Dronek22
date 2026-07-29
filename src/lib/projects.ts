export type ProjectCategory = 'forestry' | 'agriculture' | 'drone' | 'agroforestry';

export type ProjectItem = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  location: string;
  year: string;
  image: string;
  detail: string;
  objectives: string[];
  impacts: string[];
  gallery: string[];
};

export const projects: ProjectItem[] = [];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
