import type { StageName } from '$types';

export const prevStage = (stage: StageName, stages: StageName[]): StageName => {
  const index = stages.indexOf(stage);
  if (index === -1) throw new Error(`stage ${stage} not found`);
  if (index === 0) return stage;
  return stages[index - 1];
};

export const nextStage = (stage: StageName, stages: StageName[]): StageName => {
  const index = stages.indexOf(stage);
  if (index === -1) throw new Error(`stage ${stage} not found`);
  if (index === stages.length - 1) return stage;
  return stages[index + 1];
};

export const stagesTitles: Record<StageName, string> = {
  'personal-details': 'Personal details',
  address: 'Shipping address',
  shipping: 'Shipping method',
  review: 'Review',
};
