---
title: "Invert Binary Tree"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["tree", "dfs", "recursion"]
source: "LeetCode #226"
---

## Question

Given the `root` of a binary tree, invert the tree, and return its root.

Inverting means swapping the left and right children of all nodes.

**Example:**
```
Input: root = [4,2,7,1,3,6,9]
Output: [4,7,2,9,6,3,1]

Before:          After:
    4              4
   / \            / \
  2   7          7   2
 / \ / \        / \ / \
1  3 6  9      9  6 3  1
```

**Fun fact:** This is the famous problem that Max Howell (creator of Homebrew) allegedly couldn't solve in a Google interview.

## Hints

### Hint 1
Think recursively: to invert a tree, swap its children, then invert each subtree.

### Hint 2
You can swap the children before or after recursing - both work!

### Hint 3
Be careful with Python's tuple unpacking for swapping: `root.left, root.right = root.right, root.left`

## Answer

### Approach 1: Recursive (Simplest)

**Intuition:**
To invert a tree:
1. Swap left and right children of current node
2. Recursively invert left subtree
3. Recursively invert right subtree

```python
def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    # Base case
    if not root:
        return None
    
    # Swap children
    root.left, root.right = root.right, root.left
    
    # Recursively invert subtrees
    invertTree(root.left)
    invertTree(root.right)
    
    return root
```

**Alternative (post-order):**
```python
def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    
    # Invert subtrees first
    left = invertTree(root.left)
    right = invertTree(root.right)
    
    # Then swap
    root.left = right
    root.right = left
    
    return root
```

**Time:** O(n) - visit each node once
**Space:** O(h) - recursion stack

### Approach 2: Iterative BFS

```python
from collections import deque

def invertTree(root: Optional[TreeNode]) -> Optional[TreeNode]:
    if not root:
        return None
    
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        # Swap children
        node.left, node.right = node.right, node.left
        
        # Add children to queue
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return root
```

**Time:** O(n)
**Space:** O(w) - max width of tree

### Common Mistakes

1. **Swapping in wrong order without temp variable:**
   ```python
   # Wrong:
   root.left = root.right  # Lost original left!
   root.right = root.left
   
   # Right:
   root.left, root.right = root.right, root.left
   ```

2. **Forgetting to return root:** Problem asks for inverted tree

3. **Only inverting one level:** Must recurse through entire tree

### Visual Understanding

```
Step-by-step for small tree [2,1,3]:

Original:    After swap at root:    Final:
    2              2                   2
   / \            / \                 / \
  1   3          3   1               3   1
```

### Interview Tips

- **Start with recursive:** Clearest solution
- **Interviewer wants iterative?** Show BFS (easier to explain than DFS)
- **Discuss space complexity:** Recursive uses call stack, BFS uses queue

### Follow-up Questions

- How would you verify the tree is inverted correctly?
- What if we can't modify the original tree? (Create new nodes)
- How to invert only certain levels? (Track depth in BFS)

## Learning Resources

**Video:**
- [NeetCode - Invert Binary Tree](https://www.youtube.com/watch?v=OnSn2XEQ4MY)

**Articles:**
- [Max Howell's Famous Tweet](https://twitter.com/mxcl/status/608682016205344768)

**Related Problems:**
- Symmetric Tree (LeetCode #101)
- Mirror Reflection (LeetCode #858)
