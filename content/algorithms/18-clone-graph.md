---
title: "Clone Graph"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["graph", "dfs", "bfs", "hash-table"]
source: "LeetCode #133"
---

## Question

Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.

Each node in the graph contains a value (`int`) and a list (`List[Node]`) of its neighbors.

```python
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
```

**Example:**
```
Input: adjList = [[2,4],[1,3],[2,4],[1,3]]

Graph:
  1 --- 2
  |     |
  4 --- 3

Output: [[2,4],[1,3],[2,4],[1,3]]
(A deep copy of the input graph)
```

## Hints

### Hint 1
You need to keep track of which nodes you've already cloned to avoid infinite loops. Think about what data structure helps with that.

### Hint 2
Use a hash map to map original nodes to their clones. This serves two purposes: avoiding duplicates and handling cycles.

### Hint 3
Add the node to your map BEFORE processing its neighbors. This prevents infinite recursion when there are cycles.

## Answer

### Approach 1: DFS with HashMap

**Intuition:**
- Use a hash map to store mapping from original node to cloned node
- DFS through the graph, cloning nodes and their neighbors
- Hash map prevents infinite loops and duplicate cloning

```python
def cloneGraph(node: 'Node') -> 'Node':
    if not node:
        return None
    
    # Map original node to cloned node
    cloned = {}
    
    def dfs(node):
        # If already cloned, return the clone
        if node in cloned:
            return cloned[node]
        
        # Create clone of current node
        clone = Node(node.val)
        cloned[node] = clone  # Add to map immediately to handle cycles
        
        # Clone all neighbors
        for neighbor in node.neighbors:
            clone.neighbors.append(dfs(neighbor))
        
        return clone
    
    return dfs(node)
```

**Time:** O(N + E) where N = nodes, E = edges (visit each node and edge once)
**Space:** O(N) for hash map and recursion stack

**Why add to map before processing neighbors?**
```
Consider cycle: 1 <-> 2

Without early adding:
dfs(1) → create clone1
  dfs(2) → create clone2
    dfs(1) → create clone1 again! ❌ Infinite recursion

With early adding:
dfs(1) → create clone1, add to map
  dfs(2) → create clone2, add to map
    dfs(1) → already in map, return clone1 ✅
```

### Approach 2: BFS with HashMap

**Intuition:**
Same idea but use queue instead of recursion.

```python
from collections import deque

def cloneGraph(node: 'Node') -> 'Node':
    if not node:
        return None
    
    # Map original node to cloned node
    cloned = {node: Node(node.val)}
    queue = deque([node])
    
    while queue:
        curr = queue.popleft()
        
        # Process all neighbors
        for neighbor in curr.neighbors:
            if neighbor not in cloned:
                # Clone neighbor and add to queue
                cloned[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            
            # Add cloned neighbor to current clone's neighbors
            cloned[curr].neighbors.append(cloned[neighbor])
    
    return cloned[node]
```

**Time:** O(N + E)
**Space:** O(N)

### Step-by-Step Walkthrough (DFS)

```
Graph: 1 -- 2
       |    |
       4 -- 3

Initial: cloned = {}

dfs(1):
  clone1 = Node(1)
  cloned = {1: clone1}
  Process neighbors [2, 4]:
  
  dfs(2):
    clone2 = Node(2)
    cloned = {1: clone1, 2: clone2}
    Process neighbors [1, 3]:
    
    dfs(1):
      Already in cloned, return clone1 ✅
    
    dfs(3):
      clone3 = Node(3)
      cloned = {1: clone1, 2: clone2, 3: clone3}
      Process neighbors [2, 4]:
      
      dfs(2):
        Already in cloned, return clone2 ✅
      
      dfs(4):
        clone4 = Node(4)
        cloned = {1: clone1, 2: clone2, 3: clone3, 4: clone4}
        Process neighbors [1, 3]:
        
        dfs(1): return clone1 ✅
        dfs(3): return clone3 ✅
      
      clone3.neighbors = [clone2, clone4]
      return clone3
    
    clone2.neighbors = [clone1, clone3]
    return clone2
  
  dfs(4):
    Already in cloned, return clone4 ✅
  
  clone1.neighbors = [clone2, clone4]
  return clone1

Result: Fully cloned graph with all connections preserved
```

### Common Mistakes

1. **Not handling empty input:**
   ```python
   if not node:  # ✅ Always check
       return None
   ```

2. **Creating new nodes in loop without checking:**
   ```python
   # Wrong:
   for neighbor in node.neighbors:
       clone.neighbors.append(Node(neighbor.val))  # ❌ Creates duplicate nodes
   
   # Right:
   for neighbor in node.neighbors:
       clone.neighbors.append(dfs(neighbor))  # ✅ Reuses cloned nodes
   ```

3. **Adding to map after processing neighbors:**
   ```python
   # Wrong:
   clone = Node(node.val)
   for neighbor in node.neighbors:
       clone.neighbors.append(dfs(neighbor))
   cloned[node] = clone  # ❌ Too late! May cause infinite recursion
   
   # Right:
   clone = Node(node.val)
   cloned[node] = clone  # ✅ Add immediately
   for neighbor in node.neighbors:
       clone.neighbors.append(dfs(neighbor))
   ```

4. **Shallow copy instead of deep copy:**
   ```python
   # Wrong:
   clone.neighbors = node.neighbors  # ❌ Shallow copy, shares references
   
   # Right:
   for neighbor in node.neighbors:
       clone.neighbors.append(dfs(neighbor))  # ✅ Deep copy
   ```

### Edge Cases

```python
# Empty graph
node = None → None

# Single node, no neighbors
node = Node(1, []) → Node(1, [])

# Two nodes connected
1 -- 2 → Clone with connection preserved

# Cycle
1 <-> 2 → Clone with cycle preserved

# Complete graph
All nodes connected to all others → All connections preserved
```

### Follow-up Questions

**Q: What if the graph is disconnected?**
A: We're only cloning the connected component containing the input node. Other components are not accessible.

**Q: What if nodes have additional properties (not just val and neighbors)?**
A: Copy all properties when creating the clone:
```python
clone = Node(node.val)
clone.property1 = node.property1
clone.property2 = node.property2
```

**Q: Can you clone without modifying the Node class?**
A: Yes, we're not modifying it - just using the existing structure.

**Q: What if we want to clone a directed graph?**
A: Same algorithm works! The direction is implicit in the neighbors list.

### DFS vs BFS: Which to Choose?

| Aspect | DFS | BFS |
|--------|-----|-----|
| Code simplicity | Simpler (recursive) | More code (queue) |
| Space | Stack depth | Queue size |
| When to use | **Default choice** | When order matters |

**Interview recommendation:** Start with DFS unless specifically asked for BFS.

### Interview Tips

- **Explain the hash map purpose:** "To map original to clone and avoid cycles"
- **Mention the cycle handling:** "Adding to map before neighbors prevents infinite recursion"
- **Draw small example:** Show how cycles are handled
- **Discuss deep vs shallow copy:** Shows understanding
- **Walk through the algorithm:** Trace execution on a small graph

**Key insight:** "This combines graph traversal with memoization. The hash map serves as both a visited set and a clone store."

## Learning Resources

**Video:**
- [NeetCode - Clone Graph](https://www.youtube.com/watch?v=mQeF6bN8hMk)

**Related Problems:**
- Copy List with Random Pointer (LeetCode #138) - similar deep copy concept
- Clone Binary Tree With Random Pointer (LeetCode #1485)
- Clone N-ary Tree (LeetCode #1490)
