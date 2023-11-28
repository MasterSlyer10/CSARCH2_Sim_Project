// Text Boxes
const memoryBlockInput = document.querySelector('#memoryBlockInput');


// Buttons
const sequentialSequenceButton = document.querySelector('#sequentialSequenceButton');
const randomSequenceButton = document.querySelector('#randomSequenceButton');
const midRepeatSequenceButton = document.querySelector('#midRepeatSequenceButton');
const runFinal = document.querySelector('#runFinal');

// Local variables
let sequence = [];


function generateSequentialSequence(numberOfMemoryBlocks) {
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

// Function to be called when user presses `Final` button on the page that will simulate the cache to its final state immediately
// 
function simulateCache() {

  // Initialize cache
  const cache = initializeCache();

  // Initialize variables to keep track of cache hits and misses
  let memoryAccessCount = 0;
  let cacheHitCount = 0;
  let cacheMissCount = 0;

  // Simulate cache access for each memory block in the sequence
  for (const memoryBlock of sequence) {
    console.log('Memory Block: ' + memoryBlock);
    memoryAccessCount++;
    const cacheBlock = getCacheBlock(cache, memoryBlock);

    if (cacheBlock !== null && cacheBlock.valid && cacheBlock.tag === memoryBlock) {
      // Cache hit
      console.log('Cache hit');
      console.log('Set: ' + memoryBlock % 4 + ' Block: ' + cacheBlock.tag % 8);
      cacheHitCount++;
    } else {
      // Cache miss
      console.log('Cache miss');
      cacheMissCount++;
      replaceCacheBlock(cache, memoryBlock);
      
    }
    console.log(cache);
  }


  // TO DO: ADD CODE TO CALCULATE THE OUTPUT I.E. CACHE HITS, MISSES, ETC.
}


// Function returns an array that will serve as our cache. The array is 4 x 8, 4 sets, 8 blocks. (4-way BSA)
// Function sets up object for each block in the cache.
// The object acts as a block in the cache and has the following properties:
// - valid: boolean value that determines if the block is valid or not
// - age: number that determines how long the block has been in the cache
// - tag: number that determines which memory block the cache block is storing
// If u have suggestions to change cache so that its a class instead just lmk.
class CacheBlock {
  constructor() {
    this.valid = false;
    this.age = 0;
    this.tag = null;
  }
}

function initializeCache() {
  const cache = [];
  for (let i = 0; i < 4; i++) {
    cache.push([]);
    for (let j = 0; j < 8; j++) {
      cache[i].push(new CacheBlock());
    }
  }
  return cache;
}

// Function returns the block object in the cache if it is found
// else it returns null
// Since cache is just a 2d array, we are just going to search each element until we find the block we are looking for.
function getCacheBlock(cache, memoryBlock) {
  const setIndex = memoryBlock % 4; // 4 sets in cache

  // check each block in the set to see if it matches the memory block we are looking for
  for (let i = 0; i < 8; i++) {
    console.log(i);
    // check if block has been used
    if (cache[setIndex][i].valid) {
      // check if block contains the memory block we are looking for
      if (cache[setIndex][i].tag === memoryBlock) {
        return cache[setIndex][i];
      }
    }
  }

  return null; //not found
}


// Called when memory block is not found in cache.
// Either places value in an empty block
// Or replaces value of oldest block
function replaceCacheBlock(cache, memoryBlock) {
  const setIndex = memoryBlock % 4; // 4 sets in cache
  const cacheSet = cache[setIndex];

  // sentinel value for checking
  let emptySlotIndex = -1;
  let maxAgeIndex = -1;
  let maxAge = -1;

  // check each block in the set
  for (let i = 0; i < cacheSet.length; i++) {
    // check if its an empty block
    if (!cacheSet[i].valid) {
      emptySlotIndex = i;
      break;
    }

    // check if its the oldest block
    if (cacheSet[i].age > maxAge) {
      maxAge = cacheSet[i].age;
      maxAgeIndex = i;
    }
  }

  // if there is an empty block, place value in empty block
  if (emptySlotIndex !== -1) {
    console.log("Placing memory block: " + memoryBlock);
    console.log("In: Set: " + setIndex + " Block: " + emptySlotIndex);
    cacheSet[emptySlotIndex].valid = true;
    cacheSet[emptySlotIndex].age = 0;
    cacheSet[emptySlotIndex].tag = memoryBlock;
    cacheSet[emptySlotIndex].data = [];

    // updates gui
    const cellIdStore = `${setIndex}-${emptySlotIndex}-store`;
    const cellIdAge = `${setIndex}-${emptySlotIndex}-age`;
    const cellStore = document.getElementById(cellIdStore);
    const cellAge = document.getElementById(cellIdAge);
    if (cellStore) {
      cellStore.textContent = cacheSet[emptySlotIndex].tag;
      cellAge.textContent = cacheSet[emptySlotIndex].age;
    }

    // increament age of all other blocks in set
    for (let i = 0; i < cacheSet.length; i++) {
      if (cacheSet[i].valid && i !== emptySlotIndex) {
        if (i !== emptySlotIndex ) {
          cacheSet[i].age++;
          
          // updates gui 
          const cellId = `${setIndex}-${i}-age`;
          const cell = document.getElementById(cellId);
          if (cell) {
            cell.textContent = cacheSet[i].age;
          }
        }
      }
    }
  } 
  // else replace oldest block
  else {
    console.log("Replacing memory block: " + cacheSet[maxAgeIndex].tag);
    console.log("In: Set: " + setIndex + " Block: " + maxAgeIndex);
    cacheSet[maxAgeIndex].age = 0;
    cacheSet[maxAgeIndex].tag = memoryBlock;
    cacheSet[maxAgeIndex].data = [];

    // updates gui
    const cellIdStore = `${setIndex}-${maxAgeIndex}-store`;
    const cellIdAge = `${setIndex}-${maxAgeIndex}-age`;
    const cellStore = document.getElementById(cellIdStore);
    const cellAge = document.getElementById(cellIdAge);
    if (cellStore) {
      cellStore.textContent = cacheSet[maxAgeIndex].tag;
      cellAge.textContent = cacheSet[maxAgeIndex].age;
    }

    // increment age of all other blocks in set
    for (let i = 0; i < cacheSet.length; i++) {
      if (i !== maxAgeIndex) {
        cacheSet[i].age++;

        // updates gui 
        const cellId = `${setIndex}-${i}-age`;
        const cell = document.getElementById(cellId);
        if (cell) {
          cell.textContent = cacheSet[i].age;
        }
      }
    }
  }
}


// Implement GUI updating
sequentialSequenceButton.addEventListener('click', function() {
  sequence = generateSequentialSequence(memoryBlockInput.value);
  let lineDiv = document.querySelector('#line');
  
  lineDiv.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    lineDiv.appendChild(aTag);
  });
});

randomSequenceButton.addEventListener('click', function() {
  sequence = generateRandomSequence(memoryBlockInput.value);
  let lineDiv = document.querySelector('#line');
  
  lineDiv.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    lineDiv.appendChild(aTag);
  });
});

midRepeatSequenceButton.addEventListener('click', function() {
  sequence = generateMidRepeatBlocks(memoryBlockInput.value);
  let lineDiv = document.querySelector('#line');
  
  lineDiv.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    lineDiv.appendChild(aTag);
  });
});

runFinal.addEventListener('click', function() {
  simulateCache();
});
