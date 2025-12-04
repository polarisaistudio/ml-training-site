---
title: "Two Sum"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["array", "hash-table"]
source: "LeetCode #1"
---

## Question

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

## Answer

### Approach: Hash Table

**Intuition:** 
As we iterate through the array, for each number we can check if `target - current_number` exists in our hash table.

**Algorithm:**
1. Create a hash table to store numbers and their indices
2. For each number, calculate `complement = target - num`
3. If complement exists in hash table, return both indices
4. Otherwise, add current number to hash table

### Code

```python
def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}  # num -> index
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []  # No solution found
```

### Complexity

- **Time:** O(n) - single pass through array
- **Space:** O(n) - hash table storage

### Common Mistakes

1. **Forgetting to check if complement exists before accessing:** Will cause KeyError
2. **Using same element twice:** Make sure to check `i != j`
3. **Not handling no solution case:** Always have a return statement

### Follow-up Questions

- What if the array is sorted? (Two pointers approach)
- What if we need to find all pairs? (Extend to return list of pairs)
- What if we allow duplicates? (Adjust hash table logic)

## Learning Resources

**Video:**
- [NeetCode - Two Sum](https://www.youtube.com/watch?v=KLlXCFG5TnA)

**Articles:**
- [LeetCode Official Solution](https://leetcode.com/problems/two-sum/solution/)

**Related Problems:**
- Three Sum (LeetCode #15)
- Two Sum II - Input Array Is Sorted (LeetCode #167)
- 4Sum (LeetCode #18)
