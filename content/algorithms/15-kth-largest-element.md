---
title: "Kth Largest Element in an Array"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["heap", "quickselect", "sorting"]
source: "LeetCode #215"
---

## Question

Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.

Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.

**Can you solve it without sorting?**

**Example:**
```
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5

Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

## Hints

### Hint 1
Think about using a heap. Do you want a min heap or max heap? And what size should it be?

### Hint 2
Use a min heap of size k. Keep only the k largest elements. The smallest of those k elements (at the root) is your answer.

### Hint 3
For each new element, if it's larger than the heap's minimum, replace the minimum with it. This maintains the k largest elements.

## Answer

### Approach 1: Min Heap of Size K (Recommended for Interviews)

**Intuition:**
Maintain a min heap of size k containing the k largest elements seen so far. The root of this heap is the kth largest element.

```python
import heapq

def findKthLargest(nums: List[int], k: int) -> int:
    # Build min heap of first k elements
    heap = nums[:k]
    heapq.heapify(heap)
    
    # Process remaining elements
    for num in nums[k:]:
        if num > heap[0]:  # If larger than smallest in heap
            heapq.heapreplace(heap, num)
    
    # Root of heap is kth largest
    return heap[0]
```

**Alternative (cleaner but same complexity):**
```python
def findKthLargest(nums: List[int], k: int) -> int:
    heap = []
    
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    
    return heap[0]
```

**Time:** O(n log k)
**Space:** O(k)

**Why Min Heap, not Max Heap?**
- We want k largest elements
- Min heap of size k keeps smallest of "k largest" at root
- This smallest is the kth largest overall
- Python only has min heap, so this is natural

### Approach 2: Sorting (Simplest but Not Optimal)

```python
def findKthLargest(nums: List[int], k: int) -> int:
    nums.sort(reverse=True)
    return nums[k-1]
```

**Time:** O(n log n)
**Space:** O(1) if sorting in-place

**When to use:** Only for small inputs or when asked for simplest solution first.

### Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Min Heap | O(n log k) | O(k) | Easy to code, space efficient for small k | Not optimal for large k |
| Sorting | O(n log n) | O(1) | Simplest | Slower, modifies array |

### Visual Walkthrough (Min Heap)

```
nums = [3,2,1,5,6,4], k = 2

Step 1: Build heap with first 2 elements
heap = [2, 3]  (min heap)

Step 2: Process 1
1 < 2 (heap root), skip

Step 3: Process 5
5 > 2, replace 2 with 5
heap = [3, 5]

Step 4: Process 6
6 > 3, replace 3 with 6
heap = [5, 6]

Step 5: Process 4
4 < 5, skip

Result: heap[0] = 5 (2nd largest)
```

### Common Mistakes

1. **Using max heap instead of min heap:**
   ```python
   # Wrong approach:
   # Maintain max heap of all elements, then pop k times
   # This is O(n log n), same as sorting!
   
   # Right:
   # Use min heap of size k
   ```

2. **Off-by-one errors:**
   ```python
   # Kth largest means k-1 index in sorted descending order
   # Or len(nums) - k index in sorted ascending order
   ```

3. **Not handling k > len(nums):**
   ```python
   if k > len(nums) or k < 1:
       raise ValueError("Invalid k")
   ```

### Follow-up Questions

**Q: What if we need to find kth largest multiple times?**
A: Build a max heap once O(n), then pop k-1 times O(k log n).

**Q: What if nums is a stream?**
A: Use min heap of size k, process elements one by one (this problem: LeetCode #703)

**Q: What if we need kth smallest instead?**
A: Use max heap of size k instead, or quickselect with different comparison.

**Q: What about finding median (which is special case of kth element)?**
A: Use two heaps - max heap for smaller half, min heap for larger half (LeetCode #295)

### When to Use Each Approach in Interview

1. **Start with Min Heap** - safest choice
   - Easy to explain
   - Easy to code correctly
   - Shows you know heap data structure

2. **Mention Sorting** - if asked for alternatives
   - "The simplest would be to sort, but that's O(n log n)"

### Interview Tips

- **Clarify:** "Is the array allowed to have duplicates?" (Yes)
- **Clarify:** "Can I modify the original array?" (Usually yes)
- **Walk through small example** to verify logic
- **Mention trade-offs** between approaches
- **Code min heap approach** unless specifically asked for optimal

## Learning Resources

**Video:**
- [NeetCode - Kth Largest Element](https://www.youtube.com/watch?v=XEmy13g1Qxc)

**Related Problems:**
- Kth Largest Element in a Stream (LeetCode #703)
- Find Median from Data Stream (LeetCode #295)
- Top K Frequent Elements (LeetCode #347) - similar heap usage
