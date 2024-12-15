const fs = require('fs');

const filePath = './source.txt';
const data = fs.readFileSync(filePath, 'utf8');

const fragments = data
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

function findLargestSequence(fragments) {
  const startMap = new Map();
  const endMap = new Map();

  fragments.forEach((fragment) => {
    const start = fragment.slice(0, 2);
    const end = fragment.slice(-2);
    if (!startMap.has(start)) startMap.set(start, []);
    if (!endMap.has(end)) endMap.set(end, []);
    startMap.get(start).push(fragment);
    endMap.get(end).push(fragment);
  });

  const used = new Set();

  function buildSequence(current, chain) {
    const end = current.slice(-2);
    used.add(current);
    chain.push(current);

    const nextFragments = startMap.get(end) || [];
    for (const next of nextFragments) {
      if (!used.has(next)) {
        buildSequence(next, chain);
      }
    }
  }

  let longestSequence = '';

  fragments.forEach((fragment) => {
    if (!used.has(fragment)) {
      const chain = [];
      buildSequence(fragment, chain);

      const combinedSequence = chain.reduce((acc, frag, index) => {
        if (index === 0) return frag;
        return acc + frag.slice(2);
      }, '');

      if (combinedSequence.length > longestSequence.length) {
        longestSequence = combinedSequence;
      }
    }
  });

  return longestSequence;
}

const result = findLargestSequence(fragments);

console.log('Найбільша послідовність:', result);

fs.writeFileSync('./result.txt', result, 'utf8');
