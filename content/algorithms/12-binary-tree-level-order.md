---
title: "Binary Tree Level Order Traversal"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["tree", "bfs", "queue"]
source: "LeetCode #102"
---

## Question

Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

**Example:**
```
Input: root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

    3
   / \
  9  20
    /  \
   15   7

Level 0: [3]
Level 1: [9, 20]
Level 2: [15, 7]
```

## Hints

### Hint 1
Use a queue to process nodes level by level. This is a classic BFS pattern.

### Hint 2
The key trick: capture the queue size at the start of each level, then process exactly that many nodes.

### Hint 3
If you don't capture the size, the queue grows during the loop and you'll mix levels together.

## Answer

### Approach: BFS with Queue

**Intuition:**
Use a queue to process nodes level by level. The key insight is to process all nodes at current level before moving to next level.

```python
from collections import deque

def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        level_size = len(queue)  # Important: capture size before loop
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            # Add children for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result
```

**Time:** O(n) - visit each node once
**Space:** O(w) - max width of tree in queue

### Key Insight: Why `level_size = len(queue)`?

```python
# Without capturing size:
while queue:
    level = []
    for _ in range(len(queue)):  # ❌ Wrong! len(queue) changes in loop
        node = queue.popleft()
        level.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)

# Correct way:
while queue:
    level = []
    level_size = len(queue)  # ✅ Capture size of current level
    for _ in range(level_size):
        # ... process nodes
```

### Alternative: Recursive with Depth Tracking

```python
def levelOrder(root: Optional[TreeNode]) -> List[List[int]]:
    result = []
    
    def dfs(node, depth):
        if not node:
            return
        
        # Create new level if needed
        if depth == len(result):
            result.append([])
        
        # Add node to its level
        result[depth].append(node.val)
        
        # Recurse on children
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    
    dfs(root, 0)
    return result
```

**Time:** O(n)
**Space:** O(h) - recursion stack

**Note:** While this works, BFS is more natural for level-order traversal.

### Common Mistakes

1. **Not capturing level size:**
   ```python
   # Wrong:
   for _ in range(len(queue)):  # len changes during iteration!
   
   # Right:
   level_size = len(queue)
   for _ in range(level_size):
   ```

2. **Appending individual nodes instead of level list:**
   ```python
   # Wrong:
   result.append(node.val)  # Flat list
   
   # Right:
   level.append(node.val)
   result.append(level)  # List of lists
   ```

3. **Using DFS without depth tracking:** Can't group by level

### Variations and Follow-ups

#### Level Order Bottom-Up (LeetCode #107)
```python
# Just reverse the result
return result[::-1]
```

#### Zigzag Level Order (LeetCode #103)
```python
# Alternate direction each level
for i, level in enumerate(result):
    if i % 2 == 1:
        level.reverse()
```

#### Right Side View (LeetCode #199)
```python
# Take last element of each level
return [level[-1] for level in result]
```

### Visual Walkthrough

```
Tree: [3,9,20,null,null,15,7]

Initial: queue = [3], result = []

Step 1: level_size = 1
  Process 3: level = [3], queue = [9, 20]
  result = [[3]]

Step 2: level_size = 2
  Process 9: level = [9], queue = [20]
  Process 20: level = [9, 20], queue = [15, 7]
  result = [[3], [9, 20]]

Step 3: level_size = 2
  Process 15: level = [15], queue = [7]
  Process 7: level = [15, 7], queue = []
  result = [[3], [9, 20], [15, 7]]

Queue empty → return result
```

### Interview Tips

- **This is a fundamental BFS pattern** - master it well
- **Many tree problems are variations** of this
- **Explain the `level_size` trick** - shows attention to detail
- **Mention space complexity:** O(w) where w can be up to n/2 for complete binary tree

## Learning Resources

**Video:**
- [NeetCode - Binary Tree Level Order Traversal](https://www.youtube.com/watch?v=6ZnyEApgFYg)

**Related Problems:**
- Binary Tree Level Order Traversal II (LeetCode #107) - Bottom-up
- Binary Tree Zigzag Level Order Traversal (LeetCode #103)
- Binary Tree Right Side View (LeetCode #199)
- Average of Levels in Binary Tree (LeetCode #637)
