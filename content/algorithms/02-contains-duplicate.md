---
title: "Contains Duplicate"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["array", "hash-table"]
source: "LeetCode #217"
---

## Question

Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.

**Example:**
```
Input: nums = [1,2,3,1]
Output: true

Input: nums = [1,2,3,4]
Output: false

Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true
```

## Hints

### Hint 1
Think about using a data structure that can track what you've seen so far. What has O(1) lookup time?

### Hint 2
As you iterate through the array, check if each element is already in your set. If yes, you found a duplicate.

### Hint 3
Alternatively, you could sort the array first and check adjacent elements. But is that more or less efficient?

## Answer

### Approach 1: Hash Set (Optimal)

**Intuition:**
Use a set to track numbers we've seen. If we encounter a duplicate, return true immediately.

```python
def containsDuplicate(nums: List[int]) -> bool:
    seen = set()
    
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    
    return False
```

**Time:** O(n) | **Space:** O(n)

**Alternative (more Pythonic):**
```python
def containsDuplicate(nums: List[int]) -> bool:
    return len(nums) != len(set(nums))
```

### Approach 2: Sorting

```python
def containsDuplicate(nums: List[int]) -> bool:
    nums.sort()
    
    for i in range(len(nums) - 1):
        if nums[i] == nums[i + 1]:
            return True
    
    return False
```

**Time:** O(n log n) | **Space:** O(1)

### Comparison

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Hash Set | O(n) | O(n) | **Best overall** |
| Sorting | O(n log n) | O(1) | When space is critical |

### Common Mistakes

1. **Not considering empty array:** Handle edge cases
   ```python
   if not nums:  # Empty array has no duplicates
       return False
   ```

2. **Modifying original array:** Be careful with sorting approach
   ```python
   # If you can't modify original:
   sorted_nums = sorted(nums)  # Create copy
   ```

3. **Inefficient nested loops:** O(n²) is too slow
   ```python
   # ❌ Don't do this:
   for i in range(len(nums)):
       for j in range(i+1, len(nums)):
           if nums[i] == nums[j]:
               return True
   ```

### Edge Cases

```python
nums = [] → false (empty array)
nums = [1] → false (single element)
nums = [1,1] → true (immediate duplicate)
nums = [1,2,3,4,5] → false (all distinct)
```

### Follow-up Questions

**Q: What if we need to find the duplicate value, not just check existence?**
```python
def findDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return num
        seen.add(num)
    return None
```

**Q: What if we need to find all duplicates?**
```python
def findAllDuplicates(nums):
    seen = set()
    duplicates = set()
    for num in nums:
        if num in seen:
            duplicates.add(num)
        seen.add(num)
    return list(duplicates)
```

### Interview Tips

- **Start with hash set approach** - optimal time complexity
- **Mention sorting alternative** - shows you know trade-offs
- **Discuss space complexity** - important consideration
- **Handle edge cases** - empty array, single element

## Learning Resources

**Video:**
- [NeetCode - Contains Duplicate](https://www.youtube.com/watch?v=3OamzN90kPg)

**Related Problems:**
- Contains Duplicate II (LeetCode #219) - with distance constraint
- Contains Duplicate III (LeetCode #220) - with value range
