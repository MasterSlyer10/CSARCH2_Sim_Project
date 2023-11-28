class Cache {
    constructor(numBlocks, numWordsPerBlock,setsize) {
        this.numBlocks = numBlocks;
        this.setsize = setsize;
        this.numWordsPerBlock = numWordsPerBlock;
        this.cache = Array.from({length: numBlocks}, () => ({tag: null, data: new Array(numWordsPerBlock).fill(null)}));
        this.accessCount = 0;
        this.hitCount = 0;
        this.missCount = 0;
    }
    //remove this when adding to html use cache.access(blockNumber,wordNumber) instead just for checking the scritp
    nextStep(blockNumber, wordNumber) {
        console.log(`Accessing block ${blockNumber}, word ${wordNumber}`);
        let data = this.access(blockNumber, wordNumber);
        console.log(`Data: ${data}`);
        console.log(`Hit rate: ${this.getHitRate()}`);
        console.log(`Miss rate: ${this.getMissRate()}`);
    }

    access(blockNumber, wordNumber) {
        this.accessCount++;
        let setNumber = blockNumber % (this.numBlocks / 4);
        let tag = Math.floor(blockNumber / (this.numBlocks / 4));
        let setStartIndex = setNumber * 4;
        let set = this.cache.slice(setStartIndex, setStartIndex + 4);
        for (let i = 0; i < 4; i++) {
            if (set[i].tag === tag) {
                this.hitCount++;
                return set[i].data[wordNumber];
            }
        }
        this.missCount++;
        let blockToReplaceIndex = setStartIndex;  // replaces the first block in the set
        this.cache[blockToReplaceIndex] = {tag: tag, data: this.readBlockFromMemory(blockNumber)};
        return this.cache[blockToReplaceIndex].data[wordNumber];
    }
    
    readBlockFromMemory(blockNumber) {
        // Simulates reading a block from memory
        return new Array(this.numWordsPerBlock).fill(`Block ${blockNumber} data`);
    }

    getHitRate() {
        return this.hitCount / this.accessCount;
    }

    getMissRate() {
        return this.missCount / this.accessCount;
    }
}

//Test cases use cache.access(whateverparameters are being used by nextStep) 

let cache = new Cache(32, 16,4);
// Sequential sequence
// console.log("Sequential sequence:");
// for (let i = 0; i < setsize; i++) {
//     for (let j = 0; j < 2 * cache.numBlocks; j++) {
//         cache.nextStep(j, 0);
//     }
// }

// // Reset the cache
// cache = new Cache(32, 16);

// // Random sequence
// console.log("Random sequence:");
// for (let i = 0; i < setsize; i++) {
//     for (let j = 0; j < 4 * cache.numBlocks; j++) {
//         let blockNumber = Math.floor(Math.random() * 2 * cache.numBlocks);
//         cache.nextStep(blockNumber, 0);
//     }
// }

// Reset the cache
cache = new Cache(32, 16,4);

// Mid-repeat sequence
console.log("Mid-repeat sequence:");
for (let i = 0; i < cache.setsize; i++) {
    for (let j = 0; j < cache.numBlocks; j++) {
        if (j < cache.numBlocks / 2) {
            cache.nextStep(j, 0);
            if (j < cache.numBlocks / cache.setsize) {
                cache.nextStep(j, 0);
            }
        } else {
            cache.nextStep(j, 0);
        }
    }
}
