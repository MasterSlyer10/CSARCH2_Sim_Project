# Cache Simulation System
This repository contains a cache simulation system implemented in JavaScript. The system is designed to simulate the behavior of a cache memory with a 4-way set-associative (4-way BSA) architecture.The cache simulation system includes functions for initializing the cache, simulating cache behavior, updating cache values, and calculating cache hit rate, cache miss rate, average memory access time, and total memory access time. The cache is represented as a 4 x 8 array, with each block in the cache having properties such as validity, age, and tag.
The system also includes a graphical user interface (GUI) for interacting with the cache simulation, such as buttons for running the simulation, clearing the cache, and updating the cache values.

## Cache Specifications

- **Cache Organization:** 4 sets, each containing 8 blocks (4 x 8).
- **Replacement Policy:** FIFO (First In, First Out).
- **Read Policy:** Non load-through.

## Running the Simulation

1. Open `index.html` in a web browser.
2. Use the "Sequential Sequence," "Random Sequence," and "Mid-Repeat Blocks" buttons to generate sequences.
3. Use the "Run Step" and "Run Final" buttons to simulate the cache behavior.
4. View the results in the browser console.

The simulation calculates the following metrics:

- Memory Access Count
- Cache Hit Count
- Cache Miss Count
- Cache Hit Rate
- Cache Miss Rate
- Average Memory Access Time
- Total Memory Access Time

These metrics provide insights into the cache's performance and efficiency under different access patterns.

## Test Case Analysis

### a) Sequential Sequence

The cache should exhibit a high hit rate in this scenario, as the access pattern is sequential and repeated. The age of blocks in the cache should increase gradually, and cache misses should be minimal.

