# Heaps — Theory & Foundations

**Difficulty:** Easy
**YouTube:** https://www.youtube.com/watch?v=HqPJF2L5h9U

## Description

A **Heap** is a specialized complete binary tree that satisfies the **heap property**:

- **Min-Heap:** Every parent node is **less than or equal to** its children. The minimum element is always at the root.
- **Max-Heap:** Every parent node is **greater than or equal to** its children. The maximum element is always at the root.

Heaps are typically stored as **arrays** where for a node at index `i`:
- Parent: `(i - 1) / 2`
- Left child: `2 * i + 1`
- Right child: `2 * i + 2`

**Key Operations and Their Complexities:**
- **Insert (offer):** O(log n) — add to end, bubble up
- **Extract min/max (poll):** O(log n) — remove root, replace with last, bubble down
- **Peek:** O(1) — just read the root
- **Heapify an array:** O(n) — NOT O(n log n), because of the mathematical proof involving summing heights
- **Build heap from array:** O(n)

**Constraints:**
- Heaps are **complete binary trees** — every level is full except possibly the last, which is filled left to right
- This completeness property is what allows the array representation (no wasted space, no pointers needed)
- Java's `PriorityQueue` is a min-heap by default

**Examples:**

Min-Heap Array: `[1, 3, 5, 7, 9, 8, 6]`
```
        1
       / \
      3    5
     / \  / \
    7   9 8   6
```
Parent of index 3 (value 7): `(3-1)/2 = 1` → value 3 ✓ (3 ≤ 7)
Left child of index 1 (value 3): `2*1+1 = 3` → value 7 ✓

Max-Heap Array: `[9, 7, 8, 3, 5, 6, 1]`
```
        9
       / \
      7    8
     / \  / \
    3   5 6   1
```

**Notable Edge Cases:**
- Single element array is both a valid min-heap and max-heap
- Two elements: just check `arr[0] <= arr[1]` for min-heap
- Empty array: trivially a valid heap

## In-depth Explanation

**Reframe:** A heap is an array that pretends to be a tree. The position of each element in the array encodes the parent-child relationships via simple arithmetic. The heap property ensures the "best" element (min or max) is always instantly accessible at index 0.

**Pattern recognition:** Heaps are the go-to when you need repeated access to the minimum or maximum element. Keywords: "k-th largest/smallest", "top K", "merge sorted", "median", "schedule by priority".

**Real-world analogy:** Think of a corporate hierarchy where the CEO (root) must always be the highest-paid person. Every manager must earn more than their direct reports. If you fire the CEO, the highest-paid VP takes over, and the chain adjusts downward. This "bubbling" is exactly how heap operations work.

**Why naive fails:** Without a heap, finding the minimum of an unsorted array takes O(n) every time. If you need the minimum repeatedly (like in Dijkstra's or task scheduling), that's O(n) per extraction × O(n) extractions = O(n²). A heap gives you O(log n) per extraction, bringing it down to O(n log n).

**Approach roadmap:**
- Brute force: Sort the array every time you need min/max → O(n log n) per operation
- Better: Maintain a sorted structure like a balanced BST → O(log n) but complex
- Optimal: Heap — O(log n) insert/extract with simpler implementation via array

**Interview cheat sheet:**
- Keywords: "top K", "k-th", "stream", "median", "merge sorted", "priority", "schedule"
- What makes heaps special: O(1) access to min/max, O(log n) insert/remove, O(n) build
- The "aha moment": You don't need full sorting — you just need partial ordering
- Memory hook: "Heap = lazy sorting. Keep just enough order to always know the best element."

---

# Implement Min Heap

**Difficulty:** Medium
**GFG:** https://www.geeksforgeeks.org/problems/implementation-of-heap/1

## Description

Implement a Min Heap data structure from scratch that supports the following operations:

1. **insert(val):** Insert a new value into the heap
2. **extractMin():** Remove and return the minimum element
3. **peek():** Return the minimum element without removing it
4. **heapify(arr):** Build a heap from an arbitrary array

**Input/Output:**
- `insert(val)`: void — adds val to the heap
- `extractMin()`: int — returns and removes the minimum, or -1 if empty
- `peek()`: int — returns the minimum without removal, or -1 if empty

**Constraints:**
- 1 ≤ number of operations ≤ 10⁵
- 1 ≤ val ≤ 10⁶

**Examples:**

Example 1:
```
Input: insert(3), insert(1), insert(6), insert(5), insert(2), extractMin(), extractMin()
Output: 1, 2
Explanation: After inserting [3,1,6,5,2], heap is [1,2,6,5,3]. 
First extractMin returns 1, heap becomes [2,3,6,5].
Second extractMin returns 2, heap becomes [3,5,6].
```

Example 2:
```
Input: insert(10), peek(), insert(5), peek(), extractMin(), peek()
Output: 10, 5, 5, 10
Explanation: After insert(10), peek=10. After insert(5), 5 bubbles up to root, peek=5. 
extractMin removes 5, peek=10.
```

**Notable Edge Cases:**
- Extract from empty heap → return -1
- Insert duplicate values → both stored
- Single element extract → heap becomes empty

## In-depth Explanation

**Reframe:** Build an array-based data structure where the smallest element always sits at index 0, and we maintain this property through two operations: "bubble up" (after insertion) and "bubble down" (after extraction).

**Pattern recognition:** This is a direct implementation problem. Understanding this is prerequisite to every heap problem. The two core subroutines — siftUp and siftDown — appear in nearly every heap-related algorithm.

**Real-world analogy:** Imagine a hospital emergency room triage system. When a new patient arrives, they're placed at the end of the line, then moved forward past anyone with less severe conditions (bubble up). When the most critical patient is treated and leaves, the person at the back of the line is temporarily moved to the front, then shifted back until they find the right position (bubble down).

**Why naive fails:** Using a sorted array gives O(1) extract-min and O(1) peek, but O(n) insertion (shifting elements). Using an unsorted array gives O(1) insertion but O(n) extract-min (scanning for minimum). A heap balances both at O(log n).

**Approach roadmap:** There's really one core approach here — the standard array-based heap implementation. The key difference is understanding the two maintenance operations deeply.

**Interview cheat sheet:**
- Keywords: "implement from scratch", "priority queue internals"
- The critical subroutines: siftUp (swap with parent while smaller) and siftDown (swap with smallest child while larger)
- The "aha moment": Array index arithmetic replaces actual tree pointers
- Memory hook: "Insert at end → bubble UP. Extract root → move last to root → bubble DOWN."

## Optimal Intuition

We store the heap as a dynamic array. Insert appends to the end and "sifts up" — comparing with the parent and swapping if smaller. Extract replaces the root with the last element and "sifts down" — comparing with children and swapping with the smaller child. The array index formulas (`parent = (i-1)/2`, `left = 2i+1`, `right = 2i+2`) replace explicit tree pointers.

## Optimal Step-by-Step Solution

Let's trace through a complete sequence of operations to understand exactly how a min heap works internally.

**Test case:** `insert(3), insert(1), insert(6), insert(5), insert(2), extractMin()`
**Expected:** After all inserts, heap = `[1, 2, 6, 5, 3]`. extractMin returns `1`, heap becomes `[2, 3, 6, 5]`.

**Initial state:**
- `heap = []` (empty ArrayList)
- `size = 0`

---

**Step 1: insert(3) — Adding to empty heap**

Code executing: `heap.add(3)` then check if siftUp needed.

**Where are we?** The heap is empty. We're adding the very first element. Think of it like being the first patient to arrive at an empty ER — you're automatically the highest priority.

**What do we see right now?**
- heap = [] (empty)
- value to insert = 3
- size = 0

**The Decision:** After adding 3 at index 0, we call siftUp(0). We check `index > 0` — is `0 > 0`? No. So siftUp does nothing.

**Why this matters:** The first element has no parent to compare against. It's the root by default. There's nothing to bubble up past.

**The Action:** Simply add 3 to the array. No swapping needed.

**State AFTER step 1:**
- heap = [3]
- size = 1
- Tree: just node 3 as root

---

**Step 2: insert(1) — Bubble up triggers**

Code executing: `heap.add(1)` → adds at index 1. Then `siftUp(1)`.

**Where are we?** We've added 1 at the end of the array (index 1). In the tree, this is the left child of the root (index 0). Think of it like a new patient arriving with a more critical condition than everyone already there.

**What do we see right now?**
- heap = [3, 1]
- index = 1
- parent = (1-1)/2 = 0
- heap[1] = 1, heap[0] = 3

**The Decision:** We check `heap[index] < heap[parent]` → is `1 < 3`? YES. The child is smaller than its parent, violating the min-heap property.

**Why this matters:** In a min-heap, every parent must be ≤ its children. Right now parent 3 > child 1. We MUST fix this or the root won't be the minimum, and our entire data structure breaks.

💡 KEY INSIGHT: This is the core of siftUp — we keep swapping a newly inserted element with its parent as long as it's smaller. The element "bubbles up" to its correct position, like a lighter ball rising in water.

**The Action:** Swap heap[0] and heap[1]. Now `heap = [1, 3]`. Update index to 0 (the parent's position). Check again: `index > 0`? `0 > 0`? No — we've reached the root. Stop.

**State AFTER step 2:**
- heap = [1, 3]
- size = 2
- Tree:
```
    1
   /
  3
```
- Min is correctly at root ✓

---

**Step 3: insert(6) — No bubble up needed**

Code executing: `heap.add(6)` → adds at index 2. Then `siftUp(2)`.

**Where are we?** Element 6 goes to index 2, which is the right child of the root (index 0).

**What do we see right now?**
- heap = [1, 3, 6]
- index = 2
- parent = (2-1)/2 = 0
- heap[2] = 6, heap[0] = 1

**The Decision:** Is `6 < 1`? NO. The child is larger than the parent, so the min-heap property is already satisfied.

**Why this matters:** Not every insertion triggers a swap. If the new element is larger than its parent, it's already in a valid position. This is the "best case" for insert — O(1) when the element belongs near the bottom.

**The Action:** Do nothing. The element stays at index 2.

**State AFTER step 3:**
- heap = [1, 3, 6]
- size = 3
- Tree:
```
    1
   / \
  3   6
```

---

**Step 4: insert(5) — No bubble up needed**

Code executing: `heap.add(5)` → adds at index 3. Then `siftUp(3)`.

**What do we see right now?**
- heap = [1, 3, 6, 5]
- index = 3
- parent = (3-1)/2 = 1
- heap[3] = 5, heap[1] = 3

**The Decision:** Is `5 < 3`? NO. Parent 3 is already smaller than child 5. Valid.

**The Action:** No swap needed.

**State AFTER step 4:**
- heap = [1, 3, 6, 5]
- size = 4
- Tree:
```
      1
     / \
    3   6
   /
  5
```

---

**Step 5: insert(2) — Bubble up one level**

Code executing: `heap.add(2)` → adds at index 4. Then `siftUp(4)`.

**Where are we?** Element 2 is placed at index 4, which is the right child of index 1 (value 3).

**What do we see right now?**
- heap = [1, 3, 6, 5, 2]
- index = 4
- parent = (4-1)/2 = 1
- heap[4] = 2, heap[1] = 3

**The Decision:** Is `2 < 3`? YES. Child 2 is smaller than parent 3 — violation!

**The Action:** Swap heap[1] and heap[4]. heap becomes `[1, 2, 6, 5, 3]`. Update index to 1.

Now check again: index = 1, parent = (1-1)/2 = 0. Is `heap[1] < heap[0]`? Is `2 < 1`? NO. Stop.

**Why this matters:** Element 2 bubbled up one level but stopped because the root (1) is already smaller. It found its correct position — smaller than its children (5 and 3), larger than its parent (1).

**State AFTER step 5:**
- heap = [1, 2, 6, 5, 3]
- size = 5
- Tree:
```
      1
     / \
    2   6
   / \
  5   3
```

---

**Step 6: extractMin() — The complex operation**

Code executing: First, save `min = heap[0] = 1`. Then `heap[0] = heap[size-1]` → move last element (3) to root. Remove last element. Call `siftDown(0)`.

**Where are we?** We need to remove the root (minimum = 1). But we can't just delete it — that would leave two disconnected subtrees. So we use a clever trick: replace the root with the LAST element, remove the last, then fix the heap by sifting down.

**What do we see right now (after moving last to root)?**
- heap = [3, 2, 6, 5]
- size = 4
- min saved = 1
- Tree (TEMPORARILY INVALID):
```
      3     ← was 1, now 3 (from the end)
     / \
    2   6
   /
  5
```
- This violates min-heap because 3 > 2 (its left child)

**The Decision in siftDown:** At index 0, left child = index 1 (value 2), right child = index 2 (value 6). Find the SMALLEST child: min(2, 6) = 2 at index 1. Is `heap[0] > heap[1]`? Is `3 > 2`? YES — swap!

💡 KEY INSIGHT: During siftDown, we ALWAYS swap with the SMALLER child. Why? If we swapped with the larger child, that larger child would become the parent of the smaller child, violating the heap property. By choosing the smaller child, we guarantee the new parent is ≤ both children.

**The Action:** Swap heap[0] and heap[1]. heap = `[2, 3, 6, 5]`. Now at index 1.

Continue siftDown at index 1: left child = index 3 (value 5). Right child = index 4 → out of bounds (size is 4). Only one child: 5. Is `3 > 5`? NO. Stop.

**State AFTER step 6:**
- heap = [2, 3, 6, 5]
- size = 4
- returned = 1
- Tree:
```
      2
     / \
    3   6
   /
  5
```
- Min-heap property restored ✓

---

**Why does this work? (Correctness proof for beginners):**

Every time we insert, we place the element at the bottom and let it rise to its natural level. Every time we extract, we temporarily break the heap by putting an arbitrary element at the root, then let it sink to its natural level. The invariant is maintained: after every operation, every parent ≤ its children. This means the root is ALWAYS the minimum — it can't be anything else, because if a smaller element existed deeper in the tree, it would have already bubbled up past its parent.

**The Key Invariant:** "At every moment between operations, the element at index 0 is the smallest element in the entire heap, and every parent is ≤ both its children."

**Beginner Mistakes:**
1. **Using `(i-1)/2` with index 0:** When `i = 0`, parent = `(0-1)/2`. In Java, integer division of -1/2 = 0, so you'd compare the root with itself. Always check `i > 0` before siftUp.
2. **Forgetting to swap with the SMALLER child during siftDown:** Swapping with the larger child creates a new violation. Always find the minimum of left and right children first.
3. **Off-by-one in child index bounds:** Before accessing `heap[rightChild]`, verify `rightChild < size`. The last level may not have a right child.
4. **Not reducing size after extractMin:** If you swap last element to root but don't decrease size, the "removed" element is still accessible and corrupts future operations.

**What if the interviewer asks "Why not just use a sorted array?"** — Sorted array gives O(1) extract-min and O(1) peek, but insertion requires finding the position (O(log n) binary search) PLUS shifting elements (O(n)). Heap gives O(log n) for both insert and extract. For applications with many inserts and extracts (like Dijkstra's), heap wins.

**What if the interviewer asks "Why not a BST?"** — A balanced BST also gives O(log n) operations, but it's more complex to implement (rotations), uses more memory (left/right pointers per node), and has worse cache performance (pointer chasing vs. array traversal). Heaps are simpler and faster in practice for priority queue operations.

**30-second interview pitch:** "A min-heap is an array-based complete binary tree where every parent ≤ its children. Insert adds to the end and bubbles up; extract replaces root with last element and bubbles down. Both O(log n). The key insight is that array index arithmetic replaces tree pointers, giving excellent cache locality."

## Optimal In-depth Intuition

The heap is a beautiful example of trading full ordering for partial ordering. A sorted array maintains total order — every element is in its final position. A heap only maintains that parents ≤ children. This weaker guarantee is much cheaper to maintain (O(log n) vs O(n) for insertion) while still giving us instant access to the minimum.

The mathematical property we exploit is that a complete binary tree of n elements has height ⌊log₂n⌋. Both siftUp and siftDown traverse at most one path from leaf to root (or root to leaf), so they touch at most ⌊log₂n⌋ + 1 elements. This logarithmic height is what makes heaps efficient.

**Why O(n) heapify?** Building a heap bottom-up (starting from the last non-leaf and sifting down) is O(n), not O(n log n). Intuitively: most nodes are near the bottom and need very few swaps. Half the nodes are leaves (0 swaps), a quarter need at most 1 swap, an eighth need at most 2, etc. The sum telescopes to O(n).

## Optimal Algorithm

```
function insert(val):
    heap.add(val)                    // Add to end of array
    siftUp(heap.size - 1)           // Bubble up to correct position

function extractMin():
    if heap is empty: return -1
    min = heap[0]                    // Save the root (minimum)
    heap[0] = heap[size - 1]         // Move last element to root
    heap.removeLast()                // Remove the duplicate at end
    siftDown(0)                      // Push root down to correct position
    return min

function siftUp(index):
    while index > 0:
        parent = (index - 1) / 2
        if heap[index] < heap[parent]:
            swap(heap[index], heap[parent])
            index = parent
        else:
            break                    // Heap property satisfied

function siftDown(index):
    while 2 * index + 1 < size:     // While has at least a left child
        smallest = index
        left = 2 * index + 1
        right = 2 * index + 2
        if left < size AND heap[left] < heap[smallest]:
            smallest = left
        if right < size AND heap[right] < heap[smallest]:
            smallest = right
        if smallest != index:
            swap(heap[index], heap[smallest])
            index = smallest
        else:
            break                    // Heap property satisfied
```

The `siftUp` block handles insertions: the new element starts at the bottom and rises if it's smaller than its parent. The `siftDown` block handles extractions: the misplaced root element sinks by swapping with its smallest child until it reaches a valid position.

## Optimal Code

```java
class MinHeap {
    private List<Integer> heap;
    
    public MinHeap() {
        heap = new ArrayList<>();
    }
    
    // Build heap from arbitrary array - O(n)
    public MinHeap(int[] arr) {
        heap = new ArrayList<>();
        for (int val : arr) heap.add(val);
        // Start from last non-leaf node and sift down each
        for (int i = (heap.size() / 2) - 1; i >= 0; i--) {
            siftDown(i);
        }
    }
    
    public void insert(int val) {
        heap.add(val);
        siftUp(heap.size() - 1);
    }
    
    public int extractMin() {
        if (heap.isEmpty()) return -1;
        int min = heap.get(0);
        int last = heap.get(heap.size() - 1);
        heap.set(0, last);
        heap.remove(heap.size() - 1);
        if (!heap.isEmpty()) siftDown(0);
        return min;
    }
    
    public int peek() {
        return heap.isEmpty() ? -1 : heap.get(0);
    }
    
    private void siftUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap.get(i) < heap.get(parent)) {
                swap(i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }
    
    private void siftDown(int i) {
        int size = heap.size();
        while (2 * i + 1 < size) {
            int smallest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            if (left < size && heap.get(left) < heap.get(smallest)) {
                smallest = left;
            }
            if (right < size && heap.get(right) < heap.get(smallest)) {
                smallest = right;
            }
            if (smallest != i) {
                swap(i, smallest);
                i = smallest;
            } else {
                break;
            }
        }
    }
    
    private void swap(int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }
}
```

## Optimal Complexity

**Time:**
- `insert`: O(log n) — siftUp traverses at most the height of the tree, which is ⌊log₂n⌋ for a complete binary tree of n elements
- `extractMin`: O(log n) — siftDown similarly traverses at most the height
- `peek`: O(1) — just read index 0
- `heapify` (constructor from array): O(n) — each node sifts down at most its height. Sum of heights across all nodes = n - 1 - ⌊log₂n⌋ ≈ O(n)

**Space:** O(n) — the array stores all n elements. No extra pointers needed (unlike BST).

## Optimal Hints

1. Start by thinking about where a new element should go in a complete binary tree — always the next available position (end of array).
2. After placing an element, how do you fix violations? Compare with parent and swap if needed.
3. For extraction, you can't just remove the root. What if you replace it with the last element?
4. After replacing root with last element, which child should you swap with during siftDown? Think about what maintains the property for BOTH children.
5. For building a heap from an array: you could insert one by one (O(n log n)), but there's a smarter O(n) way — start from the bottom-right and sift down.
6. The parent formula `(i-1)/2` and child formulas `2i+1`, `2i+2` are the entire magic — no pointers needed.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz1-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz1-grid{grid-template-columns:1fr}}
.viz1-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz1-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz1-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz1-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz1-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz1-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
.viz1-btn:disabled{opacity:0.3}
.viz1-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>

<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar1"></div>

<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz1-btn" id="prev1" onclick="prev1()">← Prev</button>
  <button class="viz1-btn" id="next1" onclick="next1()">Next →</button>
  <button class="viz1-btn" id="auto1" onclick="toggleAuto1()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel1">Ready</span>
</div>

<div class="viz1-grid">
  <div>
    <div class="viz1-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Heap (Tree + Array)</div>
      <svg id="svg1" width="100%" viewBox="0 0 460 320"></svg>
    </div>
    <div class="viz1-state" id="state1"></div>
    <div class="viz1-code" id="code1"></div>
  </div>
  <div>
    <div class="viz1-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz1-log" id="log1"></div>
    </div>
    <div class="viz1-expl" id="expl1"></div>
  </div>
</div>

<script>
const CODE_LINES_1 = [
    "heap.add(val);",
    "siftUp(heap.size - 1);",
    "  while (i > 0):",
    "    parent = (i-1)/2",
    "    if heap[i] < heap[parent]: swap",
    "    i = parent",
    "min = heap[0];",
    "heap[0] = heap[last]; removeLast();",
    "siftDown(0);",
    "  smallest = min(left, right, cur)",
    "  if smallest != i: swap, continue",
    "  else: break"
];

const TCS_1 = [
    { name: "Insert + Extract", data: { ops: [{t:'ins',v:3},{t:'ins',v:1},{t:'ins',v:6},{t:'ins',v:5},{t:'ins',v:2},{t:'ext'}] }},
    { name: "All Inserts Sorted", data: { ops: [{t:'ins',v:1},{t:'ins',v:2},{t:'ins',v:3},{t:'ins',v:4},{t:'ins',v:5}] }},
    { name: "Reverse Order", data: { ops: [{t:'ins',v:5},{t:'ins',v:4},{t:'ins',v:3},{t:'ins',v:2},{t:'ins',v:1},{t:'ext'},{t:'ext'}] }}
];

let steps1 = [], stepIdx1 = -1, autoInt1 = null, tcIdx1 = 0;

function buildSteps1(tc) {
    steps1 = [];
    const heap = [];
    
    function addStep(msg, color, codeLine, explanation, highlight, swapPair) {
        steps1.push({
            msg, color, codeLine, explanation,
            heap: [...heap],
            highlight: highlight || {},
            swapPair: swapPair || null,
            variables: {
                'heap[]': '[' + heap.join(', ') + ']',
                'size': heap.size || heap.length
            },
            changedVars: new Set()
        });
    }
    
    function siftUp(idx) {
        while (idx > 0) {
            const parent = Math.floor((idx - 1) / 2);
            addStep(`siftUp: compare heap[${idx}]=${heap[idx]} with parent heap[${parent}]=${heap[parent]}`, '#818cf8', 3,
                `We compare the element at index ${idx} (value ${heap[idx]}) with its parent at index ${parent} (value ${heap[parent]}). Parent index = (${idx}-1)/2 = ${parent}.`,
                {[idx]: '#4f8ff7', [parent]: '#f59e0b'});
            
            if (heap[idx] < heap[parent]) {
                const tmp = heap[idx];
                heap[idx] = heap[parent];
                heap[parent] = tmp;
                addStep(`Swap! heap[${parent}]=${heap[parent]}, heap[${idx}]=${heap[idx]}`, '#34d399', 4,
                    `${tmp} < ${heap[idx]}, so we swap them. Element ${heap[parent]} bubbles up to index ${parent}.`,
                    {[parent]: '#34d399', [idx]: '#f59e0b'}, [parent, idx]);
                idx = parent;
            } else {
                addStep(`No swap needed: ${heap[idx]} >= ${heap[parent]}. siftUp done.`, '#71717a', 5,
                    `The element ${heap[idx]} is already >= its parent ${heap[parent]}. Heap property satisfied. Stop sifting.`,
                    {[idx]: '#4f8ff7', [parent]: '#34d399'});
                break;
            }
        }
        if (idx === 0 && heap.length > 0) {
            addStep(`Reached root. siftUp complete.`, '#71717a', 5,
                `Element ${heap[0]} is now at the root (index 0). No more parents to compare with.`,
                {0: '#34d399'});
        }
    }
    
    function siftDown(idx) {
        const size = heap.length;
        while (2 * idx + 1 < size) {
            let smallest = idx;
            const left = 2 * idx + 1;
            const right = 2 * idx + 2;
            
            let compMsg = `siftDown at ${idx}: left=${left < size ? heap[left] : 'none'}, right=${right < size ? heap[right] : 'none'}`;
            addStep(compMsg, '#818cf8', 9,
                `At index ${idx} (value ${heap[idx]}), checking children. Left child at ${left}${left < size ? '='+heap[left] : ' (none)'}. Right child at ${right}${right < size ? '='+heap[right] : ' (none)'}.`,
                {[idx]: '#f59e0b', ...(left < size ? {[left]: '#818cf8'} : {}), ...(right < size ? {[right]: '#818cf8'} : {})});
            
            if (left < size && heap[left] < heap[smallest]) smallest = left;
            if (right < size && heap[right] < heap[smallest]) smallest = right;
            
            if (smallest !== idx) {
                addStep(`Smallest child: heap[${smallest}]=${heap[smallest]}. Swap with heap[${idx}]=${heap[idx]}`, '#34d399', 10,
                    `The smallest among current (${heap[idx]}), left (${left < size ? heap[left] : '-'}), right (${right < size ? heap[right] : '-'}) is ${heap[smallest]} at index ${smallest}. Swap!`,
                    {[smallest]: '#34d399', [idx]: '#f59e0b'}, [idx, smallest]);
                const tmp = heap[idx]; heap[idx] = heap[smallest]; heap[smallest] = tmp;
                idx = smallest;
            } else {
                addStep(`Current ${heap[idx]} is already smallest. siftDown done.`, '#71717a', 11,
                    `Element ${heap[idx]} is ≤ both children. Heap property satisfied at this position. Stop.`,
                    {[idx]: '#34d399'});
                break;
            }
        }
    }
    
    for (const op of tc.ops) {
        if (op.t === 'ins') {
            addStep(`INSERT ${op.v}: add to end (index ${heap.length})`, '#4f8ff7', 0,
                `Inserting ${op.v}. Place it at the end of the array (index ${heap.length}). Then sift up to restore heap property.`,
                {});
            heap.push(op.v);
            addStep(`Heap after adding ${op.v}: [${heap.join(', ')}]`, '#4f8ff7', 0,
                `Added ${op.v} at index ${heap.length - 1}. Now check if it needs to bubble up.`,
                {[heap.length - 1]: '#4f8ff7'});
            if (heap.length > 1) siftUp(heap.length - 1);
        } else if (op.t === 'ext') {
            if (heap.length === 0) {
                addStep('EXTRACT_MIN: heap is empty!', '#ef4444', 6, 'Cannot extract from empty heap.', {});
                continue;
            }
            const min = heap[0];
            addStep(`EXTRACT_MIN: min = heap[0] = ${min}`, '#f59e0b', 6,
                `The minimum element is at the root: ${min}. We'll save it, move the last element to the root, then sift down.`,
                {0: '#f59e0b'});
            heap[0] = heap[heap.length - 1];
            heap.pop();
            addStep(`Move last element to root: [${heap.join(', ')}]`, '#f59e0b', 7,
                `Replaced root with last element (${heap[0]}). Removed the duplicate. Now sift down from root.`,
                {0: '#ef4444'});
            if (heap.length > 0) siftDown(0);
            addStep(`Extract complete. Returned ${min}. Heap: [${heap.join(', ')}]`, '#34d399', 11,
                `Heap property restored. The new minimum is ${heap.length > 0 ? heap[0] : 'N/A (empty)'}.`,
                heap.length > 0 ? {0: '#34d399'} : {});
        }
    }
}

function getTreePositions(n) {
    const pos = [];
    if (n === 0) return pos;
    const levels = Math.floor(Math.log2(n)) + 1;
    const baseWidth = 420;
    for (let i = 0; i < n; i++) {
        const level = Math.floor(Math.log2(i + 1));
        const posInLevel = i - (Math.pow(2, level) - 1);
        const nodesInLevel = Math.min(Math.pow(2, level), n - (Math.pow(2, level) - 1));
        const totalInLevel = Math.pow(2, level);
        const spacing = baseWidth / (totalInLevel + 1);
        const x = 20 + spacing * (posInLevel + 1);
        const y = 40 + level * 60;
        pos.push({x, y});
    }
    return pos;
}

function render1() {
    const s = steps1[stepIdx1];
    if (!s) return;
    
    const svg = document.getElementById('svg1');
    const heap = s.heap;
    const n = heap.length;
    let svgHtml = '';
    
    // Draw tree
    const positions = getTreePositions(n);
    
    // Edges
    for (let i = 1; i < n; i++) {
        const parent = Math.floor((i - 1) / 2);
        const p = positions[parent], c = positions[i];
        const edgeColor = (s.swapPair && ((s.swapPair[0]===parent && s.swapPair[1]===i)||(s.swapPair[0]===i && s.swapPair[1]===parent))) ? '#f59e0b' : '#3f3f46';
        svgHtml += `<line x1="${p.x}" y1="${p.y+18}" x2="${c.x}" y2="${c.y-18}" stroke="${edgeColor}" stroke-width="1.5"/>`;
    }
    
    // Nodes
    for (let i = 0; i < n; i++) {
        const {x, y} = positions[i];
        const fill = s.highlight[i] ? s.highlight[i] + '22' : '#1a1a20';
        const stroke = s.highlight[i] || '#3f3f46';
        const textColor = s.highlight[i] ? '#fafaf9' : '#a1a1aa';
        svgHtml += `<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
        svgHtml += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${textColor}" font-family="JetBrains Mono,monospace">${heap[i]}</text>`;
        svgHtml += `<text x="${x}" y="${y+28}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">i=${i}</text>`;
    }
    
    // Array representation below tree
    const arrY = 240;
    const boxW = 44, gap = 4, startX = 20;
    for (let i = 0; i < n; i++) {
        const x = startX + i * (boxW + gap);
        const color = s.highlight[i] || '#2a2a33';
        const textColor = s.highlight[i] ? '#fafaf9' : '#a1a1aa';
        svgHtml += `<text x="${x + boxW/2}" y="${arrY - 8}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        svgHtml += `<rect x="${x}" y="${arrY}" width="${boxW}" height="36" rx="6" fill="${color}22" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svgHtml += `<text x="${x + boxW/2}" y="${arrY + 19}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${textColor}" font-family="JetBrains Mono,monospace">${heap[i]}</text>`;
    }
    if (n > 0) {
        svgHtml += `<text x="10" y="${arrY + 19}" text-anchor="start" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace" transform="translate(-5,0)">arr</text>`;
    }
    
    svg.innerHTML = svgHtml;
    
    // State
    const stateEl = document.getElementById('state1');
    let stateHtml = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    stateHtml += `<tr><td style="padding:4px 10px;color:#52525b;font-weight:600;width:30%">heap[]</td><td style="padding:4px 10px;color:#b8b8be">[${heap.join(', ')}]</td></tr>`;
    stateHtml += `<tr><td style="padding:4px 10px;color:#52525b;font-weight:600">size</td><td style="padding:4px 10px;color:#b8b8be">${heap.length}</td></tr>`;
    stateHtml += '</table>';
    stateEl.innerHTML = stateHtml;
    
    // Code
    const codeEl = document.getElementById('code1');
    let codeHtml = '';
    CODE_LINES_1.forEach((line, i) => {
        const isActive = i === s.codeLine;
        const bg = isActive ? 'rgba(79,143,247,0.15)' : 'transparent';
        const color = isActive ? '#93c5fd' : '#3f3f46';
        const weight = isActive ? '600' : '400';
        codeHtml += `<div style="padding:2px 8px;border-radius:4px;background:${bg};color:${color};font-weight:${weight};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    codeEl.innerHTML = codeHtml;
    
    // Log
    let logHtml = '';
    for (let i = 0; i <= stepIdx1; i++) {
        const marker = i === stepIdx1 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps1[i].color}">${marker}${steps1[i].msg}</div>`;
    }
    document.getElementById('log1').innerHTML = logHtml;
    document.getElementById('log1').scrollTop = 99999;
    
    document.getElementById('expl1').innerHTML = s.explanation;
    document.getElementById('stepLabel1').textContent = `Step ${stepIdx1 + 1} / ${steps1.length}`;
    document.getElementById('prev1').disabled = stepIdx1 <= 0;
    document.getElementById('next1').disabled = stepIdx1 >= steps1.length - 1;
}

function next1() { if (stepIdx1 < steps1.length - 1) { stepIdx1++; render1(); } }
function prev1() { if (stepIdx1 > 0) { stepIdx1--; render1(); } }
function toggleAuto1() {
    if (autoInt1) { clearInterval(autoInt1); autoInt1 = null; document.getElementById('auto1').textContent = '▶ Auto'; }
    else { autoInt1 = setInterval(() => { if (stepIdx1 >= steps1.length - 1) { toggleAuto1(); return; } next1(); }, 1200);
        document.getElementById('auto1').textContent = '⏸ Pause'; }
}
function loadTc1(idx) {
    tcIdx1 = idx; stepIdx1 = 0;
    buildSteps1(TCS_1[idx].data);
    document.querySelectorAll('[data-tc1]').forEach((b, i) => { b.className = i === idx ? 'viz1-btn active' : 'viz1-btn'; });
    render1();
}

const tcBar1 = document.getElementById('tcBar1');
TCS_1.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'viz1-btn active' : 'viz1-btn';
    b.setAttribute('data-tc1', '');
    b.onclick = () => loadTc1(i);
    tcBar1.appendChild(b);
});
buildSteps1(TCS_1[0].data); stepIdx1 = 0; render1();
</script>
</div>

---

# Check if Array Represents a Min Heap

**Difficulty:** Medium
**GFG:** https://www.geeksforgeeks.org/problems/does-array-represent-heap4702/1
**YouTube:** https://www.youtube.com/watch?v=HqPJF2L5h9U

## Description

Given an array `arr[]` of size `n`, determine whether it represents a valid Min-Heap.

A valid min-heap means: for every node at index `i`, the value at `i` is less than or equal to the values at its children (`2*i + 1` and `2*i + 2`, if they exist).

**Input:** An integer array `arr[]` of size `n`
**Output:** `true` if the array represents a valid min-heap, `false` otherwise

**Constraints:**
- 1 ≤ n ≤ 10⁶
- 1 ≤ arr[i] ≤ 10⁶

**Examples:**

Example 1:
```
Input: arr = [1, 3, 5, 7, 9, 8, 6]
Output: true
Explanation: 
  - arr[0]=1 ≤ arr[1]=3 ✓, arr[0]=1 ≤ arr[2]=5 ✓
  - arr[1]=3 ≤ arr[3]=7 ✓, arr[1]=3 ≤ arr[4]=9 ✓
  - arr[2]=5 ≤ arr[5]=8 ✓, arr[2]=5 ≤ arr[6]=6 ✓
  All parents ≤ children → valid min-heap
```

Example 2:
```
Input: arr = [3, 1, 5, 7, 9]
Output: false
Explanation: arr[0]=3 > arr[1]=1. Parent is greater than child → NOT a valid min-heap.
```

Example 3:
```
Input: arr = [5]
Output: true
Explanation: Single element → trivially a valid heap.
```

**Notable Edge Cases:**
- Single element: always true
- Two elements: just check `arr[0] ≤ arr[1]`
- All equal elements: always a valid min-heap

## In-depth Explanation

**Reframe:** Check whether every parent node in the implicit binary tree satisfies `parent ≤ children`. That's it — just validate the heap property at every internal node.

**Pattern recognition:** This is a straightforward array traversal with the heap index formulas. It's a verification problem, not a construction problem.

**Real-world analogy:** Imagine you're auditing a corporate hierarchy to verify that every manager earns less than or equal to their direct reports (in a weird "lowest salary leads" company). You just check each manager, one by one.

**Why naive fails:** There's no "naive" that fails here — the straightforward approach IS optimal. You must check every internal node, and there are ⌊n/2⌋ of them.

**Approach roadmap:** Only one approach — iterate through all internal nodes (indices 0 to n/2 - 1) and verify the heap property. O(n) time, O(1) space.

**Interview cheat sheet:**
- Keywords: "verify", "valid heap", "check property"
- This is the simplest heap problem — use it to demonstrate understanding of heap indexing
- The "aha moment": You only need to check internal nodes (first half of array), leaves have no children
- Memory hook: "For each parent, check both kids. Stop at the halfway mark — leaves can't violate anything."

## Optimal Intuition

We iterate from index 0 to `n/2 - 1` (the last internal node). For each index `i`, we check if `arr[i] ≤ arr[2*i+1]` (left child) and `arr[i] ≤ arr[2*i+2]` (right child, if it exists). If any violation is found, return false. If we complete the loop, return true.

## Optimal Step-by-Step Solution

**Test case:** `arr = [1, 3, 5, 7, 9, 8, 6]`, n = 7
**Expected output:** `true`

**Initial state:**
- arr = [1, 3, 5, 7, 9, 8, 6]
- n = 7
- Last internal node index = n/2 - 1 = 7/2 - 1 = 2
- We'll check indices 0, 1, 2

---

**Step 1: Check index 0 (value 1)**

Code executing: `if (arr[0] > arr[2*0+1])` → `if (1 > 3)` → `if (1 > arr[1])`

**Where are we?** At the root of the heap. This is the most important node — if the root violates the property, the entire structure is invalid.

**What do we see right now?**
- i = 0
- arr[0] = 1 (current parent)
- left child: arr[1] = 3
- right child: arr[2] = 5

**The Decision:** Is `1 > 3`? NO. Is `1 > 5`? NO. Both children are ≥ parent. This node passes.

**State AFTER step 1:** i = 0 ✓, moving to i = 1

---

**Step 2: Check index 1 (value 3)**

Code executing: `if (arr[1] > arr[3])` → `if (3 > 7)`

**What do we see right now?**
- i = 1
- arr[1] = 3
- left child: arr[3] = 7
- right child: arr[4] = 9

**The Decision:** Is `3 > 7`? NO. Is `3 > 9`? NO. Both pass.

**State AFTER step 2:** i = 1 ✓, moving to i = 2

---

**Step 3: Check index 2 (value 5)**

Code executing: `if (arr[2] > arr[5])` → `if (5 > 8)`

**What do we see right now?**
- i = 2
- arr[2] = 5
- left child: arr[5] = 8
- right child: arr[6] = 6

**The Decision:** Is `5 > 8`? NO. Is `5 > 6`? NO. Both pass.

💡 KEY INSIGHT: We only iterated through 3 nodes (indices 0-2) even though the array has 7 elements. Nodes at indices 3, 4, 5, 6 are all leaves — they have no children to violate the property against. This is why we only loop to `n/2 - 1`.

**State AFTER step 3:** All internal nodes checked, no violations found → return `true`!

---

Now let's trace the FAILING case: `arr = [3, 1, 5, 7, 9]`, n = 5

**Step 1: Check index 0 (value 3)**
- left child: arr[1] = 1
- Is `3 > 1`? **YES!** → Violation found immediately. Return `false`.

The parent (3) is greater than its left child (1). In a min-heap, the parent must be ≤ children. This single check is enough to reject the entire array.

---

**Why does this work?** The min-heap property is a LOCAL property — each node only needs to satisfy `parent ≤ children` with its immediate children. If every internal node satisfies this, then by transitivity, the root is ≤ everything (because it's ≤ its children, which are ≤ their children, and so on). So checking each internal node once is both necessary and sufficient.

**The Key Invariant:** "After checking indices 0 through i, we know the heap property holds for all nodes in that range."

**Beginner Mistakes:**
1. **Checking ALL nodes instead of just internal nodes:** Indices `n/2` through `n-1` are leaves. Checking them means accessing `arr[2*i+1]` which is out of bounds. Always stop at `n/2 - 1`.
2. **Forgetting the right child might not exist:** When `n` is even, the last internal node has only a left child. Always check `2*i+2 < n` before accessing the right child.
3. **Using strict `<` instead of `≤`:** A min-heap allows equal values. `arr[parent] == arr[child]` is valid. Use `>` to check for violations, not `>=`.

**30-second interview pitch:** "To verify a min-heap, check every internal node (indices 0 to n/2-1) and confirm each is ≤ its children. O(n) time, O(1) space. Only need to check the first half because the second half are all leaves."

## Optimal In-depth Intuition

The elegance here is recognizing that in an array-based heap with n elements, exactly ⌊n/2⌋ nodes are internal (have at least one child). The remaining ⌈n/2⌉ are leaves. This comes from the complete binary tree property: the last internal node is the parent of the last element, at index `⌊(n-1-1)/2⌋ = ⌊n/2⌋ - 1`. Everything after this index is a leaf with no children to compare against.

## Optimal Algorithm

```
function isMinHeap(arr, n):
    for i = 0 to (n/2 - 1):           // Only check internal nodes
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n AND arr[i] > arr[left]:
            return false               // Left child violation
        if right < n AND arr[i] > arr[right]:
            return false               // Right child violation
    return true                         // All checks passed
```

## Optimal Code

```java
class Solution {
    public boolean isMinHeap(int[] arr, int n) {
        // Only check internal nodes: indices 0 to n/2 - 1
        for (int i = 0; i <= (n / 2) - 1; i++) {
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            // Check left child
            if (left < n && arr[i] > arr[left]) {
                return false;
            }
            // Check right child (may not exist)
            if (right < n && arr[i] > arr[right]) {
                return false;
            }
        }
        return true;
    }
}
```

## Optimal Complexity

**Time:** O(n) — We iterate through ⌊n/2⌋ internal nodes, doing O(1) work at each (two comparisons). This simplifies to O(n).

**Space:** O(1) — Only a few index variables used. No extra data structures.

## Optimal Hints

1. What's the relationship between a parent at index `i` and its children in an array-based heap?
2. Do you need to check every element, or can you skip some? Think about which elements have children.
3. The last internal node is at index `n/2 - 1`. Everything after that is a leaf.
4. Be careful with the right child — it might not exist if `n` is even.
5. A single violation is enough to return false immediately.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz2-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz2-grid{grid-template-columns:1fr}}
.viz2-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz2-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz2-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz2-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz2-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
.viz2-btn:disabled{opacity:0.3}
.viz2-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>

<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar2"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz2-btn" id="prev2" onclick="prev2()">← Prev</button>
  <button class="viz2-btn" id="next2" onclick="next2()">Next →</button>
  <button class="viz2-btn" id="auto2" onclick="toggleAuto2()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel2">Ready</span>
</div>
<div class="viz2-grid">
  <div>
    <div class="viz2-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Heap Verification</div>
      <svg id="svg2" width="100%" viewBox="0 0 460 250"></svg>
    </div>
    <div class="viz2-state" id="state2"></div>
  </div>
  <div>
    <div class="viz2-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Verification Log</div>
      <div class="viz2-log" id="log2"></div>
    </div>
    <div class="viz2-expl" id="expl2"></div>
  </div>
</div>

<script>
const TCS_2 = [
    { name: "Valid Heap", data: [1, 3, 5, 7, 9, 8, 6] },
    { name: "Invalid Heap", data: [3, 1, 5, 7, 9] },
    { name: "Single Element", data: [42] }
];

let steps2 = [], stepIdx2 = -1, autoInt2 = null;

function buildSteps2(arr) {
    steps2 = [];
    const n = arr.length;
    steps2.push({ msg: `Array: [${arr.join(', ')}], n=${n}. Check indices 0 to ${Math.floor(n/2)-1}`, color:'#4f8ff7', highlight:{}, parent:-1, left:-1, right:-1, result:null,
        explanation: `We have ${n} elements. Internal nodes are indices 0 to ${Math.floor(n/2)-1}. We check each parent against its children.`, arr:[...arr] });
    
    for (let i = 0; i <= Math.floor(n/2) - 1; i++) {
        const left = 2*i+1, right = 2*i+2;
        const hl = {[i]: '#f59e0b'};
        if (left < n) hl[left] = '#818cf8';
        if (right < n) hl[right] = '#818cf8';
        
        steps2.push({ msg: `Check i=${i}: arr[${i}]=${arr[i]}, left=${left < n ? arr[left] : '-'}, right=${right < n ? arr[right] : '-'}`, color:'#818cf8', highlight:hl, parent:i, left:left<n?left:-1, right:right<n?right:-1, result:null,
            explanation: `Parent at index ${i} has value ${arr[i]}. Left child at ${left}${left<n ? '='+arr[left] : ' (none)'}. Right child at ${right}${right<n ? '='+arr[right] : ' (none)'}.`, arr:[...arr] });
        
        if (left < n && arr[i] > arr[left]) {
            steps2.push({ msg: `VIOLATION! arr[${i}]=${arr[i]} > arr[${left}]=${arr[left]} → return false`, color:'#ef4444', highlight:{[i]:'#ef4444',[left]:'#ef4444'}, parent:i, left:left, right:-1, result:false,
                explanation: `Parent ${arr[i]} > left child ${arr[left]}. This violates min-heap property! Return false immediately.`, arr:[...arr] });
            return;
        }
        if (right < n && arr[i] > arr[right]) {
            steps2.push({ msg: `VIOLATION! arr[${i}]=${arr[i]} > arr[${right}]=${arr[right]} → return false`, color:'#ef4444', highlight:{[i]:'#ef4444',[right]:'#ef4444'}, parent:i, left:-1, right:right, result:false,
                explanation: `Parent ${arr[i]} > right child ${arr[right]}. This violates min-heap property! Return false immediately.`, arr:[...arr] });
            return;
        }
        
        hl[i] = '#34d399';
        steps2.push({ msg: `i=${i} passes: ${arr[i]} ≤ ${left<n?arr[left]:'-'} and ${arr[i]} ≤ ${right<n?arr[right]:'-'} ✓`, color:'#34d399', highlight:hl, parent:i, left:left<n?left:-1, right:right<n?right:-1, result:null,
            explanation: `Parent ${arr[i]} is ≤ both children. This node satisfies the min-heap property. Move to next internal node.`, arr:[...arr] });
    }
    steps2.push({ msg: `All internal nodes checked — valid min-heap! Return true`, color:'#34d399', highlight:{}, parent:-1, left:-1, right:-1, result:true,
        explanation: `Every parent is ≤ its children. The array represents a valid min-heap.`, arr:[...arr] });
}

function getTreePos2(n) {
    const pos = [];
    for (let i = 0; i < n; i++) {
        const level = Math.floor(Math.log2(i+1));
        const posInLevel = i - (Math.pow(2,level)-1);
        const totalInLevel = Math.pow(2,level);
        const spacing = 420 / (totalInLevel+1);
        pos.push({ x: 20 + spacing*(posInLevel+1), y: 35 + level*55 });
    }
    return pos;
}

function render2() {
    const s = steps2[stepIdx2]; if (!s) return;
    const arr = s.arr, n = arr.length;
    const positions = getTreePos2(n);
    let svgHtml = '';
    
    for (let i = 1; i < n; i++) {
        const p = positions[Math.floor((i-1)/2)], c = positions[i];
        svgHtml += `<line x1="${p.x}" y1="${p.y+16}" x2="${c.x}" y2="${c.y-16}" stroke="#3f3f46" stroke-width="1.5"/>`;
    }
    for (let i = 0; i < n; i++) {
        const {x,y} = positions[i];
        const fill = s.highlight[i] ? s.highlight[i]+'22' : '#1a1a20';
        const stroke = s.highlight[i] || '#3f3f46';
        const tc = s.highlight[i] ? '#fafaf9' : '#a1a1aa';
        svgHtml += `<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
        svgHtml += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${tc}" font-family="JetBrains Mono,monospace">${arr[i]}</text>`;
    }
    document.getElementById('svg2').innerHTML = svgHtml;
    
    const stateEl = document.getElementById('state2');
    stateEl.innerHTML = `<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">
        <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">arr[]</td><td style="padding:4px 10px;color:#b8b8be">[${arr.join(', ')}]</td></tr>
        <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">checking</td><td style="padding:4px 10px;color:#fbbf24">${s.parent >= 0 ? 'i=' + s.parent + ' (val=' + arr[s.parent] + ')' : '—'}</td></tr>
        <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">result</td><td style="padding:4px 10px;color:${s.result===true?'#34d399':s.result===false?'#ef4444':'#71717a'}">${s.result===true?'TRUE (valid)':s.result===false?'FALSE (invalid)':'checking...'}</td></tr>
    </table>`;
    
    let logHtml = '';
    for (let i = 0; i <= stepIdx2; i++) {
        const m = i === stepIdx2 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps2[i].color}">${m}${steps2[i].msg}</div>`;
    }
    document.getElementById('log2').innerHTML = logHtml;
    document.getElementById('log2').scrollTop = 99999;
    document.getElementById('expl2').innerHTML = s.explanation;
    document.getElementById('stepLabel2').textContent = `Step ${stepIdx2+1} / ${steps2.length}`;
    document.getElementById('prev2').disabled = stepIdx2 <= 0;
    document.getElementById('next2').disabled = stepIdx2 >= steps2.length - 1;
}

function next2(){if(stepIdx2<steps2.length-1){stepIdx2++;render2();}}
function prev2(){if(stepIdx2>0){stepIdx2--;render2();}}
function toggleAuto2(){
    if(autoInt2){clearInterval(autoInt2);autoInt2=null;document.getElementById('auto2').textContent='▶ Auto';}
    else{autoInt2=setInterval(()=>{if(stepIdx2>=steps2.length-1){toggleAuto2();return;}next2();},1000);document.getElementById('auto2').textContent='⏸ Pause';}
}
function loadTc2(idx){
    stepIdx2=0; buildSteps2(TCS_2[idx].data);
    document.querySelectorAll('[data-tc2]').forEach((b,i)=>{b.className=i===idx?'viz2-btn active':'viz2-btn';});
    render2();
}
const tcBar2=document.getElementById('tcBar2');
TCS_2.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz2-btn active':'viz2-btn';b.setAttribute('data-tc2','');b.onclick=()=>loadTc2(i);tcBar2.appendChild(b);});
buildSteps2(TCS_2[0].data);stepIdx2=0;render2();
</script>
</div>

---

# Convert Min Heap to Max Heap

**Difficulty:** Medium
**GFG:** https://www.geeksforgeeks.org/problems/convert-min-heap-to-max-heap/1
**YouTube:** https://www.youtube.com/watch?v=HqPJF2L5h9U

## Description

Given an array representing a Min-Heap, convert it into a Max-Heap. The conversion should be done in-place.

**Input:** An integer array `arr[]` of size `n` that represents a valid min-heap.
**Output:** The same array rearranged to represent a valid max-heap.

**Constraints:**
- 1 ≤ n ≤ 10⁵
- 1 ≤ arr[i] ≤ 10⁹

**Examples:**

Example 1:
```
Input:  arr = [1, 3, 5, 7, 9, 8, 6]  (valid min-heap)
Output: arr = [9, 7, 8, 3, 1, 5, 6]  (valid max-heap — one possible arrangement)
Explanation: After conversion, every parent ≥ its children.
  9 ≥ 7, 9 ≥ 8, 7 ≥ 3, 7 ≥ 1, 8 ≥ 5, 8 ≥ 6 ✓
```

Example 2:
```
Input:  arr = [1, 2, 3]
Output: arr = [3, 2, 1] (or [3, 1, 2])
Explanation: 3 ≥ 2 and 3 ≥ 1 ✓
```

**Notable Edge Cases:**
- Single element: already valid max-heap
- Two elements: just swap if `arr[0] < arr[1]`
- All equal elements: already valid (both min and max heap)

## In-depth Explanation

**Reframe:** Ignore that the input is a min-heap. Just treat it as an arbitrary array and build a max-heap from it. The fact that it starts as a min-heap is irrelevant to the algorithm — the optimal approach (heapify) works on ANY array.

**Pattern recognition:** This is a "build heap" problem. The key insight is that you don't need to leverage the min-heap structure at all. Just apply the standard O(n) bottom-up heapify for max-heap.

**Real-world analogy:** Imagine a company where the lowest-paid person is CEO and salary decreases down the hierarchy (min-heap). You need to reorganize so the highest-paid person is CEO (max-heap). The fastest way: start from the bottom managers and work your way up, swapping people into correct positions level by level.

**Why naive fails:** You might think: "extract-min repeatedly from the min-heap and insert into a max-heap." That's O(n log n) — extracting n elements at O(log n) each. The heapify approach is O(n).

**Approach roadmap:**
- Brute force: Extract all from min-heap, sort descending, build max-heap → O(n log n)
- Optimal: Bottom-up heapify with max-heap property → O(n)

**Interview cheat sheet:**
- Keywords: "convert", "in-place", "heap"
- The key insight: just build a max-heap from scratch on the array, ignoring the min-heap structure
- The "aha moment": Bottom-up heapify is O(n), not O(n log n)
- Memory hook: "Ignore the old order. Start from last parent, sift down with max-heap rules."

## Brute Force Intuition

Sort the array in descending order, then the largest element is at index 0. However, a sorted descending array is NOT necessarily a valid max-heap (e.g., `[5,4,3,2,1]` IS a valid max-heap, but `[9,8,7,6,5,4,3,2,1]` IS too). Actually, a descending sorted array IS always a valid max-heap because parent at index `i` has value ≥ children at `2i+1` and `2i+2`. But sorting is O(n log n), while heapify is O(n).

## Brute Force Step-by-Step Solution

**Test case:** `arr = [1, 3, 5, 7, 9, 8, 6]`
**Expected:** A valid max-heap like `[9, 8, 7, 6, 5, 3, 1]`

**Initial state:** arr = [1, 3, 5, 7, 9, 8, 6]

**Step 1: Sort in descending order**

Code executing: `Arrays.sort(arr)` then reverse.

**Where are we?** We're taking the simplest possible approach — just sort the array from largest to smallest.

**What do we see right now?**
- arr = [1, 3, 5, 7, 9, 8, 6] (unsorted for max-heap purposes)

**The Action:** Sort descending → arr = [9, 8, 7, 6, 5, 3, 1]

**Verification:** 
- arr[0]=9: children 8, 7 → 9≥8 ✓, 9≥7 ✓
- arr[1]=8: children 6, 5 → 8≥6 ✓, 8≥5 ✓
- arr[2]=7: children 3, 1 → 7≥3 ✓, 7≥1 ✓
- Valid max-heap!

This works but is O(n log n). We can do better.

**Why does this work?** A descending sorted array is always a valid max-heap. For any parent at index `i` with value `v`, its children at indices `2i+1` and `2i+2` appear later in the array, so they have smaller values. Thus `parent ≥ children` is automatically satisfied.

**The Key Invariant:** "A fully sorted descending array satisfies the max-heap property at every node."

**Beginner Mistakes:**
1. **Forgetting that sorted descending ≠ the only valid max-heap:** There are many valid max-heap arrangements. Sorting gives one, but heapify gives another equally valid one.
2. **Trying to sort in-place with O(1) extra space:** `Arrays.sort` uses O(log n) stack space for the quicksort implementation in Java.
3. **Not realizing there's an O(n) solution:** This is the biggest mistake — not knowing about bottom-up heapify.

**30-second interview pitch:** "Sort the array descending. A descending array is always a valid max-heap because every parent comes before (and is larger than) its children. Time O(n log n), Space O(log n) for sort stack."

## Brute Force In-depth Intuition

The mathematical property is straightforward: in a descending array, `arr[i] ≥ arr[j]` for all `i < j`. Since children always have higher indices than parents (`2i+1 > i` and `2i+2 > i`), every child has a smaller value than its parent. This satisfies the max-heap property.

## Brute Force Algorithm

```
function convertMinToMaxBrute(arr):
    sort arr in ascending order
    reverse arr (now descending)
    // arr is now a valid max-heap
```

## Brute Force Code

```java
class Solution {
    public void convertMinToMaxHeapBrute(int[] arr) {
        Arrays.sort(arr);
        // Reverse to get descending order
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
```

## Brute Force Complexity

**Time:** O(n log n) — dominated by the sorting step. The reversal is O(n).
**Space:** O(log n) — for Java's internal sort stack. The reversal is in-place.

## Brute Force Hints

1. What if you just sorted the array? Would a sorted array be a valid heap?
2. Think about which direction of sorting gives a max-heap.
3. In a descending sorted array, is every parent ≥ its children?

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz3b-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-top:8px}
.viz3b-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
.viz3b-btn:disabled{opacity:0.3}
.viz3b-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz3b-btn" id="prev3b" onclick="prev3b()">← Prev</button>
  <button class="viz3b-btn" id="next3b" onclick="next3b()">Next →</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel3b">Ready</span>
</div>
<div class="viz3b-card">
  <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Sort & Reverse</div>
  <svg id="svg3b" width="100%" viewBox="0 0 460 200"></svg>
</div>
<div style="padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px" id="expl3b"></div>

<script>
const BRUTE_STEPS_3 = [
    {arr:[1,3,5,7,9,8,6],hl:{},label:'Min-Heap Input',msg:'Starting array (valid min-heap): [1, 3, 5, 7, 9, 8, 6]'},
    {arr:[1,3,5,6,7,8,9],hl:{0:'#4f8ff7',1:'#4f8ff7',2:'#4f8ff7',3:'#4f8ff7',4:'#4f8ff7',5:'#4f8ff7',6:'#4f8ff7'},label:'After Sort (Ascending)',msg:'After sorting ascending: [1, 3, 5, 6, 7, 8, 9]'},
    {arr:[9,8,7,6,5,3,1],hl:{0:'#34d399',1:'#34d399',2:'#34d399',3:'#34d399',4:'#34d399',5:'#34d399',6:'#34d399'},label:'After Reverse (Descending)',msg:'After reversing: [9, 8, 7, 6, 5, 3, 1]. This IS a valid max-heap!'}
];
let stepIdx3b = 0;

function render3b() {
    const s = BRUTE_STEPS_3[stepIdx3b];
    const boxW=48,gap=4,startX=40,startY=50;
    let svg = `<text x="230" y="20" text-anchor="middle" font-size="12" font-weight="600" fill="#a1a1aa" font-family="system-ui">${s.label}</text>`;
    s.arr.forEach((v,i) => {
        const x = startX + i*(boxW+gap);
        const c = s.hl[i] || '#2a2a33';
        const tc = s.hl[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<text x="${x+boxW/2}" y="${startY-8}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="40" rx="6" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;
        svg += `<text x="${x+boxW/2}" y="${startY+21}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="${tc}" font-family="JetBrains Mono,monospace">${v}</text>`;
    });
    // Tree below
    const positions = [];
    for(let i=0;i<s.arr.length;i++){const l=Math.floor(Math.log2(i+1));const p=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const sp=380/(t+1);positions.push({x:40+sp*(p+1),y:120+l*40});}
    for(let i=1;i<s.arr.length;i++){const pi=Math.floor((i-1)/2);svg+=`<line x1="${positions[pi].x}" y1="${positions[pi].y+12}" x2="${positions[i].x}" y2="${positions[i].y-12}" stroke="#3f3f46" stroke-width="1"/>`;} 
    positions.forEach((pos,i)=>{const c=s.hl[i]||'#3f3f46';svg+=`<circle cx="${pos.x}" cy="${pos.y}" r="14" fill="${c}22" stroke="${c}" stroke-width="1.5"/>`;svg+=`<text x="${pos.x}" y="${pos.y}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="${s.hl[i]?'#fafaf9':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${s.arr[i]}</text>`;});
    document.getElementById('svg3b').innerHTML = svg;
    document.getElementById('expl3b').innerHTML = s.msg;
    document.getElementById('stepLabel3b').textContent = `Step ${stepIdx3b+1} / ${BRUTE_STEPS_3.length}`;
    document.getElementById('prev3b').disabled = stepIdx3b <= 0;
    document.getElementById('next3b').disabled = stepIdx3b >= BRUTE_STEPS_3.length - 1;
}
function next3b(){if(stepIdx3b<BRUTE_STEPS_3.length-1){stepIdx3b++;render3b();}}
function prev3b(){if(stepIdx3b>0){stepIdx3b--;render3b();}}
render3b();
</script>
</div>

## Optimal Intuition

Treat the input array as an arbitrary array (ignore the min-heap property). Apply the standard bottom-up heapify to build a max-heap. Start from the last internal node (index `n/2 - 1`) and sift down each node with the max-heap property (parent should be ≥ children, swap with the LARGER child). This runs in O(n) time.

## Optimal Step-by-Step Solution

**Test case:** `arr = [1, 3, 5, 7, 9, 8, 6]`, n = 7
**Expected:** A valid max-heap (e.g., `[9, 7, 8, 3, 1, 5, 6]`)

**Initial state:**
- arr = [1, 3, 5, 7, 9, 8, 6]
- n = 7
- Last internal node = n/2 - 1 = 2
- We'll process indices 2, 1, 0 (bottom-up)
```
        1
       / \
      3    5
     / \  / \
    7   9 8   6
```

---

**Step 1: siftDown(2) — process node at index 2 (value 5)**

Code executing: `maxHeapify(arr, 2, 7)`

**Where are we?** Starting from the last internal node. Index 2 has value 5. Its children: left = index 5 (value 8), right = index 6 (value 6).

**What do we see right now?**
- arr = [1, 3, 5, 7, 9, 8, 6]
- i = 2, arr[2] = 5
- left child: arr[5] = 8
- right child: arr[6] = 6

**The Decision:** For max-heap, parent should be ≥ children. Find the LARGEST among {5, 8, 6}. Largest = 8 at index 5. Is largest != current? Yes (5 != 5... wait, index 5 != index 2). So swap arr[2] and arr[5].

**Why this matters:** In a max-heap, we always swap with the LARGER child (opposite of min-heap). This ensures the new parent is ≥ both children.

**The Action:** Swap arr[2]=5 with arr[5]=8. arr becomes [1, 3, 8, 7, 9, 5, 6]. Node at index 5 now has value 5 — it's a leaf, so siftDown ends.

**State AFTER step 1:**
- arr = [1, 3, **8**, 7, 9, **5**, 6]
- Subtree rooted at index 2 is now a valid max-heap: 8 ≥ 5 and 8 ≥ 6 ✓

---

**Step 2: siftDown(1) — process node at index 1 (value 3)**

Code executing: `maxHeapify(arr, 1, 7)`

**Where are we?** Index 1, value 3. Children: left = index 3 (value 7), right = index 4 (value 9).

**What do we see right now?**
- arr = [1, 3, 8, 7, 9, 5, 6]
- i = 1, arr[1] = 3
- left child: arr[3] = 7
- right child: arr[4] = 9

**The Decision:** Largest among {3, 7, 9} = 9 at index 4. Swap arr[1] and arr[4].

**The Action:** Swap → arr = [1, 9, 8, 7, 3, 5, 6]. Now i = 4. Left child = 2*4+1 = 9 ≥ n=7. No children — siftDown ends.

**State AFTER step 2:**
- arr = [1, **9**, 8, 7, **3**, 5, 6]
- Subtree rooted at index 1 is valid: 9 ≥ 7 and 9 ≥ 3 ✓

---

**Step 3: siftDown(0) — process root (value 1)**

Code executing: `maxHeapify(arr, 0, 7)`

**Where are we?** The root, index 0, value 1. This is the most critical step — after this, the entire array must be a valid max-heap.

**What do we see right now?**
- arr = [1, 9, 8, 7, 3, 5, 6]
- i = 0, arr[0] = 1
- left child: arr[1] = 9
- right child: arr[2] = 8

**The Decision:** Largest among {1, 9, 8} = 9 at index 1. Swap arr[0] and arr[1].

**The Action:** Swap → arr = [9, 1, 8, 7, 3, 5, 6]. Now continue siftDown at i = 1.

**Continue siftDown at i = 1:**
- arr[1] = 1, left child arr[3] = 7, right child arr[4] = 3
- Largest among {1, 7, 3} = 7 at index 3. Swap arr[1] and arr[3].
- arr = [9, 7, 8, 1, 3, 5, 6]. Now at i = 3.

**Continue siftDown at i = 3:**
- Left child = 2*3+1 = 7 ≥ n=7. No children. Stop.

💡 KEY INSIGHT: This is why bottom-up heapify is O(n), not O(n log n). Most nodes are near the bottom and barely move. Only the root might sift down through the full height. The mathematical sum of all sift distances is O(n).

**Final state:**
- arr = [9, 7, 8, 1, 3, 5, 6]
- Verification:
  - 9 ≥ 7 ✓, 9 ≥ 8 ✓
  - 7 ≥ 1 ✓, 7 ≥ 3 ✓
  - 8 ≥ 5 ✓, 8 ≥ 6 ✓
  - Valid max-heap!

---

**Why does this work?** By processing nodes bottom-up, when we siftDown node `i`, both its subtrees are ALREADY valid max-heaps (because we processed them first). So sifting down node `i` only needs to place it correctly within its already-heapified subtrees. By the time we reach the root, every subtree is valid, and sifting the root down makes the entire tree valid.

**The Key Invariant:** "After processing index `i`, all subtrees rooted at indices `i, i+1, ..., n-1` are valid max-heaps."

**Beginner Mistakes:**
1. **Processing top-down instead of bottom-up:** If you start from the root, the subtrees aren't valid yet, so siftDown doesn't work correctly. Always start from the LAST internal node.
2. **Using siftUp instead of siftDown:** SiftUp is for individual insertions. For building a heap, siftDown from bottom-up is correct and O(n).
3. **Confusing min-heap siftDown with max-heap siftDown:** In max-heap, swap with the LARGER child. In min-heap, swap with the smaller child. Getting this wrong inverts the entire structure.

**30-second interview pitch:** "Ignore the min-heap structure. Apply bottom-up max-heapify: starting from the last internal node (n/2-1), sift each node down using max-heap rules (swap with larger child). O(n) time, O(1) space. Works because by the time we process a node, its subtrees are already valid."

## Optimal In-depth Intuition

The O(n) complexity of bottom-up heapify is non-obvious. Here's the mathematical intuition: at the bottom level, there are ~n/2 nodes that need 0 swaps (leaves). At the next level, ~n/4 nodes need at most 1 swap. At the next, ~n/8 need at most 2 swaps. The total work is: n/4 × 1 + n/8 × 2 + n/16 × 3 + ... = n × Σ(k/2^(k+1)) for k=1 to log n. This sum converges to n × 1 = O(n). The key: most nodes do very little work because they're near the bottom.

## Optimal Algorithm

```
function convertMinToMaxHeap(arr, n):
    // Start from last internal node, go up to root
    for i = (n/2 - 1) down to 0:
        maxHeapify(arr, i, n)

function maxHeapify(arr, i, n):
    while true:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n AND arr[left] > arr[largest]:
            largest = left
        if right < n AND arr[right] > arr[largest]:
            largest = right
        if largest != i:
            swap(arr[i], arr[largest])
            i = largest              // Continue sifting down
        else:
            break                    // Heap property satisfied
```

## Optimal Code

```java
class Solution {
    public void convertMinToMaxHeap(int[] arr, int n) {
        // Bottom-up heapify: start from last internal node
        for (int i = (n / 2) - 1; i >= 0; i--) {
            maxHeapify(arr, i, n);
        }
    }
    
    private void maxHeapify(int[] arr, int i, int n) {
        while (true) {
            int largest = i;
            int left = 2 * i + 1;
            int right = 2 * i + 2;
            
            if (left < n && arr[left] > arr[largest]) {
                largest = left;
            }
            if (right < n && arr[right] > arr[largest]) {
                largest = right;
            }
            
            if (largest != i) {
                // Swap current with largest child
                int temp = arr[i];
                arr[i] = arr[largest];
                arr[largest] = temp;
                i = largest; // Continue sifting down
            } else {
                break; // Node is in correct position
            }
        }
    }
}
```

## Optimal Complexity

**Time:** O(n) — Bottom-up heapify processes each internal node once. The total number of swaps across all nodes sums to O(n) due to the geometric series of heights: nodes at height h need at most h swaps, and there are ≤ n/2^(h+1) nodes at height h. Sum = Σ h × n/2^(h+1) = O(n).

**Space:** O(1) — Everything is done in-place. No recursion stack needed (iterative siftDown).

## Optimal Hints

1. Do you really need to leverage the min-heap property? What if you treated the array as arbitrary?
2. How do you build a heap from an arbitrary array in O(n)? Think bottom-up.
3. Start from the last internal node (index n/2 - 1) and work backwards to index 0.
4. At each node, sift down using MAX-heap rules: swap with the LARGER child.
5. Why is this O(n) and not O(n log n)? Think about how many swaps each level needs.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz3-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz3-grid{grid-template-columns:1fr}}
.viz3-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz3-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz3-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz3-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz3-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
.viz3-btn:disabled{opacity:0.3}
.viz3-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>

<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar3"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz3-btn" id="prev3" onclick="prev3()">← Prev</button>
  <button class="viz3-btn" id="next3" onclick="next3()">Next →</button>
  <button class="viz3-btn" id="auto3" onclick="toggleAuto3()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel3">Ready</span>
</div>
<div class="viz3-grid">
  <div>
    <div class="viz3-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Min→Max Heap Conversion</div>
      <svg id="svg3" width="100%" viewBox="0 0 460 250"></svg>
    </div>
    <div class="viz3-state" id="state3"></div>
  </div>
  <div>
    <div class="viz3-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz3-log" id="log3"></div>
    </div>
    <div class="viz3-expl" id="expl3"></div>
  </div>
</div>

<script>
const TCS_3 = [
    { name: "7 elements", data: [1,3,5,7,9,8,6] },
    { name: "3 elements", data: [1,2,3] },
    { name: "Already max", data: [9,5,6,2,3] }
];

let steps3=[], stepIdx3=-1, autoInt3=null;

function buildSteps3(arr) {
    steps3 = [];
    const a = [...arr];
    const n = a.length;
    
    function addStep(msg, color, hl, expl) {
        steps3.push({msg, color, arr:[...a], highlight:hl||{}, explanation:expl});
    }
    
    addStep(`Start: [${a.join(', ')}]. Heapify from i=${Math.floor(n/2)-1} down to 0`, '#4f8ff7', {}, `Array has ${n} elements. Last internal node is at index ${Math.floor(n/2)-1}. We process each internal node bottom-up, applying max-heap siftDown.`);
    
    for (let start = Math.floor(n/2)-1; start >= 0; start--) {
        let i = start;
        addStep(`Process i=${i} (value ${a[i]})`, '#f59e0b', {[i]:'#f59e0b'}, `Starting maxHeapify at index ${i} with value ${a[i]}.`);
        
        while (2*i+1 < n) {
            let largest = i;
            const left = 2*i+1, right = 2*i+2;
            const hl = {[i]:'#f59e0b'};
            if (left < n) hl[left] = '#818cf8';
            if (right < n) hl[right] = '#818cf8';
            
            addStep(`  Compare: a[${i}]=${a[i]}, left=${left<n?a[left]:'-'}, right=${right<n?a[right]:'-'}`, '#818cf8', hl, `At index ${i} (${a[i]}): left child = ${left<n?a[left]:'none'}, right child = ${right<n?a[right]:'none'}. Find the largest.`);
            
            if (left < n && a[left] > a[largest]) largest = left;
            if (right < n && a[right] > a[largest]) largest = right;
            
            if (largest !== i) {
                addStep(`  Swap a[${i}]=${a[i]} ↔ a[${largest}]=${a[largest]}`, '#34d399', {[i]:'#ef4444',[largest]:'#34d399'}, `Largest is ${a[largest]} at index ${largest}. Swap with current ${a[i]}. Then continue sifting at index ${largest}.`);
                const tmp = a[i]; a[i] = a[largest]; a[largest] = tmp;
                i = largest;
            } else {
                addStep(`  No swap needed at i=${i}. ${a[i]} ≥ children.`, '#71717a', {[i]:'#34d399'}, `Current value ${a[i]} is already ≥ both children. Done with this node.`);
                break;
            }
        }
        if (2*i+1 >= n) {
            addStep(`  i=${i} is a leaf. siftDown complete.`, '#71717a', {[i]:'#34d399'}, `Reached a leaf node. No more children to check.`);
        }
    }
    addStep(`Done! Max-heap: [${a.join(', ')}]`, '#34d399', Object.fromEntries(a.map((_,i)=>[i,'#34d399'])), `All internal nodes processed. The array is now a valid max-heap!`);
}

function getTreePos3(n){const p=[];for(let i=0;i<n;i++){const l=Math.floor(Math.log2(i+1));const pos=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const s=420/(t+1);p.push({x:20+s*(pos+1),y:35+l*55});}return p;}

function render3(){
    const s=steps3[stepIdx3];if(!s)return;
    const arr=s.arr,n=arr.length;
    const positions=getTreePos3(n);
    let svg='';
    for(let i=1;i<n;i++){const pi=Math.floor((i-1)/2);const p=positions[pi],c=positions[i];svg+=`<line x1="${p.x}" y1="${p.y+16}" x2="${c.x}" y2="${c.y-16}" stroke="#3f3f46" stroke-width="1.5"/>`;}
    for(let i=0;i<n;i++){const{x,y}=positions[i];const fill=s.highlight[i]?s.highlight[i]+'22':'#1a1a20';const stroke=s.highlight[i]||'#3f3f46';const tc=s.highlight[i]?'#fafaf9':'#a1a1aa';
    svg+=`<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="700" fill="${tc}" font-family="JetBrains Mono,monospace">${arr[i]}</text>`;
    svg+=`<text x="${x}" y="${y+28}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">i=${i}</text>`;}
    document.getElementById('svg3').innerHTML=svg;
    
    document.getElementById('state3').innerHTML=`<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">
    <tr><td style="padding:4px 10px;color:#52525b;font-weight:600;width:30%">arr[]</td><td style="padding:4px 10px;color:#b8b8be">[${arr.join(', ')}]</td></tr>
    <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">n</td><td style="padding:4px 10px;color:#b8b8be">${n}</td></tr></table>`;
    
    let logHtml='';for(let i=0;i<=stepIdx3;i++){const m=i===stepIdx3?'▶ ':'  ';logHtml+=`<div style="color:${steps3[i].color}">${m}${steps3[i].msg}</div>`;}
    document.getElementById('log3').innerHTML=logHtml;document.getElementById('log3').scrollTop=99999;
    document.getElementById('expl3').innerHTML=s.explanation;
    document.getElementById('stepLabel3').textContent=`Step ${stepIdx3+1} / ${steps3.length}`;
    document.getElementById('prev3').disabled=stepIdx3<=0;document.getElementById('next3').disabled=stepIdx3>=steps3.length-1;
}

function next3(){if(stepIdx3<steps3.length-1){stepIdx3++;render3();}}
function prev3(){if(stepIdx3>0){stepIdx3--;render3();}}
function toggleAuto3(){if(autoInt3){clearInterval(autoInt3);autoInt3=null;document.getElementById('auto3').textContent='▶ Auto';}else{autoInt3=setInterval(()=>{if(stepIdx3>=steps3.length-1){toggleAuto3();return;}next3();},1000);document.getElementById('auto3').textContent='⏸ Pause';}}
function loadTc3(idx){stepIdx3=0;buildSteps3(TCS_3[idx].data);document.querySelectorAll('[data-tc3]').forEach((b,i)=>{b.className=i===idx?'viz3-btn active':'viz3-btn';});render3();}
const tcBar3=document.getElementById('tcBar3');TCS_3.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz3-btn active':'viz3-btn';b.setAttribute('data-tc3','');b.onclick=()=>loadTc3(i);tcBar3.appendChild(b);});
buildSteps3(TCS_3[0].data);stepIdx3=0;render3();
</script>
</div>
