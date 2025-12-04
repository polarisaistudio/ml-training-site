---
title: "Valid Anagram"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["hash-table", "string", "sorting"]
source: "LeetCode #242"
---

## Question

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.

**Example:**
```
Input: s = "anagram", t = "nagaram"
Output: true

Input: s = "rat", t = "car"
Output: false
```

## Hints

### Hint 1
Two strings are anagrams if they have the same characters with the same frequencies. How can you count character frequencies?

### Hint 2
Use a hash map to count characters in both strings, then compare the counts.

### Hint 3
Alternatively, sorting both strings and comparing them also works. Which approach is more efficient?

## Answer

### Approach 1: Hash Table (Character Count)

```python
def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    count = {}
    
    # Count characters in s
    for char in s:
        count[char] = count.get(char, 0) + 1
    
    # Decrement for characters in t
    for char in t:
        if char not in count:
            return False
        count[char] -= 1
        if count[char] < 0:
            return False
    
    return True
```

**Time:** O(n) | **Space:** O(1)* 
*O(1) because at most 26 lowercase letters

### Approach 2: Sorting

```python
def isAnagram(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)
```

**Time:** O(n log n) | **Space:** O(1)

### Approach 3: Python Counter

```python
from collections import Counter

def isAnagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
```

**Time:** O(n) | **Space:** O(1)*

### Approach 4: Array Count (Lowercase Only)

```python
def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    
    count = [0] * 26
    
    for i in range(len(s)):
        count[ord(s[i]) - ord('a')] += 1
        count[ord(t[i]) - ord('a')] -= 1
    
    return all(c == 0 for c in count)
```

**Time:** O(n) | **Space:** O(1)

### Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Hash Table | O(n) | O(1)* | Most versatile |
| Sorting | O(n log n) | O(1) | Simplest code |
| Counter | O(n) | O(1)* | Most Pythonic |
| Array Count | O(n) | O(1) | Lowercase only |

*O(1) because at most 26 lowercase letters

### Common Mistakes

1. **Forgetting length check:** Quick optimization
   ```python
   if len(s) != len(t):  # ✅ Early return
       return False
   ```

2. **Not handling Unicode:** Follow-up question consideration
   ```python
   # Current solution works for Unicode
   # But space could be O(n) instead of O(26)
   ```

3. **Case sensitivity:** Clarify requirements
   ```python
   # If case-insensitive:
   s = s.lower()
   t = t.lower()
   ```

### Edge Cases

```python
s = "", t = "" → true (both empty)
s = "a", t = "a" → true
s = "a", t = "b" → false
s = "ab", t = "ba" → true
s = "aab", t = "aba" → true
```

### Follow-up

If inputs contain Unicode characters, how would you adapt your solution?
- Still use hash table, but space could be O(n) instead of O(26)

### Visual Example

```
s = "anagram"
t = "nagaram"

Character counts:
a: 3 (in both)
n: 1 (in both)
g: 1 (in both)
r: 1 (in both)
m: 1 (in both)

All counts match → true
```

### Interview Tips

- **Clarify constraints:** Lowercase only? Unicode? Case-sensitive?
- **Mention multiple approaches** - shows breadth of knowledge
- **Discuss trade-offs:** Time vs space, code simplicity vs efficiency
- **Handle edge cases:** Empty strings, single characters

## Learning Resources

**Video:**
- [NeetCode - Valid Anagram](https://www.youtube.com/watch?v=9UtInBqnCgA)

**Related Problems:**
- Group Anagrams (LeetCode #49)
- Find All Anagrams in a String (LeetCode #438)
