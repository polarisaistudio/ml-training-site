---
title: "Number of Islands"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["graph", "dfs", "bfs", "matrix"]
source: "LeetCode #200"
---

## Question

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

**Example:**
```
Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

## Answer

### Approach 1: DFS (Recursive)

**Intuition:**
- Iterate through the grid
- When we find a '1', increment island count
- Use DFS to mark all connected '1's as visited (change to '0')
- Continue scanning for next unvisited '1'

```python
def numIslands(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        # Boundary check and water check
        if (r < 0 or r >= rows or 
            c < 0 or c >= cols or 
            grid[r][c] == '0'):
            return
        
        # Mark as visited
        grid[r][c] = '0'
        
        # Explore 4 directions
        dfs(r + 1, c)  # down
        dfs(r - 1, c)  # up
        dfs(r, c + 1)  # right
        dfs(r, c - 1)  # left
    
    # Scan the grid
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)  # Mark entire island
    
    return islands
```

**Time:** O(m x n) - visit each cell once
**Space:** O(m x n) - recursion stack in worst case (entire grid is one island)

### Approach 2: BFS (Iterative)

**Intuition:**
Same idea but use queue instead of recursion.

```python
from collections import deque

def numIslands(grid: List[List[str]]) -> int:
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = '0'  # Mark as visited
        
        while queue:
            row, col = queue.popleft()
            
            # Explore 4 directions
            directions = [(1,0), (-1,0), (0,1), (0,-1)]
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                
                if (0 <= nr < rows and 
                    0 <= nc < cols and 
                    grid[nr][nc] == '1'):
                    queue.append((nr, nc))
                    grid[nr][nc] = '0'  # Mark immediately to avoid duplicates
    
    # Scan the grid
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                bfs(r, c)
    
    return islands
```

**Time:** O(m x n)
**Space:** O(min(m, n)) - queue size in worst case

### Visual Walkthrough (DFS)

```
Grid:
1 1 0
1 0 0
0 0 1

Scan (0,0): find '1'
  islands = 1
  DFS from (0,0):
    Mark (0,0) -> 0
    Explore down: (1,0) is '1', recurse
      Mark (1,0) -> 0
      Explore all directions from (1,0)
    Explore right: (0,1) is '1', recurse
      Mark (0,1) -> 0
      ...
  
Grid after first DFS:
0 0 0
0 0 0
0 0 1

Scan (2,2): find '1'
  islands = 2
  DFS from (2,2):
    Mark (2,2) -> 0

Final: islands = 2
```

### Common Mistakes

1. **Not marking cells as visited immediately:**
   ```python
   # Wrong (BFS):
   if grid[nr][nc] == '1':
       queue.append((nr, nc))
   # Later: grid[nr][nc] = '0'  # May add duplicate to queue
   
   # Right:
   if grid[nr][nc] == '1':
       grid[nr][nc] = '0'  # Mark immediately
       queue.append((nr, nc))
   ```

2. **Boundary check order matters:**
   ```python
   # Wrong:
   if grid[r][c] == '0' or r < 0 or r >= rows:  # May access out of bounds
   
   # Right:
   if r < 0 or r >= rows or grid[r][c] == '0':  # Check bounds first
   ```

3. **Forgetting to increment island count:**
   ```python
   if grid[r][c] == '1':
       islands += 1  # Don't forget this!
       dfs(r, c)
   ```

4. **Modifying grid vs using visited set:**
   ```python
   # If you can't modify grid:
   visited = set()
   
   def dfs(r, c):
       if (r, c) in visited:
           return
       visited.add((r, c))
       # ...
   ```

### Edge Cases

```python
# Empty grid
grid = [] -> 0

# All water
grid = [["0","0"],["0","0"]] -> 0

# All land
grid = [["1","1"],["1","1"]] -> 1

# Single cell
grid = [["1"]] -> 1

# Diagonal islands (not connected)
grid = [["1","0"],["0","1"]] -> 2
```

### Follow-up Questions

**Q: What if we can't modify the input grid?**
A: Use a visited set to track explored cells.

**Q: What if diagonal connections also count as adjacent?**
A: Add 4 more directions: `[(1,1), (1,-1), (-1,1), (-1,-1)]`

**Q: What if the grid is very large and doesn't fit in memory?**
A: Process in chunks, keep track of boundary connections.

**Q: What if grid values can be anything, not just '0' and '1'?**
A: Adjust the condition from `grid[r][c] == '1'` to check for specific values.

### When to Use Each Approach

| Approach | When to Use |
|----------|-------------|
| **DFS** | Default choice - clean, easy to code |
| **BFS** | When you need to track distance/levels |
| **Union-Find** | When follow-up asks about dynamic connections |

### Interview Tips

- **Start with DFS** - most intuitive
- **Explain the modification:** "I'm marking visited cells as '0'"
- **Mention space complexity:** Recursion stack vs queue
- **Draw small example** on whiteboard
- **Discuss trade-offs:** DFS simpler, BFS better for level tracking

**Key insight to mention:** "This is a classic connected components problem. Each island is a connected component in an implicit graph."

## Learning Resources

**Video:**
- [NeetCode - Number of Islands](https://www.youtube.com/watch?v=pV2kpPD66nE)

**Articles:**
- [LeetCode Official Solution](https://leetcode.com/problems/number-of-islands/solution/)

**Related Problems:**
- Number of Islands II (LeetCode #305) - with Union-Find
- Max Area of Island (LeetCode #695) - track size
- Surrounded Regions (LeetCode #130) - similar DFS/BFS
- Pacific Atlantic Water Flow (LeetCode #417)
