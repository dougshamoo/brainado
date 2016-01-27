var TEST_DATA = {
  nodes: [
    {
      name: 'dog',
      group: 1,
    },
    {
      name: 'wolf',
      group: 2,
    },
    {
      name: 'fox',
      group: 3,
    },
    {
      name: 'hound',
      group: 4,
    },
    {
      name: 'canine',
      group: 5,
    },
  ],
  links: [
    {
      source: 0,
      target: 1,
      score: .5,
    },
    {
      source: 0,
      target: 2,
      score: 1,
    },
    {
      source: 0,
      target: 3,
      score: 1.5,
    },
    {
      source: 0,
      target: 4,
      score: 2,
    },
  ],
};

module.exports = TEST_DATA;
