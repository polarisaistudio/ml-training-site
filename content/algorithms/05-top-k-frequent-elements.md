---
title: "Top K Frequent Elements"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["array", "hash-table", "heap", "bucket-sort"]
source: "LeetCode #347"
---

## Question

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.

**Example:**
```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Input: nums = [1], k = 1
Output: [1]
```

**Note:** You may assume k is always valid (1 ≤ k ≤ number of unique elements).

## Hints

### Hint 1
First, count the frequency of each element. What data structure is good for counting?

### Hint 2
Once you have frequencies, you need the top k. Think about using a heap - do you want min heap or max heap?

### Hint 3
There's an O(n) solution using bucket sort! Can you group elements by their frequency?

## Answer

### Approach 1: Hash Table + Heap

```python
from collections import Counter
import heapq

def topKFrequent(nums: List[int], k: int) -> List[int]:
    # Count frequencies
    count = Counter(nums)
    
    # Use heap to get top k
    return heapq.nlargest(k, count.keys(), key=count.get)
```

**Time:** O(n log k) | **Space:** O(n)

### Approach 2: Bucket Sort (Optimal)

**Intuition:**
Use frequency as bucket index. Since max frequency is n, we need n+1 buckets.

```python
def topKFrequent(nums: List[int], k: int) -> List[int]:
    count = {}
    freq = [[] for i in range(len(nums) + 1)]
    
    # Count occurrences
    for num in nums:
        count[num] = count.get(num, 0) + 1
    
    # Put numbers in frequency buckets
    for num, cnt in count.items():
        freq[cnt].append(num)
    
    # Collect top k from highest frequency
    result = []
    for i in range(len(freq) - 1, 0, -1):
        for num in freq[i]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result
```

**Time:** O(n) | **Space:** O(n)

### Approach 3: Sorting

```python
def topKFrequent(nums: List[int], k: int) -> List[int]:
    count = Counter(nums)
    # Sort by frequency (descending)
    sorted_items = sorted(count.items(), key=lambda x: x[1], reverse=True)
    return [num for num, freq in sorted_items[:k]]
```

**Time:** O(n log n) | **Space:** O(n)

### Complexity Comparison

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Heap | O(n log k) | O(n) | Good balance |
| Bucket Sort | O(n) | O(n) | **Optimal** |
| Sorting | O(n log n) | O(n) | Simplest code |

### Visual Walkthrough (Bucket Sort)

```
nums = [1,1,1,2,2,3], k = 2

Step 1: Count frequencies
count = {1: 3, 2: 2, 3: 1}

Step 2: Build frequency buckets
freq[0] = []
freq[1] = [3]       # elements with frequency 1
freq[2] = [2]       # elements with frequency 2
freq[3] = [1]       # elements with frequency 3
freq[4] = []
freq[5] = []
freq[6] = []

Step 3: Collect top k from highest frequency
Start from freq[6] down to freq[1]:
  freq[3] has [1] → result = [1]
  freq[2] has [2] → result = [1, 2]
  len(result) == k, return [1, 2]
```

### Common Mistakes

1. **Sorting entire array:** O(n log n) is overkill
   ```python
   # ❌ Don't sort all elements:
   nums.sort()
   
   # ✅ Only sort unique elements by frequency
   ```

2. **Not using Counter:** Reinventing the wheel
   ```python
   # ❌ Manual counting:
   count = {}
   for num in nums:
       if num in count:
           count[num] += 1
       else:
           count[num] = 1
   
   # ✅ Use Counter:
   count = Counter(nums)
   ```

3. **Returning frequencies instead of elements:** Read question carefully
   ```python
   # ❌ Wrong:
   return list(count.values())[:k]
   
   # ✅ Right:
   return list(count.keys())[:k]  # (after sorting)
   ```

### Edge Cases

```python
nums = [1], k = 1 → [1]
nums = [1,2], k = 2 → [1,2] (or [2,1], order doesn't matter)
nums = [1,1,1,2,2,3], k = 1 → [1]
nums = [1,1,2,2,3,3], k = 2 → [1,2] (or [2,1] or any 2)
```

### Follow-up Questions

**Q: What if k is larger than number of unique elements?**
A: Return all unique elements (though problem states k is always valid)

**Q: What if we need top k least frequent instead?**
```python
# Start from freq[1] instead of freq[len(nums)]
for i in range(1, len(freq)):
    # ...
```

**Q: What if elements can be negative?**
A: All approaches still work - we're counting frequencies, not using values as indices

### When to Use Each Approach

**In Interview:**
1. **Start with heap approach** - good balance of efficiency and clarity
2. **Mention bucket sort** - shows you know the optimal solution
3. **If time allows, code bucket sort** - demonstrates mastery

**In Production:**
- Use heap for simplicity and good performance
- Use bucket sort only if O(n) is critical

### Interview Tips

- **Explain the intuition:** "First count frequencies, then find top k"
- **Discuss trade-offs:** Heap vs bucket sort
- **Mention time complexity goal:** "The follow-up asks for better than O(n log n)"
- **Show bucket sort if asked to optimize:** Demonstrates advanced knowledge

## Learning Resources

**Video:**
- [NeetCode - Top K Frequent Elements](https://www.youtube.com/watch?v=YPTqKIgVk-k)

**Related Problems:**
- Kth Largest Element (LeetCode #215)
- Sort Characters By Frequency (LeetCode #451)
- Top K Frequent Words (LeetCode #692)
