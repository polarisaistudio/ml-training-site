---
title: "Valid Parentheses"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["stack", "string"]
source: "LeetCode #20"
---

## Question

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets
2. Open brackets must be closed in the correct order
3. Every close bracket has a corresponding open bracket of the same type

**Example:**
```
Input: s = "()"
Output: true

Input: s = "()[]{}"
Output: true

Input: s = "(]"
Output: false

Input: s = "([)]"
Output: false

Input: s = "{[]}"
Output: true
```

## Answer

### Approach: Stack

**Intuition:**
- When we see an opening bracket, push it to stack
- When we see a closing bracket, check if it matches the top of stack
- At the end, stack should be empty

```python
def isValid(s: str) -> bool:
    # Stack to store opening brackets
    stack = []
    
    # Mapping of closing to opening brackets
    closing_to_opening = {
        ')': '(',
        '}': '{',
        ']': '['
    }
    
    for char in s:
        if char in closing_to_opening:
            # Closing bracket
            if not stack or stack[-1] != closing_to_opening[char]:
                return False
            stack.pop()
        else:
            # Opening bracket
            stack.append(char)
    
    # Valid only if all brackets are matched
    return len(stack) == 0
```

**Time:** O(n)
**Space:** O(n) - stack storage

### Alternative: Cleaner Version

```python
def isValid(s: str) -> bool:
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for char in s:
        if char in pairs:
            # Opening bracket
            stack.append(char)
        else:
            # Closing bracket
            if not stack or pairs[stack.pop()] != char:
                return False
    
    return not stack
```

### Common Mistakes

1. **Not checking if stack is empty before popping:**
   ```python
   # Wrong:
   if stack[-1] != closing_to_opening[char]:  # IndexError if empty
   
   # Right:
   if not stack or stack[-1] != closing_to_opening[char]:
   ```

2. **Forgetting to check if stack is empty at end:**
   ```python
   # Wrong:
   return True  # What if stack has unmatched opening brackets?
   
   # Right:
   return len(stack) == 0
   ```

3. **Using list instead of proper matching:**
   ```python
   # Inefficient:
   if char == ')' and stack[-1] == '(':
   elif char == ']' and stack[-1] == '[':
   # ... many conditions
   
   # Better:
   Use dictionary for mapping
   ```

### Edge Cases

```python
s = ""           # Empty string -> True
s = "("          # Only opening -> False
s = ")"          # Only closing -> False
s = "())"        # Extra closing -> False
s = "((("        # Only opening -> False
s = "(())"       # Nested valid -> True
```

### Why Stack?

This problem demonstrates the **LIFO (Last In, First Out)** nature of brackets:
- The most recent unmatched opening bracket must match the next closing bracket
- Stack naturally handles this LIFO behavior

**Visual Example:**
```
Input: "{[()]}"

Step 1: { -> stack = ['{']
Step 2: [ -> stack = ['{', '[']
Step 3: ( -> stack = ['{', '[', '(']
Step 4: ) -> matches '(' -> stack = ['{', '[']
Step 5: ] -> matches '[' -> stack = ['{']
Step 6: } -> matches '{' -> stack = []

Stack empty -> Valid!
```

### Follow-up Questions

**Q: What if we need to return the index of the first invalid bracket?**
```python
def firstInvalidIndex(s: str) -> int:
    stack = []
    pairs = {'(': ')', '[': ']', '{': '}'}
    
    for i, char in enumerate(s):
        if char in pairs:
            stack.append((char, i))
        else:
            if not stack or pairs[stack[-1][0]] != char:
                return i
            stack.pop()
    
    return -1 if not stack else stack[0][1]
```

**Q: What if there are other characters in the string?**
```python
# Just ignore non-bracket characters
for char in s:
    if char in '()[]{}':
        # ... process
```

### Interview Tips

- **This is a classic stack problem** - very common in interviews
- **Explain the LIFO concept** clearly
- **Walk through an example** on the whiteboard
- **Mention edge cases** (empty string, only opening, etc.)

## Learning Resources

**Video:**
- [NeetCode - Valid Parentheses](https://www.youtube.com/watch?v=WTzjTskDFMg)

**Articles:**
- [LeetCode Official Solution](https://leetcode.com/problems/valid-parentheses/solution/)

**Related Problems:**
- Generate Parentheses (LeetCode #22)
- Longest Valid Parentheses (LeetCode #32)
- Valid Parenthesis String (LeetCode #678) - with wildcards
- Minimum Add to Make Parentheses Valid (LeetCode #921)
