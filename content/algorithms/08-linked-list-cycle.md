---
title: "Linked List Cycle"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["linked-list", "two-pointers"]
source: "LeetCode #141"
---

## Question

Given `head`, determine if the linked list has a cycle in it.

**Example:**
```
Input: head = [3,2,0,-4], pos = 1 (cycle back to node with value 2)
Output: true
```

## Hints

### Hint 1
Think about using two pointers moving at different speeds. What happens if there's a cycle?

### Hint 2
Use a slow pointer (moves 1 step) and a fast pointer (moves 2 steps). They will eventually meet if there's a cycle.

### Hint 3
If the fast pointer reaches null, there's no cycle. If it catches up to slow, there is a cycle.

## Answer

### Approach: Floyd's Cycle Detection (Two Pointers)

**Intuition:**
Use slow and fast pointers. If there's a cycle, fast will eventually catch up to slow.

```python
def hasCycle(head: Optional[ListNode]) -> bool:
    if not head:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        
        if slow == fast:
            return True
    
    return False
```

**Time:** O(n) | **Space:** O(1)

### Why This Works

- If no cycle: fast reaches end
- If cycle exists: fast enters cycle first, then eventually meets slow
- Guaranteed to meet within one cycle length

### Alternative: Hash Set

```python
def hasCycle(head: Optional[ListNode]) -> bool:
    seen = set()
    
    while head:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    
    return False
```

**Time:** O(n) | **Space:** O(n)

### Common Mistakes

1. **Not checking fast.next:** Will cause NoneType error
2. **Using values instead of nodes:** Values can repeat
3. **Starting both at head:** Still works, but less clear

### Follow-up

Can you solve it using O(1) memory?
- Yes, use Floyd's cycle detection

## Learning Resources

**Video:**
- [NeetCode - Linked List Cycle](https://www.youtube.com/watch?v=gBTe7lFR3vc)

**Related Problems:**
- Linked List Cycle II (LeetCode #142) - Find cycle start
- Happy Number (LeetCode #202) - Similar concept
