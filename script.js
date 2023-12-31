// Divs
const line = document.querySelector('#line');

// Text Boxes
const memoryBlockInput = document.querySelector('#memoryBlockInput');


// Buttons
const sequentialSequenceButton = document.querySelector('#sequentialSequenceButton');
const randomSequenceButton = document.querySelector('#randomSequenceButton');
const midRepeatSequenceButton = document.querySelector('#midRepeatSequenceButton');
const runStep = document.querySelector('#runStep');
const runFinal = document.querySelector('#runFinal');
const clearCache = document.querySelector('#clearCache');

// Local variables
let sequence = [];
let memoryAccessCount = 0;
let cacheHitCount = 0;
let cacheMissCount = 0;
let cacheHitRate;
let cacheMissRate; 
let cacheHitTime = 1; // Adjust this based on your system's characteristics
let cacheMissPenalty = 10; // Adjust this based on your system's characteristics
let cache = [];

// window.addEventListener('load', initializeCache());


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
    // random value between 0 and 4 * numberOfMemoryBlocks
    sequence.push(Math.floor(Math.random() * (4 * numberOfMemoryBlocks)));
  }

  return sequence;
}

function generateMidRepeatBlocks(numberOfMemoryBlocks) {
  const sequence = [];
  for (let i = 0; i < 4 * (2 * numberOfMemoryBlocks); i++) {
    // check if i is neither equal to to 0 or numberofMemoryBlocks - 1.
    if (i % (2 * numberOfMemoryBlocks) > 0 && i % (2 * numberOfMemoryBlocks) < (numberOfMemoryBlocks - 1)) {
      // when true we go ahead and add the sequence of numbers from 1 to numberOfMemoryBlocks - 2, 2 times.
      for (let j = 0; j < (numberOfMemoryBlocks - 2) * 2; j++) {
        sequence.push((j % (numberOfMemoryBlocks - 2)) + 1);
      }
      // sets i to numberOfMemoryBlcosk so that we can continue the sequence. and not enther this if condition again until much later.
      i = i + numberOfMemoryBlocks - 3;
    } else {
      sequence.push(i % (2 * numberOfMemoryBlocks));
    }
  }

  return sequence;
}

// Function to be called when user presses `Final` button on the page that will simulate the cache to its final state immediately
// 
function fullSimulateCache() {
  if (cache.length === 0) {
    initializeCache();
  }
  sequenceLength = sequence.length;
  for (i = 0; i < sequenceLength; i++) {
    stepSimulateCache();
  }

  


  updateValues();
}

function updateValues(){
  const cacheHitRate = (cacheHitCount / memoryAccessCount) * 100;
  const cacheMissRate = (cacheMissCount / memoryAccessCount) * 100;
  const averageMemoryAccessTime = calculateAverageMemoryAccessTime(cacheHitRate, cacheMissRate,cacheHitTime);
  const totalMemoryAccessTime = memoryAccessCount * averageMemoryAccessTime
  document.getElementById('memoryAccessCount').textContent = memoryAccessCount;
  document.getElementById('cacheHit').textContent = cacheHitCount;
  document.getElementById('cacheMiss').textContent = cacheMissCount;
  document.getElementById('cacheHitRate').textContent = cacheHitRate.toFixed(2) + '%';
  document.getElementById('cacheMissRate').textContent = cacheMissRate.toFixed(2) + '%';
  document.getElementById('avgMemorryAccessTime').textContent = averageMemoryAccessTime + ' time units';
  document.getElementById('totalMemorryAccessTime').textContent = totalMemoryAccessTime + ' time units';
}

  

function calculateAverageMemoryAccessTime(cacheHitRate, cacheMissRate,cacheHitTime) {
  const averageMemoryAccessTime = (cacheHitCount/memoryAccessCount) * cacheHitTime + (cacheMissCount/memoryAccessCount) * cacheMissPenalty;

  return averageMemoryAccessTime;
}

function clearCellColors() {

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      const cellIdBlock = `${i}-${j}-block`;
      const cellIdAge = `${i}-${j}-age`;
      const cellIdStore = `${i}-${j}-store`;
      const cellBlock = document.getElementById(cellIdBlock);
      const cellAge = document.getElementById(cellIdAge);
      const cellStore = document.getElementById(cellIdStore);

      cellBlock.style.backgroundColor = '#D9D9D9';
      cellAge.style.backgroundColor = '#D9D9D9';
      cellStore.style.backgroundColor = '#D9D9D9';
    }
  } 
}


function stepSimulateCache() {
  if (cache.length === 0) {
    initializeCache();
  }
  const memoryBlock = sequence.shift();
  clearCellColors();

  console.log('Memory Block: ' + memoryBlock);
  memoryAccessCount++;
  const cacheBlock = getCacheBlock(cache, memoryBlock);    
  if (cacheBlock !== null && cacheBlock.valid && cacheBlock.tag === memoryBlock) {
    // Cache hit
    console.log('Cache hit');
    console.log('Set: ' + memoryBlock % 8 + ' Block: ' + cacheBlock.tag % 4);
    cacheHitCount++;
    const hitCell = document.querySelector('#hit');
    hitCell.textContent += (hitCell.textContent ? ', ' : '') + memoryBlock;
  } else {
    // Cache miss
    console.log('Cache miss');
    cacheMissCount++;
    replaceCacheBlock(cache, memoryBlock);
    const missCell = document.querySelector('#miss');
    missCell.textContent += (missCell.textContent ? ', ' : '') + memoryBlock;
    
  }
  updateValues();
  console.log(cache);

  //updating parts gui
  let currentLinePosition = window.getComputedStyle(line).getPropertyValue('left');
  currentLinePosition = parseInt(currentLinePosition);
  line.style.left = (currentLinePosition - 40) + 'px';
}


// Function returns an array that will serve as our cache. The array is 8 x 4, 8 sets, 4 blocks. (4-way BSA)
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
  cache = [];
  for (let i = 0; i < 8; i++) {
    cache.push([]);
    for (let j = 0; j < 4; j++) {
      cache[i].push(new CacheBlock());
    }
  }
}

// Function returns the block object in the cache if it is found
// else it returns null
// Since cache is just a 2d array, we are just going to search each element until we find the block we are looking for.
function getCacheBlock(cache, memoryBlock) {
  const setIndex = memoryBlock % 8; // 8 sets in cache

  // check each block in the set to see if it matches the memory block we are looking for
  for (let i = 0; i < 4; i++) {
    // check if block has been used
    if (cache[setIndex][i].valid) {
      // check if block contains the memory block we are looking for
      if (cache[setIndex][i].tag === memoryBlock) {
        const cellIdBlock = `${setIndex}-${i}-block`;
        const cellIdAge = `${setIndex}-${i}-age`;
        const cellIdStore = `${setIndex}-${i}-store`;
        const cellBlock = document.getElementById(cellIdBlock);
        const cellAge = document.getElementById(cellIdAge);
        const cellStore = document.getElementById(cellIdStore);

        cellBlock.style.backgroundColor = 'lightgreen';
        cellAge.style.backgroundColor = 'lightgreen';
        cellStore.style.backgroundColor = 'lightgreen';

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
  const setIndex = memoryBlock % 8; // 8 sets in cache
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
    const cellIdBlock = `${setIndex}-${emptySlotIndex}-block`;
    const cellIdStore = `${setIndex}-${emptySlotIndex}-store`;
    const cellIdAge = `${setIndex}-${emptySlotIndex}-age`;
    const cellBlock = document.getElementById(cellIdBlock);
    const cellStore = document.getElementById(cellIdStore);
    const cellAge = document.getElementById(cellIdAge);
    if (cellStore) {
      cellBlock.style.backgroundColor = 'lightsalmon';
      cellAge.style.backgroundColor = 'lightsalmon';
      cellStore.style.backgroundColor = 'lightsalmon';
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
    const cellIdBlock = `${setIndex}-${maxAgeIndex}-block`;
    const cellIdStore = `${setIndex}-${maxAgeIndex}-store`;
    const cellIdAge = `${setIndex}-${maxAgeIndex}-age`;
    const cellBlock = document.getElementById(cellIdBlock);
    const cellStore = document.getElementById(cellIdStore);
    const cellAge = document.getElementById(cellIdAge);
    if (cellStore) {
      cellBlock.style.backgroundColor = 'lightcoral';
      cellAge.style.backgroundColor = 'lightcoral';
      cellStore.style.backgroundColor = 'lightcoral';

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

function resetLinePosition() {
  line.style.left = 'calc(50% - 20px)';
}


// Implement GUI updating
sequentialSequenceButton.addEventListener('click', function() {
  sequence = generateSequentialSequence(memoryBlockInput.value);
  
  line.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    line.appendChild(aTag);
  });
  resetLinePosition();
});

randomSequenceButton.addEventListener('click', function() {
  sequence = generateRandomSequence(memoryBlockInput.value);

  
  line.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    line.appendChild(aTag);
  });
  resetLinePosition();
});

midRepeatSequenceButton.addEventListener('click', function() {
  sequence = generateMidRepeatBlocks(memoryBlockInput.value);
  
  line.innerHTML = '';
  sequence.forEach(function(element) {
    let aTag = document.createElement('a');
    aTag.textContent = element;
    line.appendChild(aTag);
  });
  resetLinePosition();
});

runStep.addEventListener('click', function() {
  stepSimulateCache();
})

runFinal.addEventListener('click', function() {
  fullSimulateCache();
});



clearCache.addEventListener('click', function() {
  cache = [];

  memoryAccessCount = 0;
  cacheHitCount = 0;
  cacheMissCount = 0;

  clearCellColors();
  const hitCell = document.querySelector('#hit');
  hitCell.textContent = '';
  const missCell = document.querySelector('#miss');
  missCell.textContent = '';

  for (let set = 0; set < 8; set++) {
    for (let block = 0; block < 4; block++) {
      const td = document.getElementById(`${set}-${block}-age`);
      if (td) {
        td.textContent = '';
      }
      const storeTd = document.getElementById(`${set}-${block}-store`);
      if (storeTd) {
        storeTd.textContent = '';
      }
    }
  }
  updateValues();
});
