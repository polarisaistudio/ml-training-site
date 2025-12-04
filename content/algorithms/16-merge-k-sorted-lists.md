---
title: "Merge K Sorted Lists"
type: "algorithm"
stage: "coding-ready"
difficulty: "hard"
verified: false
tags: ["linked-list", "heap", "divide-and-conquer"]
source: "LeetCode #23"
---

## Question

You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.

**Example:**
```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]

Explanation:
The linked-lists are:
[
  1->4->5,
  1->3->4,
  2->6
]
Merging them into one sorted list:
1->1->2->3->4->4->5->6
```

## Hints

### Hint 1
You know how to merge 2 sorted lists. Can you use a similar approach but track k list heads?

### Hint 2
Use a min heap to always get the smallest node among k list heads. What do you store in the heap?

### Hint 3
When you add a node to the heap, include an index to avoid comparing ListNode objects directly (they're not comparable).

## Answer

### Approach 1: Min Heap (Optimal and Elegant)

**Intuition:**
Use a min heap to always get the smallest node among k list heads.

```python
import heapq

def mergeKLists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    # Min heap: (node.val, index, node)
    # index prevents comparison of ListNode objects when values are equal
    heap = []
    
    # Add first node from each list
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        
        # Add to result
        current.next = node
        current = current.next
        
        # Add next node from same list
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

**Time:** O(N log k) where N = total number of nodes
**Space:** O(k) for heap

**Key Points:**
- Heap size is at most k (one node per list)
- Each pop/push is O(log k)
- Total N nodes processed → O(N log k)

### Why Include Index in Heap?

**Problem:**
```python
# This will crash if two nodes have same value:
heapq.heappush(heap, (node.val, node))  # ❌

# Error: '<' not supported between instances of 'ListNode'
```

**Solution:**
```python
# Add index as tiebreaker:
heapq.heappush(heap, (node.val, i, node))  # ✅
```

When values are equal, Python compares the next tuple element (index), avoiding ListNode comparison.

### Approach 2: Divide and Conquer

**Intuition:**
Merge lists pairwise, like merge sort.

```python
def mergeKLists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    if not lists:
        return None
    
    # Merge two sorted lists
    def merge2Lists(l1, l2):
        dummy = ListNode(0)
        current = dummy
        
        while l1 and l2:
            if l1.val <= l2.val:
                current.next = l1
                l1 = l1.next
            else:
                current.next = l2
                l2 = l2.next
            current = current.next
        
        current.next = l1 if l1 else l2
        return dummy.next
    
    # Divide and conquer
    while len(lists) > 1:
        merged = []
        
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge2Lists(l1, l2))
        
        lists = merged
    
    return lists[0]
```

**Time:** O(N log k)
**Space:** O(1) not counting recursion

**Explanation:**
- First round: k lists → k/2 lists (each merge is O(n))
- Second round: k/2 lists → k/4 lists
- ...
- log k rounds total
- Each round processes all N nodes → O(N log k)

### Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Min Heap | O(N log k) | O(k) | **Optimal, clean code** | Need to understand heaps |
| Divide & Conquer | O(N log k) | O(1) | Optimal time, minimal space | More complex code |

### Visual Walkthrough (Min Heap)

```
Lists: [1->4->5, 1->3->4, 2->6]

Initial heap: [(1,0,node), (1,1,node), (2,2,node)]

Step 1: Pop (1,0,node) with val=1
  Add to result: 1
  Push next from list 0: (4,0,node)
  heap: [(1,1,node), (2,2,node), (4,0,node)]

Step 2: Pop (1,1,node) with val=1
  Add to result: 1->1
  Push next from list 1: (3,1,node)
  heap: [(2,2,node), (3,1,node), (4,0,node)]

Step 3: Pop (2,2,node) with val=2
  Add to result: 1->1->2
  Push next from list 2: (6,2,node)
  heap: [(3,1,node), (4,0,node), (6,2,node)]

... continue until heap is empty

Result: 1->1->2->3->4->4->5->6
```

### Common Mistakes

1. **Comparing ListNode objects:**
   ```python
   # ❌ Wrong:
   heapq.heappush(heap, (node.val, node))  # Crashes on ties
   
   # ✅ Right:
   heapq.heappush(heap, (node.val, i, node))
   ```

2. **Forgetting to add next node:**
   ```python
   node = heapq.heappop(heap)[2]
   current.next = node
   current = current.next
   # ❌ Missing: push node.next to heap!
   
   # ✅ Don't forget:
   if node.next:
       heapq.heappush(heap, (node.next.val, i, node.next))
   ```

3. **Not handling empty lists:**
   ```python
   for i, node in enumerate(lists):
       if node:  # ✅ Check before pushing
           heapq.heappush(heap, ...)
   ```

4. **Off-by-one in divide and conquer:**
   ```python
   # When k is odd, last list has no pair
   l2 = lists[i + 1] if i + 1 < len(lists) else None
   ```

### Follow-up Questions

**Q: What if lists is very large but k is small?**
A: Heap approach is better - O(N log k) vs O(N log N) for sorting.

**Q: What if memory is limited?**
A: Divide and conquer uses O(1) space (ignoring recursion).

**Q: Can you do it with k-way merge iterator?**
A: Yes, same heap logic but yield nodes instead of building list.

**Q: What if lists are not sorted?**
A: Would need to sort each list first, then merge. Or collect all and sort.

### Extensions

**Merge K Sorted Arrays:**
```python
# Same heap logic, but with arrays and indices
heap = [(arr[0], i, 0) for i, arr in enumerate(arrays) if arr]
# (value, array_index, element_index)
```

### Interview Tips

- **Start with heap approach** - clearest and optimal
- **Explain the tiebreaker trick** - shows attention to detail
- **Draw a small example** with k=3 lists
- **Mention space complexity:** O(k) vs O(N)
- **Compare to 2-way merge:** "This is generalization of merging 2 lists"

**Common follow-up:** "What if you can only use O(1) space?"
Answer: Divide and conquer approach

## Learning Resources

**Video:**
- [NeetCode - Merge K Sorted Lists](https://www.youtube.com/watch?v=q5a5OiGbT6Q)

**Related Problems:**
- Merge Two Sorted Lists (LeetCode #21) - building block
- Find K Pairs with Smallest Sums (LeetCode #373) - similar heap usage
- Ugly Number II (LeetCode #264) - similar merging concept
