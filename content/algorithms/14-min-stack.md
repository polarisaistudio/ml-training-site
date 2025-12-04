---
title: "Min Stack"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["stack", "design"]
source: "LeetCode #155"
---

## Question

Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the `MinStack` class:
- `MinStack()` initializes the stack object
- `void push(int val)` pushes the element val onto the stack
- `void pop()` removes the element on the top of the stack
- `int top()` gets the top element of the stack
- `int getMin()` retrieves the minimum element in the stack

**All operations must run in O(1) time.**

**Example:**
```
Input:
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output:
[null,null,null,null,-3,null,0,-2]

Explanation:
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin(); // return -3
minStack.pop();
minStack.top();    // return 0
minStack.getMin(); // return -2
```

## Hints

### Hint 1
You need to track the minimum at each level of the stack. Think about using an additional data structure.

### Hint 2
Use two stacks: one for regular values, one to track minimums. The min stack always has the current minimum at its top.

### Hint 3
When pushing, only add to min_stack if the new value is less than or equal to the current minimum. When popping, also pop from min_stack if it matches.

## Answer

### Approach 1: Two Stacks (Most Intuitive)

**Intuition:**
Use two stacks:
1. Regular stack for all elements
2. Min stack that always has current minimum at top

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        
        # Push to min_stack if it's empty or val is new minimum
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        val = self.stack.pop()
        
        # If popped value was minimum, pop from min_stack too
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
```

**Time:** O(1) for all operations
**Space:** O(n) for both stacks

**Key Insight:**
- `min_stack` always maintains minimums at each level
- When we pop, if it's the current min, we also pop from min_stack
- Next minimum is automatically at top of min_stack

### Approach 2: Single Stack with Tuples

**Intuition:**
Store `(value, current_min)` pairs in one stack.

```python
class MinStack:
    def __init__(self):
        self.stack = []  # Each element is (val, current_min)
    
    def push(self, val: int) -> None:
        if not self.stack:
            self.stack.append((val, val))
        else:
            current_min = min(val, self.stack[-1][1])
            self.stack.append((val, current_min))
    
    def pop(self) -> None:
        self.stack.pop()
    
    def top(self) -> int:
        return self.stack[-1][0]
    
    def getMin(self) -> int:
        return self.stack[-1][1]
```

**Time:** O(1) for all operations
**Space:** O(n) but with more memory per element

**Trade-off:**
- Simpler logic (only one stack)
- But stores minimum with every element (more memory)

### Visual Walkthrough

```
Operations: push(-2), push(0), push(-3), getMin(), pop()

After push(-2):
stack:     [-2]
min_stack: [-2]

After push(0):
stack:     [-2, 0]
min_stack: [-2]      # 0 > -2, don't push

After push(-3):
stack:     [-2, 0, -3]
min_stack: [-2, -3]  # -3 is new min

getMin() → -3

After pop():
stack:     [-2, 0]
min_stack: [-2]      # -3 was min, so pop from min_stack too

getMin() → -2
```

### Common Mistakes

1. **Wrong condition for pushing to min_stack:**
   ```python
   # Wrong:
   if val < self.min_stack[-1]:  # ❌ Miss duplicates
   
   # Right:
   if val <= self.min_stack[-1]:  # ✅ Handle duplicates
   ```

2. **Not handling duplicates:**
   ```
   push(5), push(5), pop()
   If we use <, second 5 isn't pushed to min_stack
   After pop, min_stack is empty but should still have 5
   ```

3. **Forgetting to check empty stack:**
   ```python
   def getMin(self):
       if not self.min_stack:  # Always check!
           return None
       return self.min_stack[-1]
   ```

### Edge Cases

```python
# Single element
push(5) → getMin() should return 5

# Duplicates
push(5), push(5), getMin() → 5
pop(), getMin() → still 5

# Negative numbers
push(-1), push(-2) → getMin() returns -2

# Pop all elements
push(1), push(2), pop(), pop()
Stack should be empty
```

### Which Approach to Use?

| Approach | Pros | Cons | When to Use |
|----------|------|------|-------------|
| Two Stacks | Clear, easy to understand | Uses more memory | **Interviews (recommended)** |
| Tuples | Simple logic | Stores redundant mins | When simplicity > space |

**Interview Recommendation:** Start with Approach 1 (two stacks), then mention you could optimize space if needed.

### Follow-up Questions

**Q: Can you make getMin() O(1) without extra space?**
A: Not really - you need to store historical minimums somehow.

**Q: What if we need getMax() too?**
A: Add a third stack for maximums, same logic as min_stack.

**Q: How would you handle getMedian()?**
A: Different problem - need two heaps (max heap and min heap).

### Interview Tips

- **This tests your understanding of stack properties**
- **Explain trade-offs** between approaches
- **Draw the two stacks** to visualize state
- **Walk through the duplicate case** to show you handle edge cases
- **Mention this pattern applies to other "running statistic" problems**

## Learning Resources

**Video:**
- [NeetCode - Min Stack](https://www.youtube.com/watch?v=qkLl7nAwDPo)

**Related Problems:**
- Max Stack (Similar problem)
- Sliding Window Maximum (LeetCode #239) - uses similar min tracking idea
