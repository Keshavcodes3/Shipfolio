import { social } from './Datas/social.js';
import { healtCareFailed } from './Datas/health.js';
import { eduToolsFailed } from './Datas/eduTools.js';
import { eduSaas } from './Datas/education.js';
import { devtools } from './Datas/devTools.js';

export interface GraveyardEntry {
  id: string;
  name: string;
  slug: string;
  classification: {
    primary_category: string;
    secondary_categories: string[];
    business_type: string;
    status: string;
    failure_type: string;
  };
  overview: {
    one_liner: string;
    problem: string;
    target_users: string[];
    product: string;
  };
  idea: {
    what_they_wanted_to_build: string;
    why_the_problem_mattered: string;
    founder_hypothesis: string;
    initial_assumption: string;
  };
  why_they_wanted_to_build_it: {
    motivation: string;
    founder_observation: string;
    important_context: string;
    lesson: string;
  };
  product: {
    type: string;
    delivery: string;
    core_use_case: string;
    primary_user: string;
    secondary_user: string;
    technical_implementation: string | null;
    pricing_model: string | null;
    integrations: string[] | null;
  };
  building: {
    development_period: string;
    team_size: number | null;
    development_method: string | null;
    technology_stack: string | null;
    distribution_strategy: string;
    initial_strategy: string;
    important_decision: string;
  };
  validation: {
    approach: string[];
    critical_problem: string;
    validation_failure: string;
    key_realization: string;
  };
  traction: {
    users: string | null;
    revenue: string | null;
    monthly_recurring_revenue: string | null;
    growth_rate: string | null;
    retention: string | null;
    funding: string | null;
    investors: string[];
    customers: string | null;
    product_market_fit: boolean;
  };
  go_to_market: {
    primary_channel: string;
    sales_motion: string;
    target_market: string;
    distribution_challenge: string;
    important_lesson: string;
  };
  failure: {
    status: string;
    primary_reason: string;
    why_failed: string;
    contributing_factors: { factor: string; explanation: string }[];
    death_event: string;
    what_did_not_work: string[];
  };
  founder_realization: {
    biggest_realization: string;
    before: string;
    after: string;
    core_insight: string;
  };
  lessons: { title: string; lesson: string; why_it_matters: string }[];
  graveyard_analysis: {
    failure_pattern: string[];
    the_illusion: string;
    the_reality: string;
    what_a_founder_should_check_earlier: string[];
  };
  counterfactual: {
    what_might_have_helped: string[];
    note: string;
  };
  data_quality: {
    known: string[];
    unknown: string[];
    fabrication_policy: string;
  };
  sources: { type: string; title: string; url: string; reliability: string; reason: string }[];
  graveyard_card: {
    headline: string;
    failure_reason: string;
    biggest_lesson: string;
    difficulty: string;
    founder_stage: string;
    worth_studying: boolean;
  };
}

const allEntries: GraveyardEntry[] = [
  ...(social as GraveyardEntry[]),
  ...(healtCareFailed as GraveyardEntry[]),
  ...(eduToolsFailed as GraveyardEntry[]),
  ...(eduSaas as GraveyardEntry[]),
  ...(devtools as GraveyardEntry[]),
];

export const graveyardRepository = {
  findAll: () => allEntries,

  findBySlug: (slug: string) =>
    allEntries.find((e) => e.slug === slug) || null,

  findByCategory: (category: string) =>
    allEntries.filter(
      (e) =>
        e.classification.primary_category === category ||
        e.classification.secondary_categories.includes(category),
    ),

  getCategories: () => {
    const cats = new Map<string, number>();
    for (const entry of allEntries) {
      const cat = entry.classification.primary_category;
      cats.set(cat, (cats.get(cat) || 0) + 1);
    }
    return Array.from(cats.entries()).map(([name, count]) => ({ name, count }));
  },

  getStats: () => {
    const total = allEntries.length;
    const categories = new Set(allEntries.map((e) => e.classification.primary_category)).size;
    const totalLessons = allEntries.reduce((sum, e) => sum + e.lessons.length, 0);
    const failureTypes = new Map<string, number>();
    for (const entry of allEntries) {
      const type = entry.classification.failure_type;
      failureTypes.set(type, (failureTypes.get(type) || 0) + 1);
    }
    return {
      total,
      categories,
      totalLessons,
      failureTypes: Array.from(failureTypes.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
    };
  },

  search: (query: string) => {
    const q = query.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.overview.one_liner.toLowerCase().includes(q) ||
        e.graveyard_card.headline.toLowerCase().includes(q) ||
        e.classification.primary_category.toLowerCase().includes(q) ||
        e.lessons.some(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.lesson.toLowerCase().includes(q),
        ),
    );
  },

  getFeatured: () =>
    allEntries.filter((e) => e.graveyard_card.worth_studying).slice(0, 5),
};
