---
title: "Reverse Linked List"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["linked-list", "recursion"]
source: "LeetCode #206"
---

## Question

Given the head of a singly linked list, reverse the list, and return the reversed list.

**Example:**
```
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]
```

## Answer

### Approach 1: Iterative (Recommended)

**Intuition:**
Use three pointers to reverse links one by one.

```python
def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    curr = head
    
    while curr:
        # Save next node
        next_temp = curr.next
        
        # Reverse the link
        curr.next = prev
        
        # Move pointers forward
        prev = curr
        curr = next_temp
    
    return prev
```

**Time:** O(n) | **Space:** O(1)

### Approach 2: Recursive

```python
def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    # Base case
    if not head or not head.next:
        return head
    
    # Reverse rest of list
    new_head = reverseList(head.next)
    
    # Reverse current link
    head.next.next = head
    head.next = None
    
    return new_head
```

**Time:** O(n) | **Space:** O(n) due to recursion stack

### Common Mistakes

1. **Losing reference to rest of list:** Always save `next` before modifying
2. **Not updating head:** Return `prev`, not `head`
3. **Off-by-one errors:** Draw it out on paper

### Visual Aid

```
Before: 1 -> 2 -> 3 -> None
After:  None <- 1 <- 2 <- 3
```

## Learning Resources

**Video:**
- [NeetCode - Reverse Linked List](https://www.youtube.com/watch?v=G0_I-ZF0S38)

**Related Problems:**
- Reverse Linked List II (LeetCode #92)
- Palindrome Linked List (LeetCode #234)
