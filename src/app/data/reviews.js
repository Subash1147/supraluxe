const base = {
  'm-1001': [
    {
      id: 'r-1',
      name: 'Aman',
      rating: 5,
      title: 'Perfect everyday layer',
      body: 'Quality feels premium for the price. Fits relaxed without looking baggy.',
      date: '2026-04-18',
      verified: true,
    },
    {
      id: 'r-2',
      name: 'Rohit',
      rating: 4,
      title: 'Nice color and fabric',
      body: 'The olive shade looks great. Sleeves are slightly long but overall solid.',
      date: '2026-03-06',
      verified: true,
    },
  ],
  'm-1002': [
    {
      id: 'r-3',
      name: 'Siddharth',
      rating: 4,
      title: 'Great denim stretch',
      body: 'Comfortable around the waist and holds shape well after a few wears.',
      date: '2026-02-22',
      verified: true,
    },
  ],
  'w-2001': [
    {
      id: 'r-4',
      name: 'Nisha',
      rating: 5,
      title: 'Looks expensive',
      body: 'The satin drape is beautiful. Got compliments instantly.',
      date: '2026-04-02',
      verified: true,
    },
    {
      id: 'r-5',
      name: 'Riya',
      rating: 4,
      title: 'Lovely fit',
      body: 'True to size. Color is slightly deeper than the photos, but I like it.',
      date: '2026-01-28',
      verified: false,
    },
  ],
}

export function getReviewsByProductId(productId) {
  return base[productId] || []
}

