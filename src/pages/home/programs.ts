export type ProgramItem = { name: string; ages: string[] };
export type SeasonOffering = { label: string; items: ProgramItem[] };

export const programs: SeasonOffering[] = [
  {
    label: 'Spring',
    items: [
      { name: 'T-Ball', ages: ['3–4'] },
      { name: 'T-Shirt', ages: ['5–6'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
    ],
  },
  {
    label: 'Fall',
    items: [
      { name: 'Soccer', ages: ['6U', '8U'] },
      { name: 'Baseball', ages: ['8U', '10U', '12U'] },
      { name: 'Softball', ages: ['8U', '10U', '12U'] },
      { name: 'Volleyball', ages: ['10U', '12U'] },
    ],
  },
  {
    label: 'Winter',
    items: [{ name: 'Basketball', ages: ['6U', '8U', '10U', '12U', '15U'] }],
  },
];
