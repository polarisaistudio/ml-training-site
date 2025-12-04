---
title: "Merge Two Sorted Lists"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["linked-list", "recursion"]
source: "LeetCode #21"
---

## Question

Merge two sorted linked lists and return it as a sorted list.

**Example:**
```
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]
```

## Hints

### Hint 1
Use a dummy node to simplify the logic. This avoids having to handle the head separately.

### Hint 2
Compare the values at the current positions of both lists. Attach the smaller node to your result list.

### Hint 3
Don't forget to attach any remaining nodes from either list after one list is exhausted.

## Answer

### Approach 1: Iterative with Dummy Node

```python
def mergeTwoLists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    # Create dummy node
    dummy = ListNode(0)
    current = dummy
    
    # Merge while both lists have nodes
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # Attach remaining nodes
    current.next = list1 if list1 else list2
    
    return dummy.next
```

**Time:** O(n + m) | **Space:** O(1)

### Approach 2: Recursive

```python
def mergeTwoLists(list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
    # Base cases
    if not list1:
        return list2
    if not list2:
        return list1
    
    # Choose smaller node and recurse
    if list1.val <= list2.val:
        list1.next = mergeTwoLists(list1.next, list2)
        return list1
    else:
        list2.next = mergeTwoLists(list1, list2.next)
        return list2
```

**Time:** O(n + m) | **Space:** O(n + m) recursion stack

### Common Mistakes

1. **Forgetting dummy node:** Makes code more complex
2. **Not handling empty lists:** Check base cases
3. **Modifying original lists:** Usually acceptable, but clarify

## Learning Resources

**Video:**
- [NeetCode - Merge Two Sorted Lists](https://www.youtube.com/watch?v=XIdigk956u0)

**Related Problems:**
- Merge k Sorted Lists (LeetCode #23)
- Merge Sorted Array (LeetCode #88)
