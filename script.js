function generateSequentialSequence(numOfMemoryBlocks) {
  const sequence = [];
  for (let i = 0; i < 4 * (2 * numberOfMemoryBlocks); i++) {
    sequence.push(i % (2 * numberOfMemoryBlocks));
  }

  return sequence;
}

function generateRandomSequence(numberOfMemoryBlocks) {
  const sequence = [];
  for (let i = 0; i < 4 * numberOfMemoryBlocks; i++) {
    sequence.push(Math.floor(Math.random() * (4 * numberOfMemoryBlocks)));
  }

  return sequence;
}

function generateMidRepeatBlocks(numberOfMemoryBlocks) {
  const sequence = [];
  for (let i = 0; i < 4 * (2 * numberOfMemoryBlocks); i++) {
    if (i % (2 * numberOfMemoryBlocks) > 0 && i % (2 * numberOfMemoryBlocks) < (numberOfMemoryBlocks - 1)) {
      for (let j = 0; j < (numberOfMemoryBlocks - 2) * 2; j++) {
        sequence.push((j % (numberOfMemoryBlocks - 2)) + 1);
      }
      i = i + numberOfMemoryBlocks - 3;
    } else {
      sequence.push(i % (2 * numberOfMemoryBlocks));
    }
  }

  return sequence;
}