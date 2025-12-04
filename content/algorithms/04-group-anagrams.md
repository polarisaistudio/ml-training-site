---
title: "Group Anagrams"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["hash-table", "string", "sorting"]
source: "LeetCode #49"
---

## Question

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

**Example:**
```
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

Input: strs = [""]
Output: [[""]]

Input: strs = ["a"]
Output: [["a"]]
```

## Hints

### Hint 1
Anagrams will have the same characters when sorted. Can you use the sorted string as a key?

### Hint 2
Use a hash map where the key is the "signature" of the anagram group (like sorted string), and the value is the list of words.

### Hint 3
Alternatively, you could use character counts as the key instead of sorted strings. Which is more efficient?

## Answer

### Approach 1: Hash Table with Sorted String as Key

**Intuition:**
Anagrams will have the same characters when sorted. Use sorted string as the key.

```python
from collections import defaultdict

def groupAnagrams(strs: List[str]) -> List[List[str]]:
    anagrams = defaultdict(list)
    
    for s in strs:
        # Sort string to use as key
        key = ''.join(sorted(s))
        anagrams[key].append(s)
    
    return list(anagrams.values())
```

**Time:** O(n × k log k) where n = number of strings, k = max length
**Space:** O(n × k)

### Approach 2: Character Count as Key

```python
def groupAnagrams(strs: List[str]) -> List[List[str]]:
    anagrams = defaultdict(list)
    
    for s in strs:
        # Count characters (a-z)
        count = [0] * 26
        for char in s:
            count[ord(char) - ord('a')] += 1
        
        # Use tuple of counts as key (lists aren't hashable)
        anagrams[tuple(count)].append(s)
    
    return list(anagrams.values())
```

**Time:** O(n × k) - better than sorting!
**Space:** O(n × k)

### Complexity Comparison

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Sorting | O(n × k log k) | O(n × k) | Simpler code |
| Counting | O(n × k) | O(n × k) | More efficient |

*n = number of strings, k = max length of string*

### Visual Walkthrough

```
Input: ["eat","tea","tan","ate","nat","bat"]

Using sorted key approach:

"eat" → sorted: "aet" → anagrams["aet"] = ["eat"]
"tea" → sorted: "aet" → anagrams["aet"] = ["eat", "tea"]
"tan" → sorted: "ant" → anagrams["ant"] = ["tan"]
"ate" → sorted: "aet" → anagrams["aet"] = ["eat", "tea", "ate"]
"nat" → sorted: "ant" → anagrams["ant"] = ["tan", "nat"]
"bat" → sorted: "abt" → anagrams["abt"] = ["bat"]

Result:
{
  "aet": ["eat", "tea", "ate"],
  "ant": ["tan", "nat"],
  "abt": ["bat"]
}

Return: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

### Common Mistakes

1. **Using list as dictionary key:** Lists aren't hashable, use tuple
   ```python
   # ❌ Wrong:
   anagrams[count].append(s)  # count is a list
   
   # ✅ Right:
   anagrams[tuple(count)].append(s)  # tuple is hashable
   ```

2. **Not considering empty strings:** Handle edge case
   ```python
   strs = [""] → [[""]]  # Should work correctly
   ```

3. **Inefficient string concatenation:** Use join() for building keys
   ```python
   # ❌ Slow:
   key = ""
   for char in sorted(s):
       key += char
   
   # ✅ Fast:
   key = ''.join(sorted(s))
   ```

### Edge Cases

```python
strs = [] → []
strs = [""] → [[""]]
strs = ["a"] → [["a"]]
strs = ["ab", "ba"] → [["ab", "ba"]]
```

### Follow-up Questions

**Q: What if the strings contain Unicode characters?**
A: Character counting approach needs adjustment - use hash map instead of array.

**Q: What if we need to sort the output groups by size?**
```python
result = list(anagrams.values())
result.sort(key=len, reverse=True)
return result
```

**Q: What if we want case-insensitive grouping?**
```python
for s in strs:
    key = ''.join(sorted(s.lower()))
    anagrams[key].append(s)
```

### Why Character Count is Better

```
Sorting: O(k log k) per string
- For string "listen" (k=6): ~6 × log(6) ≈ 15 operations

Counting: O(k) per string
- For string "listen" (k=6): exactly 6 operations

For large k, counting wins!
```

### Interview Tips

- **Start with sorting approach** - easier to explain
- **Mention counting optimization** - shows deeper thinking
- **Explain why tuple is needed** - demonstrates understanding of hashability
- **Discuss trade-offs:** Code simplicity vs efficiency
- **Handle edge cases:** Empty strings, single characters

## Learning Resources

**Video:**
- [NeetCode - Group Anagrams](https://www.youtube.com/watch?v=vzdNOK2oB2E)

**Related Problems:**
- Valid Anagram (LeetCode #242)
- Find All Anagrams in a String (LeetCode #438)
