---
title: "Maximum Depth of Binary Tree"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["tree", "dfs", "recursion"]
source: "LeetCode #104"
---

## Question

Given the `root` of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

**Example:**
```
Input: root = [3,9,20,null,null,15,7]
Output: 3

    3
   / \
  9  20
    /  \
   15   7
```

## Answer

### Approach 1: Recursive DFS (Most Intuitive)

**Intuition:**
The depth of a tree is 1 + the maximum depth of its subtrees.

```python
def maxDepth(root: Optional[TreeNode]) -> int:
    # Base case: empty tree has depth 0
    if not root:
        return 0
    
    # Recursive case: 1 + max of left and right subtree depths
    left_depth = maxDepth(root.left)
    right_depth = maxDepth(root.right)
    
    return 1 + max(left_depth, right_depth)
```

**Simplified version:**
```python
def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

**Time:** O(n) - visit each node once
**Space:** O(h) - recursion stack, where h is height

### Approach 2: Iterative BFS (Level Order)

```python
from collections import deque

def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    
    queue = deque([root])
    depth = 0
    
    while queue:
        depth += 1
        # Process entire level
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return depth
```

**Time:** O(n)
**Space:** O(w) - where w is max width of tree

### Approach 3: Iterative DFS (Using Stack)

```python
def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    
    stack = [(root, 1)]  # (node, depth)
    max_depth = 0
    
    while stack:
        node, depth = stack.pop()
        max_depth = max(max_depth, depth)
        
        if node.left:
            stack.append((node.left, depth + 1))
        if node.right:
            stack.append((node.right, depth + 1))
    
    return max_depth
```

**Time:** O(n)
**Space:** O(h)

### Common Mistakes

1. **Forgetting base case:** Returns error on empty tree
2. **Off-by-one error:** Forgetting to add 1 for current node
3. **Confusing depth vs height:** In this problem they're the same

### Which Approach to Use in Interview?

- **Start with recursive:** Simplest and most intuitive
- **Interviewer asks for iterative?** Show BFS approach
- **Follow-up on space complexity?** Discuss trade-offs

### Follow-up Questions

- What's the minimum depth? (Shortest path to a leaf)
- What if we need to return the path? (Store parent pointers)
- How to handle extremely deep trees? (Iterative to avoid stack overflow)

## Learning Resources

**Video:**
- [NeetCode - Maximum Depth of Binary Tree](https://www.youtube.com/watch?v=hTM3phVI6YQ)

**Articles:**
- [LeetCode Official Solution](https://leetcode.com/problems/maximum-depth-of-binary-tree/solution/)

**Related Problems:**
- Minimum Depth of Binary Tree (LeetCode #111)
- Balanced Binary Tree (LeetCode #110)
- Diameter of Binary Tree (LeetCode #543)
