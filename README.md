# Cache Simulation System
This repository contains a cache simulation system implemented in JavaScript. The system is designed to simulate the behavior of a cache memory with a 4-way set-associative (4-way BSA) architecture.

## Cache Specifications

- **Cache Organization:** 4 sets, each containing 8 blocks (4 x 8).
- **Replacement Policy:** LRU (Least Recently Used).
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
