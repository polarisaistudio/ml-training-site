---
title: "Same Tree"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["tree", "dfs", "recursion"]
source: "LeetCode #100"
---

## Question

Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.

**Example:**
```
Input: p = [1,2,3], q = [1,2,3]
Output: true

  1       1
 / \     / \
2   3   2   3

Input: p = [1,2], q = [1,null,2]
Output: false

  1       1
 /         \
2           2
```

## Hints

### Hint 1
Think about the base cases first: what if both trees are empty? What if only one is empty?

### Hint 2
If both roots have the same value, the trees are the same if their left and right subtrees are also the same.

### Hint 3
Use recursion to check both the left and right subtrees.

## Answer

### Approach: Recursive Comparison

**Intuition:**
Two trees are the same if:
1. Both roots have the same value
2. Their left subtrees are the same
3. Their right subtrees are the same

```python
def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    # Base case: both empty
    if not p and not q:
        return True
    
    # One empty, one not
    if not p or not q:
        return False
    
    # Different values
    if p.val != q.val:
        return False
    
    # Check left and right subtrees
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

**Simplified version:**
```python
def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    # Both None
    if not p and not q:
        return True
    
    # One None or different values
    if not p or not q or p.val != q.val:
        return False
    
    # Recurse on children
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

**Time:** O(min(n, m)) - where n, m are sizes of the two trees
**Space:** O(min(h₁, h₂)) - recursion stack depth

### Approach 2: Iterative BFS

```python
from collections import deque

def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    queue = deque([(p, q)])
    
    while queue:
        node1, node2 = queue.popleft()
        
        # Both None
        if not node1 and not node2:
            continue
        
        # One None or different values
        if not node1 or not node2 or node1.val != node2.val:
            return False
        
        # Add children to queue
        queue.append((node1.left, node2.left))
        queue.append((node1.right, node2.right))
    
    return True
```

**Time:** O(min(n, m))
**Space:** O(min(w₁, w₂)) - queue size

### Common Mistakes

1. **Not handling both None case first:** Logic becomes complex
2. **Using `or` instead of `and`:** Both subtrees must match
3. **Forgetting to check values:** Structure alone isn't enough

### Edge Cases

```python
# Both empty trees
p = None, q = None → True

# One empty
p = [1], q = None → False

# Different structures
p = [1,2], q = [1,null,2] → False

# Same structure, different values
p = [1,2], q = [1,3] → False
```

### Follow-up Questions

- Check if tree is symmetric? (Mirror image)
- Check if one tree is subtree of another?
- What if values can be floating point? (Use epsilon comparison)

## Learning Resources

**Video:**
- [NeetCode - Same Tree](https://www.youtube.com/watch?v=vRbbcKXCxOw)

**Related Problems:**
- Symmetric Tree (LeetCode #101)
- Subtree of Another Tree (LeetCode #572)
