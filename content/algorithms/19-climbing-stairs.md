---
title: "Climbing Stairs"
type: "algorithm"
stage: "coding-ready"
difficulty: "easy"
verified: false
tags: ["dynamic-programming", "math", "memoization"]
source: "LeetCode #70"
---

## Question

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example:**
```
Input: n = 2
Output: 2
Explanation: 
1. 1 step + 1 step
2. 2 steps

Input: n = 3
Output: 3
Explanation:
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step
```

## Hints

### Hint 1
Think about the pattern: how many ways to reach step n if you can come from step n-1 or step n-2?

### Hint 2
This is actually the Fibonacci sequence! ways(n) = ways(n-1) + ways(n-2)

### Hint 3
You only need to keep track of the last two values, not the entire array. Can you optimize space to O(1)?

## Answer

### Understanding the Pattern

```
n = 1: [1] → 1 way
n = 2: [1,1], [2] → 2 ways
n = 3: [1,1,1], [1,2], [2,1] → 3 ways
n = 4: [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2] → 5 ways
n = 5: 8 ways

Pattern: 1, 2, 3, 5, 8... (Fibonacci!)
```

**Key Insight:** To reach step n, you must come from either step n-1 or step n-2.
Therefore: `ways(n) = ways(n-1) + ways(n-2)`

This is the Fibonacci sequence!

### Approach 1: Dynamic Programming (Recommended)

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    
    # dp[i] = number of ways to reach step i
    dp = [0] * (n + 1)
    dp[1] = 1  # 1 way to reach step 1
    dp[2] = 2  # 2 ways to reach step 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]
```

**Time:** O(n)
**Space:** O(n)

### Approach 2: Space-Optimized DP

**Intuition:**
We only need the last two values, not the entire array.

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    
    prev2 = 1  # ways(1)
    prev1 = 2  # ways(2)
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1
```

**Time:** O(n)
**Space:** O(1) ✅

### Approach 3: Recursion with Memoization

```python
def climbStairs(n: int) -> int:
    memo = {}
    
    def climb(n):
        if n <= 2:
            return n
        
        if n in memo:
            return memo[n]
        
        memo[n] = climb(n-1) + climb(n-2)
        return memo[n]
    
    return climb(n)
```

**Time:** O(n)
**Space:** O(n) for memo + O(n) recursion stack

### Approach 4: Pure Recursion (Not Recommended)

```python
def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    return climbStairs(n-1) + climbStairs(n-2)
```

**Time:** O(2^n) ❌ Exponential!
**Space:** O(n) recursion stack

**Why so slow?** Recomputes same values many times:
```
climbStairs(5)
├─ climbStairs(4)
│  ├─ climbStairs(3)
│  │  ├─ climbStairs(2)
│  │  └─ climbStairs(1)
│  └─ climbStairs(2)
└─ climbStairs(3)  ← Duplicate!
   ├─ climbStairs(2)  ← Duplicate!
   └─ climbStairs(1)  ← Duplicate!
```

### Visual Walkthrough

```
n = 5

Step-by-step building:
dp[1] = 1
dp[2] = 2
dp[3] = dp[2] + dp[1] = 2 + 1 = 3
dp[4] = dp[3] + dp[2] = 3 + 2 = 5
dp[5] = dp[4] + dp[3] = 5 + 3 = 8

Answer: 8

All 8 ways to climb 5 stairs:
1. [1,1,1,1,1]
2. [1,1,1,2]
3. [1,1,2,1]
4. [1,2,1,1]
5. [2,1,1,1]
6. [1,2,2]
7. [2,1,2]
8. [2,2,1]
```

### Common Mistakes

1. **Off-by-one errors in base cases:**
   ```python
   # Wrong:
   dp[0] = 1  # ❌ No meaning for step 0
   dp[1] = 1
   
   # Right:
   dp[1] = 1  # ✅ 1 way to reach step 1
   dp[2] = 2  # ✅ 2 ways to reach step 2
   ```

2. **Not handling edge cases:**
   ```python
   if n <= 2:  # ✅ Handle n=1 and n=2 explicitly
       return n
   ```

3. **Array index out of bounds:**
   ```python
   dp = [0] * (n + 1)  # ✅ Need n+1 size, not n
   ```

### Why This is DP

**Optimal Substructure:**
- Solution to n depends on solutions to n-1 and n-2
- Optimal way to reach n = optimal ways to reach n-1 + optimal ways to reach n-2

**Overlapping Subproblems:**
- climbStairs(3) is needed for both climbStairs(4) and climbStairs(5)
- Memoization/DP prevents recomputation

### Follow-up Questions

**Q: What if you can climb 1, 2, or 3 steps at a time?**
```python
dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
```

**Q: What if each step has a cost and we want minimum cost?**
A: Different problem (Min Cost Climbing Stairs - LeetCode #746)

**Q: What if we want to print all possible ways, not just count?**
```python
def allWays(n):
    if n == 1:
        return [[1]]
    if n == 2:
        return [[1,1], [2]]
    
    ways = []
    # Take 1 step, then solve n-1
    for way in allWays(n-1):
        ways.append(way + [1])
    # Take 2 steps, then solve n-2
    for way in allWays(n-2):
        ways.append(way + [2])
    
    return ways
```

### Comparison of Approaches

| Approach | Time | Space | Use When |
|----------|------|-------|----------|
| Pure Recursion | O(2^n) | O(n) | ❌ Never |
| Memoization | O(n) | O(n) | Quick to code |
| DP Array | O(n) | O(n) | Clear logic |
| **Space-Optimized** | O(n) | O(1) | **Best for interviews** |

### Interview Tips

- **Start with the pattern:** "This is Fibonacci!"
- **Explain the recurrence:** ways(n) = ways(n-1) + ways(n-2)
- **Code space-optimized version** - shows understanding
- **Mention it's DP:** Optimal substructure + overlapping subproblems
- **Walk through small example:** n=3 or n=4

**Common follow-up:** "Can you optimize space?"
Answer: "Yes, we only need last two values" → show O(1) space solution

## Learning Resources

**Video:**
- [NeetCode - Climbing Stairs](https://www.youtube.com/watch?v=Y0lT9Fck7qI)

**Related Problems:**
- Min Cost Climbing Stairs (LeetCode #746)
- Fibonacci Number (LeetCode #509) - literally the same
- N-th Tribonacci Number (LeetCode #1137) - extend to 3 steps
- House Robber (LeetCode #198) - similar DP pattern
