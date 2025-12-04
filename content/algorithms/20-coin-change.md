---
title: "Coin Change"
type: "algorithm"
stage: "coding-ready"
difficulty: "medium"
verified: false
tags: ["dynamic-programming", "array", "bfs"]
source: "LeetCode #322"
---

## Question

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.

You may assume that you have an infinite number of each kind of coin.

**Example:**
```
Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1

Input: coins = [2], amount = 3
Output: -1
Explanation: Cannot make 3 with only coin of denomination 2

Input: coins = [1], amount = 0
Output: 0
```

## Hints

### Hint 1
Think about building up from smaller amounts. If you know the minimum coins needed for amount i, how do you compute it for amount i+1?

### Hint 2
For each amount, try using each coin. The answer is 1 + the minimum coins needed for (amount - coin).

### Hint 3
Initialize dp array with infinity except dp[0] = 0. This helps you handle impossible cases.

## Answer

### Approach 1: Dynamic Programming (Bottom-Up)

**Intuition:**
- `dp[i]` = minimum coins needed to make amount `i`
- For each amount, try using each coin and take the minimum

```python
def coinChange(coins: List[int], amount: int) -> int:
    # dp[i] = min coins needed for amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 coins needed for amount 0
    
    # Build up from 1 to amount
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                # Can use this coin
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

**Time:** O(amount × len(coins))
**Space:** O(amount)

### Step-by-Step Example

```
coins = [1, 2, 5], amount = 11

Initial: dp = [0, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]
              0  1  2  3  4  5  6  7  8  9  10 11

For amount 1:
  Try coin 1: dp[1] = min(∞, dp[0] + 1) = 1
  dp = [0, 1, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

For amount 2:
  Try coin 1: dp[2] = min(∞, dp[1] + 1) = 2
  Try coin 2: dp[2] = min(2, dp[0] + 1) = 1
  dp = [0, 1, 1, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

For amount 3:
  Try coin 1: dp[3] = min(∞, dp[2] + 1) = 2
  Try coin 2: dp[3] = min(2, dp[1] + 1) = 2
  dp = [0, 1, 1, 2, ∞, ∞, ∞, ∞, ∞, ∞, ∞, ∞]

For amount 5:
  Try coin 1: dp[5] = min(∞, dp[4] + 1) = 4
  Try coin 2: dp[5] = min(4, dp[3] + 1) = 3
  Try coin 5: dp[5] = min(3, dp[0] + 1) = 1
  dp = [0, 1, 1, 2, 2, 1, ∞, ∞, ∞, ∞, ∞, ∞]

... continue ...

Final: dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
                                              ^
Answer: dp[11] = 3 (coins: 5 + 5 + 1)
```

### Approach 2: Recursion with Memoization (Top-Down)

```python
def coinChange(coins: List[int], amount: int) -> int:
    memo = {}
    
    def dp(remaining):
        # Base cases
        if remaining == 0:
            return 0
        if remaining < 0:
            return -1
        
        # Check memo
        if remaining in memo:
            return memo[remaining]
        
        # Try each coin
        min_coins = float('inf')
        for coin in coins:
            result = dp(remaining - coin)
            if result >= 0:  # Valid solution
                min_coins = min(min_coins, result + 1)
        
        # Store in memo
        memo[remaining] = min_coins if min_coins != float('inf') else -1
        return memo[remaining]
    
    return dp(amount)
```

**Time:** O(amount × len(coins))
**Space:** O(amount) for memo + recursion stack

### Common Mistakes

1. **Forgetting to initialize dp[0]:**
   ```python
   dp[0] = 0  # ✅ Critical! Base case
   ```

2. **Wrong initialization value:**
   ```python
   # Wrong:
   dp = [0] * (amount + 1)  # ❌ Can't distinguish impossible from 0
   
   # Right:
   dp = [float('inf')] * (amount + 1)  # ✅
   dp[0] = 0
   ```

3. **Not checking if coin can be used:**
   ```python
   for coin in coins:
       if coin <= i:  # ✅ Must check
           dp[i] = min(dp[i], dp[i - coin] + 1)
   ```

4. **Returning infinity instead of -1:**
   ```python
   return dp[amount] if dp[amount] != float('inf') else -1  # ✅
   ```

5. **Off-by-one in array size:**
   ```python
   dp = [float('inf')] * (amount + 1)  # ✅ Need amount+1, not amount
   ```

### Why This is DP

**Optimal Substructure:**
- Optimal solution for amount `n` uses optimal solution for `n - coin`
- `dp[n] = min(dp[n - coin] + 1)` for all valid coins

**Overlapping Subproblems:**
- To compute dp[11], we need dp[10], dp[9], dp[6]
- dp[10] needs dp[9], dp[8], dp[5]
- dp[9] is reused → overlapping subproblem

### Edge Cases

```python
# Amount is 0
coins = [1,2,5], amount = 0 → 0 (no coins needed)

# Cannot make amount
coins = [2], amount = 3 → -1

# Amount less than smallest coin
coins = [5,10], amount = 3 → -1

# Single coin equals amount
coins = [1,2,5], amount = 5 → 1

# Need all same coin
coins = [1], amount = 5 → 5
```

### Follow-up Questions

**Q: What if we want to know if it's possible to make exact amount?**
```python
def canMakeAmount(coins, amount):
    dp = [False] * (amount + 1)
    dp[0] = True
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin]:
                dp[i] = True
                break
    
    return dp[amount]
```

**Q: What if we want to count ALL ways to make the amount?**
A: Different problem (Coin Change II - LeetCode #518)

**Q: What if each coin can only be used once?**
A: Use 0/1 knapsack approach instead.

**Q: What if we want the maximum number of coins instead of minimum?**
```python
# Just change min to max
dp[i] = max(dp[i], dp[i - coin] + 1)
```

### Comparison: Bottom-Up vs Top-Down

| Aspect | Bottom-Up (DP) | Top-Down (Memo) |
|--------|----------------|-----------------|
| Code | Iterative | Recursive |
| Intuition | Build from small | Break into subproblems |
| Space | O(amount) | O(amount) + stack |
| Interview | **Recommended** | Also good |

### Interview Tips

- **Explain the recurrence relation:** `dp[i] = min(dp[i], dp[i-coin] + 1)`
- **Walk through a small example:** Like coins=[1,2,5], amount=11
- **Mention base case:** dp[0] = 0
- **Discuss impossible cases:** Return -1 when amount can't be made
- **Compare to other problems:** "Similar to climbing stairs but minimizing instead of counting"

**Key insight to mention:** "This is an unbounded knapsack problem where we're minimizing the number of items (coins) to reach a target weight (amount)."

## Learning Resources

**Video:**
- [NeetCode - Coin Change](https://www.youtube.com/watch?v=H9bfqozjoqs)

**Related Problems:**
- Coin Change II (LeetCode #518) - count ways instead of min coins
- Perfect Squares (LeetCode #279) - similar structure
- Minimum Cost For Tickets (LeetCode #983)
