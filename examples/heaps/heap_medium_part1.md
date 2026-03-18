# K-th Largest Element in an Array

**Difficulty:** Medium
**LeetCode:** https://leetcode.com/problems/kth-largest-element-in-an-array/
**YouTube:** https://www.youtube.com/watch?v=hGK_5n81drs

## Description

Given an integer array `nums` and an integer `k`, return the **k-th largest** element in the array. Note that it is the k-th largest element in sorted order, not the k-th distinct element.

**Input:** `int[] nums`, `int k`
**Output:** `int` — the k-th largest element

**Constraints:**
- 1 ≤ k ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

**Examples:**

Example 1:
```
Input: nums = [3, 2, 1, 5, 6, 4], k = 2
Output: 5
Explanation: Sorted descending: [6, 5, 4, 3, 2, 1]. The 2nd largest is 5.
```

Example 2:
```
Input: nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
Output: 4
Explanation: Sorted descending: [6, 5, 5, 4, 3, 3, 2, 2, 1]. The 4th largest is 4.
```

**Notable Edge Cases:**
- k = 1: find the maximum element
- k = nums.length: find the minimum element
- Duplicate values: `[1,1,1], k=2` → answer is 1 (duplicates count)

## In-depth Explanation

**Reframe:** Find the element that would be at index `k-1` if we sorted the array in descending order. Equivalently, find the element at index `n-k` in ascending sorted order.

**Pattern recognition:** "K-th largest/smallest" screams heap. Specifically, a **min-heap of size k** efficiently tracks the k largest elements seen so far. The root of this min-heap is the k-th largest.

**Real-world analogy:** Imagine you're a talent scout maintaining a "Top K" leaderboard. As each contestant performs, you compare their score with the lowest score on your board. If they're better, they replace the worst performer. After seeing everyone, the person at the bottom of your leaderboard is the K-th best.

**Why naive fails:** Sorting the entire array (O(n log n)) works but does unnecessary work. We don't need the full sorted order — just the k-th element.

**Approach roadmap:**
- Brute force: Sort the array, return `nums[n-k]` → O(n log n)
- Optimal: Min-heap of size k → O(n log k)

**Interview cheat sheet:**
- Keywords: "k-th largest", "k-th smallest", "top K"
- Use min-heap for "k-th largest" (counterintuitive — the root is the answer)
- Use max-heap for "k-th smallest"
- The "aha moment": A min-heap of size k automatically evicts elements smaller than the k-th largest
- Memory hook: "Min-heap of size k → root IS the k-th largest. Small heap, big insight."

## Brute Force Intuition

Sort the array in ascending order. The k-th largest element is at index `n - k`. Dead simple, but we pay for full sorting when we only need one element.

## Brute Force Step-by-Step Solution

**Test case:** `nums = [3, 2, 1, 5, 6, 4], k = 2`
**Expected output:** `5`

**Initial state:**
- nums = [3, 2, 1, 5, 6, 4], k = 2, n = 6

---

**Step 1: Sort the array**

Code executing: `Arrays.sort(nums)`

**Where are we?** We're sorting the entire array to find the relative position of every element. This is like lining up all students by height to find the 2nd tallest.

**What do we see right now?**
- nums = [3, 2, 1, 5, 6, 4] (unsorted)

**The Action:** After sorting: nums = [1, 2, 3, 4, 5, 6]

**State AFTER step 1:** nums = [1, 2, 3, 4, 5, 6]

---

**Step 2: Access index n - k**

Code executing: `return nums[n - k]` → `return nums[6 - 2]` → `return nums[4]`

**Where are we?** The array is sorted ascending. The k-th largest is at index `n - k` because there are exactly `k - 1` elements larger than it (all to its right).

**What do we see right now?**
- nums = [1, 2, 3, 4, **5**, 6]
- Index:   0  1  2  3   4   5
- n - k = 6 - 2 = 4
- nums[4] = 5

💡 KEY INSIGHT: In a sorted ascending array, the k-th largest is at index `n-k`. The 1st largest (max) is at `n-1`, the 2nd largest at `n-2`, and so on.

**Return:** 5 ✓

---

**Why does this work?** After sorting, elements are in non-decreasing order. The k-th from the end (index n-k) has exactly k-1 elements ≥ it (to its right), making it the k-th largest.

**The Key Invariant:** "After sorting, `nums[i]` is the (n-i)-th largest element."

**Beginner Mistakes:**
1. **Off-by-one: using `n-k+1` or `n-k-1`:** The k-th largest in 0-indexed ascending is exactly `n-k`. Think: 1st largest = `n-1`, so k-th largest = `n-k`.
2. **Forgetting duplicates count:** `[5,5,5], k=3` → answer is 5, not undefined. Every occurrence counts.
3. **Not considering the O(n log k) heap solution:** In interviews, sorting is the "warm-up" answer. Always mention the heap improvement.

**30-second interview pitch:** "Sort the array, return `nums[n-k]`. O(n log n) time, O(1) extra space. Can improve to O(n log k) with a min-heap of size k."

## Brute Force In-depth Intuition

Sorting establishes total order. Once sorted, positional access gives us any k-th element in O(1). The cost is O(n log n) for sorting. This approach doesn't exploit the fact that we only need ONE specific element — we compute the full ordering unnecessarily.

## Brute Force Algorithm

```
function findKthLargest_brute(nums, k):
    sort nums in ascending order
    return nums[nums.length - k]
```

## Brute Force Code

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        Arrays.sort(nums);
        return nums[nums.length - k];
    }
}
```

## Brute Force Complexity

**Time:** O(n log n) — dominated by sorting (Java uses dual-pivot quicksort for primitives).
**Space:** O(log n) — for the sorting algorithm's internal stack.

## Brute Force Hints

1. What happens if you sort the array?
2. Where would the k-th largest element be in a sorted array?
3. In ascending order, the k-th largest is at index `n - k`.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz4b-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px;margin-top:8px}
.viz4b-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz4b-btn:disabled{opacity:0.3}
</style>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz4b-btn" id="prev4b" onclick="prev4b()">← Prev</button>
  <button class="viz4b-btn" id="next4b" onclick="next4b()">Next →</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel4b">Ready</span>
</div>
<div class="viz4b-card">
  <svg id="svg4b" width="100%" viewBox="0 0 460 120"></svg>
</div>
<div style="padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px" id="expl4b"></div>
<script>
const BS4=[
  {arr:[3,2,1,5,6,4],hl:{},msg:'Original array: [3, 2, 1, 5, 6, 4]. k=2. Find the 2nd largest.'},
  {arr:[1,2,3,4,5,6],hl:{0:'#4f8ff7',1:'#4f8ff7',2:'#4f8ff7',3:'#4f8ff7',4:'#4f8ff7',5:'#4f8ff7'},msg:'After sorting ascending: [1, 2, 3, 4, 5, 6].'},
  {arr:[1,2,3,4,5,6],hl:{4:'#34d399'},msg:'n-k = 6-2 = 4. nums[4] = 5. Answer: 5 ✓'}
];
let si4b=0;
function render4b(){const s=BS4[si4b];const bW=52,g=6,sx=60,sy=40;let svg='';
s.arr.forEach((v,i)=>{const x=sx+i*(bW+g);const c=s.hl[i]||'#2a2a33';const tc=s.hl[i]?'#fafaf9':'#a1a1aa';
svg+=`<text x="${x+bW/2}" y="${sy-10}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
svg+=`<rect x="${x}" y="${sy}" width="${bW}" height="40" rx="6" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;
svg+=`<text x="${x+bW/2}" y="${sy+21}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="${tc}" font-family="JetBrains Mono,monospace">${v}</text>`;});
document.getElementById('svg4b').innerHTML=svg;document.getElementById('expl4b').innerHTML=s.msg;
document.getElementById('stepLabel4b').textContent=`Step ${si4b+1}/${BS4.length}`;document.getElementById('prev4b').disabled=si4b<=0;document.getElementById('next4b').disabled=si4b>=BS4.length-1;}
function next4b(){if(si4b<BS4.length-1){si4b++;render4b();}}
function prev4b(){if(si4b>0){si4b--;render4b();}}
render4b();
</script>
</div>

## Optimal Intuition

Maintain a **min-heap of size k**. Iterate through the array: if the heap has fewer than k elements, add the current element. If the heap is full and the current element is larger than the root (the smallest in the heap), remove the root and add the current element. After processing all elements, the root of the min-heap is the k-th largest element.

## Optimal Step-by-Step Solution

**Test case:** `nums = [3, 2, 1, 5, 6, 4], k = 2`
**Expected output:** `5`

**Initial state:**
- nums = [3, 2, 1, 5, 6, 4]
- k = 2
- minHeap = [] (empty PriorityQueue)

---

**Step 1: Process nums[0] = 3**

Code executing: `minHeap.offer(3)` (heap size < k)

**Where are we?** First element. Heap has 0 elements, k = 2, so we need to fill it up to size k first.

**What do we see right now?**
- nums = [**3**, 2, 1, 5, 6, 4] ← processing index 0
- minHeap = [] (size 0 < k=2)

**The Decision:** Heap size (0) < k (2), so we unconditionally add the element.

**The Action:** Add 3. minHeap = [3], size = 1.

**State AFTER step 1:**
- minHeap = [3] (size 1)
- Elements in heap: {3}

---

**Step 2: Process nums[1] = 2**

Code executing: `minHeap.offer(2)` (heap size < k)

**What do we see right now?**
- nums = [3, **2**, 1, 5, 6, 4] ← index 1
- minHeap = [3] (size 1 < k=2)

**The Decision:** Size 1 < k=2. Still filling up.

**The Action:** Add 2. minHeap = [2, 3] (2 is the new root since it's smaller).

**State AFTER step 2:**
- minHeap = [2, 3] (size 2 = k) ← heap is now FULL
- The root (2) represents our current guess for the k-th largest

---

**Step 3: Process nums[2] = 1**

Code executing: `if (1 > minHeap.peek())` → `if (1 > 2)` → `false`

**Where are we?** The heap is full (size = k = 2). Now we only add elements that are LARGER than the root.

**What do we see right now?**
- nums = [3, 2, **1**, 5, 6, 4] ← index 2
- minHeap = [2, 3], root = 2
- current element = 1

**The Decision:** Is `1 > 2`? NO. This element is ≤ the current k-th largest. It's definitely NOT in the top k.

**Why this matters:** If we have k=2 elements in our heap and the smallest is 2, then any element ≤ 2 can't possibly be the 2nd largest (because both 2 and 3 are already larger). We safely skip it.

**The Action:** Do nothing. Skip 1.

**State AFTER step 3:**
- minHeap = [2, 3] (unchanged)

---

**Step 4: Process nums[3] = 5**

Code executing: `if (5 > minHeap.peek())` → `if (5 > 2)` → `true`

**What do we see right now?**
- nums = [3, 2, 1, **5**, 6, 4] ← index 3
- minHeap = [2, 3], root = 2
- current element = 5

**The Decision:** Is `5 > 2`? YES! 5 is larger than the current k-th largest. It deserves a spot in our top k.

💡 KEY INSIGHT: By evicting the root (smallest element in our top-k set) and adding the new larger element, we maintain exactly the top k elements. The root of the min-heap is ALWAYS the smallest among the top k — which is exactly the k-th largest overall.

**The Action:** Remove root (2). Add 5. minHeap = [3, 5] (3 is the new root).

**State AFTER step 4:**
- minHeap = [3, 5]
- Top 2 so far: {3, 5}
- k-th largest estimate: 3

---

**Step 5: Process nums[4] = 6**

Code executing: `if (6 > minHeap.peek())` → `if (6 > 3)` → `true`

**What do we see right now?**
- nums = [3, 2, 1, 5, **6**, 4] ← index 4
- minHeap = [3, 5], root = 3
- current element = 6

**The Decision:** Is `6 > 3`? YES!

**The Action:** Remove 3, add 6. minHeap = [5, 6].

**State AFTER step 5:**
- minHeap = [5, 6]
- Top 2 so far: {5, 6}
- k-th largest estimate: 5

---

**Step 6: Process nums[5] = 4**

Code executing: `if (4 > minHeap.peek())` → `if (4 > 5)` → `false`

**What do we see right now?**
- nums = [3, 2, 1, 5, 6, **4**] ← index 5
- minHeap = [5, 6], root = 5
- current element = 4

**The Decision:** Is `4 > 5`? NO. 4 is not in the top 2.

**The Action:** Skip.

**Final state:**
- minHeap = [5, 6]
- Root = 5 → THIS IS THE ANSWER!
- Return `minHeap.peek()` = **5** ✓

---

**Why does this work?** The min-heap of size k always contains the k largest elements seen so far. The root is the SMALLEST of these k elements — i.e., the k-th largest overall. We reject anything ≤ the root (too small for top k) and evict the root when something larger arrives (maintaining exactly k elements).

**The Key Invariant:** "At any point, the min-heap contains exactly the k largest elements processed so far, and the root is the k-th largest among them."

**Beginner Mistakes:**
1. **Using a MAX-heap instead of MIN-heap:** With a max-heap, you'd need to extract k times to get the k-th largest → O(n + k log n). A min-heap of size k gives you the answer at the root.
2. **Not checking `num > heap.peek()` before polling:** If you always poll and offer, you might remove a larger element and add a smaller one, breaking the invariant.
3. **Forgetting to actually add the first k elements:** Before comparing, fill the heap to size k. Otherwise you're comparing against an incomplete set.

**What if the interviewer asks "Why not use a max-heap and extract k times?":** That's O(n + k log n). Building the max-heap is O(n), then k extractions at O(log n) each. For small k this is fine, but for k ≈ n/2 it's O(n log n). The min-heap of size k is O(n log k), which is better when k ≪ n.

**30-second interview pitch:** "Use a min-heap of size k. Scan the array: if the heap isn't full, add; if the current element beats the root, evict and add. After scanning, the root is the k-th largest. O(n log k) time, O(k) space."

## Optimal In-depth Intuition

This is a sliding window on the "top k" set. The min-heap acts as a bouncer at an exclusive club with exactly k spots. The weakest member (root) is always visible at the door. New arrivals only get in if they're stronger than the weakest current member, who then gets kicked out. After everyone has tried to enter, the k members inside are the top k, and the weakest among them (the root) is the k-th strongest overall.

The time improvement from O(n log n) to O(n log k) matters when k is much smaller than n. Each heap operation is O(log k) instead of O(log n), and we do at most n such operations.

## Optimal Algorithm

```
function findKthLargest(nums, k):
    minHeap = new PriorityQueue()     // min-heap
    for num in nums:
        if minHeap.size < k:
            minHeap.offer(num)         // Fill heap to size k
        else if num > minHeap.peek():
            minHeap.poll()             // Evict smallest of top k
            minHeap.offer(num)         // Add new element
    return minHeap.peek()              // Root = k-th largest
```

## Optimal Code

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Min-heap of size k: root is the k-th largest
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int num : nums) {
            if (minHeap.size() < k) {
                minHeap.offer(num);
            } else if (num > minHeap.peek()) {
                minHeap.poll();
                minHeap.offer(num);
            }
        }
        
        return minHeap.peek();
    }
}
```

## Optimal Complexity

**Time:** O(n log k) — We process each of the n elements, and each heap operation (offer/poll) on a heap of size k takes O(log k). Since k ≤ n, this is at most O(n log n), but typically much better when k ≪ n.

**Space:** O(k) — The heap stores exactly k elements at any time.

## Optimal Hints

1. You need the k-th LARGEST. What if you maintained a collection of the k largest elements?
2. Among the k largest elements, which one is the k-th largest? The SMALLEST one.
3. What data structure gives O(1) access to the minimum? A min-heap!
4. Keep the heap at exactly size k. When should you replace the root?
5. If a new element is bigger than the root, it belongs in the top k, and the root doesn't.
6. After processing all elements, the root is your answer.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz4-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz4-grid{grid-template-columns:1fr}}
.viz4-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz4-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz4-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz4-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz4-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz4-btn:disabled{opacity:0.3}
.viz4-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>

<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar4"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz4-btn" id="prev4" onclick="prev4()">← Prev</button>
  <button class="viz4-btn" id="next4" onclick="next4()">Next →</button>
  <button class="viz4-btn" id="auto4" onclick="toggleAuto4()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel4">Ready</span>
</div>
<div class="viz4-grid">
  <div>
    <div class="viz4-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Array + Min-Heap (size k)</div>
      <svg id="svg4" width="100%" viewBox="0 0 460 280"></svg>
    </div>
    <div class="viz4-state" id="state4"></div>
  </div>
  <div>
    <div class="viz4-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz4-log" id="log4"></div>
    </div>
    <div class="viz4-expl" id="expl4"></div>
  </div>
</div>

<script>
const TCS_4=[
    {name:"k=2",data:{nums:[3,2,1,5,6,4],k:2}},
    {name:"k=4",data:{nums:[3,2,3,1,2,4,5,5,6],k:4}},
    {name:"k=1 (max)",data:{nums:[7,1,3,9,2],k:1}}
];
let steps4=[],stepIdx4=-1,autoInt4=null;

function buildSteps4(tc){
    steps4=[];
    const nums=tc.nums,k=tc.k;
    const heap=[];
    
    function heapPush(v){heap.push(v);let i=heap.length-1;while(i>0){const p=Math.floor((i-1)/2);if(heap[i]<heap[p]){const t=heap[i];heap[i]=heap[p];heap[p]=t;i=p;}else break;}}
    function heapPop(){if(heap.length<=1)return heap.pop();const v=heap[0];heap[0]=heap[heap.length-1];heap.pop();let i=0;while(2*i+1<heap.length){let s=i;const l=2*i+1,r=2*i+2;if(l<heap.length&&heap[l]<heap[s])s=l;if(r<heap.length&&heap[r]<heap[s])s=r;if(s!==i){const t=heap[i];heap[i]=heap[s];heap[s]=t;i=s;}else break;}return v;}
    function heapPeek(){return heap[0];}
    
    function add(msg,color,arrIdx,expl){
        steps4.push({msg,color,arrIdx,heap:[...heap],nums:[...nums],k,explanation:expl});
    }
    
    add(`Array: [${nums.join(', ')}], k=${k}. Use min-heap of size ${k}.`,'#4f8ff7',-1,`We'll maintain a min-heap of at most ${k} elements. After scanning all elements, the root is the ${k}-th largest.`);
    
    for(let idx=0;idx<nums.length;idx++){
        const num=nums[idx];
        if(heap.length<k){
            add(`nums[${idx}]=${num}: heap size ${heap.length} < k=${k}, add directly`,'#4f8ff7',idx,`Heap isn't full yet (${heap.length} < ${k}), so add ${num} unconditionally.`);
            heapPush(num);
            add(`Added ${num}. Heap: [${heap.join(', ')}], root=${heapPeek()}`,'#34d399',idx,`Heap now has ${heap.length} element(s). Root (smallest in top-${Math.min(heap.length,k)}) = ${heapPeek()}.`);
        } else if(num>heapPeek()){
            add(`nums[${idx}]=${num} > root ${heapPeek()}: evict root, add ${num}`,'#f59e0b',idx,`${num} > ${heapPeek()} (current k-th largest). ${num} belongs in top ${k}. Evict ${heapPeek()}.`);
            heapPop();
            heapPush(num);
            add(`Heap after swap: [${heap.join(', ')}], root=${heapPeek()}`,'#34d399',idx,`New k-th largest estimate: ${heapPeek()}.`);
        } else {
            add(`nums[${idx}]=${num} ≤ root ${heapPeek()}: skip`,'#71717a',idx,`${num} ≤ ${heapPeek()}, so it's not in the top ${k}. Skip.`);
        }
    }
    add(`Done! Root = ${heapPeek()} → k-th largest = ${heapPeek()}`,'#34d399',-1,`The min-heap contains the ${k} largest elements: [${heap.join(', ')}]. The root ${heapPeek()} is the ${k}-th largest.`);
}

function getTreePos4(n){const p=[];for(let i=0;i<n;i++){const l=Math.floor(Math.log2(i+1));const pos=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const s=200/(t+1);p.push({x:230+s*(pos+1)-100,y:130+l*50});}return p;}

function render4(){
    const s=steps4[stepIdx4];if(!s)return;
    let svg='';
    const bW=44,g=4,sx=10,sy=20;
    s.nums.forEach((v,i)=>{
        const x=sx+i*(bW+g);
        const isActive=i===s.arrIdx;
        const c=isActive?'#4f8ff7':'#2a2a33';
        const tc=isActive?'#fafaf9':'#a1a1aa';
        svg+=`<text x="${x+bW/2}" y="${sy-6}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        svg+=`<rect x="${x}" y="${sy}" width="${bW}" height="34" rx="6" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+bW/2}" y="${sy+18}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc}" font-family="JetBrains Mono,monospace">${v}</text>`;
    });
    
    // Arrow
    if(s.arrIdx>=0){
        const ax=sx+s.arrIdx*(bW+g)+bW/2;
        svg+=`<text x="${ax}" y="${sy+48}" text-anchor="middle" font-size="10" fill="#4f8ff7" font-family="JetBrains Mono,monospace">▲</text>`;
    }
    
    // Heap label
    svg+=`<text x="230" y="110" text-anchor="middle" font-size="11" fill="#71717a" font-family="system-ui">Min-Heap (size ≤ ${s.k})</text>`;
    
    // Heap tree
    const h=s.heap,n=h.length;
    const positions=getTreePos4(n);
    for(let i=1;i<n;i++){const pi=Math.floor((i-1)/2);svg+=`<line x1="${positions[pi].x}" y1="${positions[pi].y+14}" x2="${positions[i].x}" y2="${positions[i].y-14}" stroke="#3f3f46" stroke-width="1.5"/>`;}
    for(let i=0;i<n;i++){const{x,y}=positions[i];const isRoot=i===0;const fill=isRoot?'rgba(52,211,153,0.1)':'#1a1a20';const stroke=isRoot?'#34d399':'#3f3f46';
    svg+=`<circle cx="${x}" cy="${y}" r="16" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${isRoot?'#34d399':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${h[i]}</text>`;}
    
    document.getElementById('svg4').innerHTML=svg;
    document.getElementById('state4').innerHTML=`<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">
    <tr><td style="padding:4px 10px;color:#52525b;font-weight:600;width:30%">heap</td><td style="padding:4px 10px;color:#b8b8be">[${s.heap.join(', ')}]</td></tr>
    <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">root</td><td style="padding:4px 10px;color:#34d399">${s.heap.length>0?s.heap[0]:'empty'}</td></tr>
    <tr><td style="padding:4px 10px;color:#52525b;font-weight:600">k</td><td style="padding:4px 10px;color:#b8b8be">${s.k}</td></tr></table>`;
    
    let logHtml='';for(let i=0;i<=stepIdx4;i++){const m=i===stepIdx4?'▶ ':'  ';logHtml+=`<div style="color:${steps4[i].color}">${m}${steps4[i].msg}</div>`;}
    document.getElementById('log4').innerHTML=logHtml;document.getElementById('log4').scrollTop=99999;
    document.getElementById('expl4').innerHTML=s.explanation;
    document.getElementById('stepLabel4').textContent=`Step ${stepIdx4+1}/${steps4.length}`;
    document.getElementById('prev4').disabled=stepIdx4<=0;document.getElementById('next4').disabled=stepIdx4>=steps4.length-1;
}

function next4(){if(stepIdx4<steps4.length-1){stepIdx4++;render4();}}
function prev4(){if(stepIdx4>0){stepIdx4--;render4();}}
function toggleAuto4(){if(autoInt4){clearInterval(autoInt4);autoInt4=null;document.getElementById('auto4').textContent='▶ Auto';}else{autoInt4=setInterval(()=>{if(stepIdx4>=steps4.length-1){toggleAuto4();return;}next4();},1200);document.getElementById('auto4').textContent='⏸ Pause';}}
function loadTc4(idx){stepIdx4=0;buildSteps4(TCS_4[idx].data);document.querySelectorAll('[data-tc4]').forEach((b,i)=>{b.className=i===idx?'viz4-btn active':'viz4-btn';});render4();}
const tcBar4=document.getElementById('tcBar4');TCS_4.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz4-btn active':'viz4-btn';b.setAttribute('data-tc4','');b.onclick=()=>loadTc4(i);tcBar4.appendChild(b);});
buildSteps4(TCS_4[0].data);stepIdx4=0;render4();
</script>
</div>

---

# Kth Smallest Element in an Array

**Difficulty:** Medium
**GFG:** https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1
**YouTube:** https://www.youtube.com/watch?v=hGK_5n81drs

## Description

Given an array `arr[]` and an integer `k`, find the k-th smallest element in the array.

**Input:** `int[] arr`, `int k`
**Output:** `int` — the k-th smallest element

**Constraints:**
- 1 ≤ k ≤ n ≤ 10⁵
- 1 ≤ arr[i] ≤ 10⁶

**Examples:**

Example 1:
```
Input: arr = [7, 10, 4, 3, 20, 15], k = 3
Output: 7
Explanation: Sorted: [3, 4, 7, 10, 15, 20]. The 3rd smallest is 7.
```

Example 2:
```
Input: arr = [7, 10, 4, 20, 15], k = 4
Output: 15
Explanation: Sorted: [4, 7, 10, 15, 20]. The 4th smallest is 15.
```

**Notable Edge Cases:**
- k = 1: find the minimum
- k = n: find the maximum
- All elements equal: answer is that element regardless of k

## In-depth Explanation

**Reframe:** This is the mirror of "K-th Largest." Find the element at index `k-1` in sorted ascending order. Use a **max-heap of size k** — the root is the k-th smallest.

**Pattern recognition:** Same pattern as K-th Largest, but with a max-heap instead of min-heap. For k-th smallest, we want to track the k smallest elements. The LARGEST among these k is the k-th smallest, so we use a max-heap.

**Real-world analogy:** You're picking the 3 cheapest items from a store. You carry at most 3 items. When you find something cheaper than your most expensive carried item, you drop the expensive one and grab the cheap one. At the end, your most expensive carried item is the 3rd cheapest overall.

**Why naive fails:** Sorting is O(n log n). Heap approach is O(n log k).

**Approach roadmap:**
- Brute force: Sort ascending, return `arr[k-1]` → O(n log n)
- Optimal: Max-heap of size k → O(n log k)

**Interview cheat sheet:**
- "k-th smallest" → max-heap of size k
- "k-th largest" → min-heap of size k
- The duality: for SMALLEST, use MAX-heap (track the ceiling); for LARGEST, use MIN-heap (track the floor)
- Memory hook: "Opposite heap, opposite problem. Max-heap for smallest, min-heap for largest."

## Brute Force Intuition

Sort ascending, return element at index k-1. Identical logic to K-th Largest brute force.

## Brute Force Step-by-Step Solution

**Test case:** `arr = [7, 10, 4, 3, 20, 15], k = 3`
**Expected:** `7`

**Initial state:** arr = [7, 10, 4, 3, 20, 15], k = 3

**Step 1: Sort ascending**
arr = [3, 4, 7, 10, 15, 20]

**Step 2: Return arr[k-1] = arr[2] = 7**

The 3rd smallest is at index 2 (0-indexed). arr[2] = 7. Answer: 7 ✓

---

**Why does this work?** In ascending order, the k-th smallest is simply at index k-1.

**Beginner Mistakes:**
1. **Off-by-one:** k-th smallest is at index `k-1`, not `k`.
2. **Confusing with k-th largest:** k-th smallest = `arr[k-1]` in ascending; k-th largest = `arr[n-k]` in ascending.
3. **Not mentioning the heap optimization in interviews.**

**30-second pitch:** "Sort ascending, return `arr[k-1]`. O(n log n). Optimize with max-heap of size k for O(n log k)."

## Brute Force In-depth Intuition

Sorting establishes total order, after which positional indexing gives O(1) access to any rank.

## Brute Force Algorithm

```
function kthSmallest_brute(arr, k):
    sort arr ascending
    return arr[k - 1]
```

## Brute Force Code

```java
class Solution {
    public int kthSmallest(int[] arr, int k) {
        Arrays.sort(arr);
        return arr[k - 1];
    }
}
```

## Brute Force Complexity

**Time:** O(n log n) — sorting dominates.
**Space:** O(log n) — for internal sort stack.

## Brute Force Hints

1. What index would the k-th smallest be at in a sorted array?
2. The k-th smallest is at index `k-1` in ascending order.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz5b-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz5b-btn:disabled{opacity:0.3}
</style>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz5b-btn" id="prev5b" onclick="prev5b()">← Prev</button>
  <button class="viz5b-btn" id="next5b" onclick="next5b()">Next →</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel5b">Ready</span>
</div>
<div style="background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px">
  <svg id="svg5b" width="100%" viewBox="0 0 460 100"></svg>
</div>
<div style="padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px" id="expl5b"></div>
<script>
const BS5=[
  {arr:[7,10,4,3,20,15],hl:{},msg:'Original: [7, 10, 4, 3, 20, 15]. k=3.'},
  {arr:[3,4,7,10,15,20],hl:{0:'#4f8ff7',1:'#4f8ff7',2:'#4f8ff7',3:'#4f8ff7',4:'#4f8ff7',5:'#4f8ff7'},msg:'Sorted ascending: [3, 4, 7, 10, 15, 20].'},
  {arr:[3,4,7,10,15,20],hl:{2:'#34d399'},msg:'arr[k-1] = arr[2] = 7. The 3rd smallest is 7. ✓'}
];
let si5b=0;
function render5b(){const s=BS5[si5b];const bW=52,g=6,sx=50,sy=30;let svg='';
s.arr.forEach((v,i)=>{const x=sx+i*(bW+g);const c=s.hl[i]||'#2a2a33';const tc=s.hl[i]?'#fafaf9':'#a1a1aa';
svg+=`<text x="${x+bW/2}" y="${sy-8}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
svg+=`<rect x="${x}" y="${sy}" width="${bW}" height="40" rx="6" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;
svg+=`<text x="${x+bW/2}" y="${sy+21}" text-anchor="middle" dominant-baseline="central" font-size="14" font-weight="600" fill="${tc}" font-family="JetBrains Mono,monospace">${v}</text>`;});
document.getElementById('svg5b').innerHTML=svg;document.getElementById('expl5b').innerHTML=s.msg;
document.getElementById('stepLabel5b').textContent=`Step ${si5b+1}/${BS5.length}`;document.getElementById('prev5b').disabled=si5b<=0;document.getElementById('next5b').disabled=si5b>=BS5.length-1;}
function next5b(){if(si5b<BS5.length-1){si5b++;render5b();}}
function prev5b(){if(si5b>0){si5b--;render5b();}}
render5b();
</script>
</div>

## Optimal Intuition

Use a **max-heap of size k**. Scan the array: if the heap isn't full, add the element. If the element is SMALLER than the root (the largest in our "smallest k" set), evict the root and add the element. After processing all elements, the root of the max-heap is the k-th smallest.

## Optimal Step-by-Step Solution

**Test case:** `arr = [7, 10, 4, 3, 20, 15], k = 3`
**Expected:** `7`

**Initial state:**
- arr = [7, 10, 4, 3, 20, 15], k = 3
- maxHeap = [] (empty, using `PriorityQueue<>(Collections.reverseOrder())`)

---

**Step 1: Process arr[0] = 7**

Code: heap size 0 < k=3, add directly.
maxHeap = [7]. Size = 1.

---

**Step 2: Process arr[1] = 10**

Code: heap size 1 < k=3, add directly.
maxHeap = [10, 7]. Root = 10. Size = 2.

---

**Step 3: Process arr[2] = 4**

Code: heap size 2 < k=3, add directly.
maxHeap = [10, 7, 4]. Root = 10. Size = 3 = k. Heap is now full.

Current top 3 smallest: {4, 7, 10}. The largest of these (10) is our current k-th smallest estimate.

---

**Step 4: Process arr[3] = 3**

Code: `if (3 < maxHeap.peek())` → `if (3 < 10)` → `true`

**Where are we?** Heap is full with [10, 7, 4]. Element 3 is smaller than the root (10), so it deserves a spot in the "3 smallest" set.

**The Action:** Remove 10. Add 3. maxHeap = [7, 3, 4]. Root = 7.

💡 KEY INSIGHT: We evicted 10 because 3 is smaller. Our "3 smallest" set is now {3, 4, 7}. The root 7 = k-th smallest estimate. This is correct so far!

---

**Step 5: Process arr[4] = 20**

Code: `if (20 < maxHeap.peek())` → `if (20 < 7)` → `false`

20 is NOT smaller than the root 7. It doesn't belong in the 3 smallest. Skip.

---

**Step 6: Process arr[5] = 15**

Code: `if (15 < maxHeap.peek())` → `if (15 < 7)` → `false`

15 is NOT smaller than 7. Skip.

**Final state:** maxHeap = [7, 3, 4]. Root = **7** → Answer: 7 ✓

---

**Why does this work?** The max-heap of size k keeps the k smallest elements. The root is the LARGEST among these k, which is the k-th smallest overall. Elements larger than the root are discarded (too big for the bottom k).

**The Key Invariant:** "The max-heap contains the k smallest elements seen so far, and the root is the k-th smallest among them."

**Beginner Mistakes:**
1. **Using min-heap instead of max-heap:** Min-heap would give you the overall minimum, not the k-th smallest. You need the MAXIMUM of the k smallest → max-heap.
2. **Comparing wrong direction:** For k-th smallest, evict when `num < root` (not `num > root` as in k-th largest).
3. **Forgetting `Collections.reverseOrder()`:** Java's PriorityQueue is min-heap by default. For max-heap, use `new PriorityQueue<>(Collections.reverseOrder())`.

**30-second pitch:** "Max-heap of size k. Scan array: if element < root, evict root and add element. Root = k-th smallest. O(n log k) time, O(k) space."

## Optimal In-depth Intuition

The max-heap acts as a "ceiling detector" for the k-th smallest. The root is the highest value we're willing to keep in our "k smallest" set. Anything above the ceiling is rejected. When something below the ceiling arrives, it pushes the ceiling down. After scanning everything, the ceiling IS the k-th smallest.

## Optimal Algorithm

```
function kthSmallest(arr, k):
    maxHeap = new MaxPriorityQueue()
    for num in arr:
        if maxHeap.size < k:
            maxHeap.offer(num)
        else if num < maxHeap.peek():
            maxHeap.poll()
            maxHeap.offer(num)
    return maxHeap.peek()
```

## Optimal Code

```java
class Solution {
    public int kthSmallest(int[] arr, int k) {
        // Max-heap of size k: root is the k-th smallest
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        
        for (int num : arr) {
            if (maxHeap.size() < k) {
                maxHeap.offer(num);
            } else if (num < maxHeap.peek()) {
                maxHeap.poll();
                maxHeap.offer(num);
            }
        }
        
        return maxHeap.peek();
    }
}
```

## Optimal Complexity

**Time:** O(n log k) — n elements, each heap op is O(log k).
**Space:** O(k) — heap stores k elements.

## Optimal Hints

1. For k-th smallest, you want the k smallest elements. What data structure tells you the MAX among them?
2. A max-heap! The root of a max-heap of size k = k-th smallest.
3. When should you evict the root? When a new element is smaller.
4. `Collections.reverseOrder()` turns Java's PriorityQueue into a max-heap.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz5-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}@media(max-width:700px){.viz5-grid{grid-template-columns:1fr}}
.viz5-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz5-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz5-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz5-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz5-btn:disabled{opacity:0.3}
.viz5-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar5"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz5-btn" id="prev5" onclick="prev5()">← Prev</button>
  <button class="viz5-btn" id="next5" onclick="next5()">Next →</button>
  <button class="viz5-btn" id="auto5" onclick="toggleAuto5()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel5">Ready</span>
</div>
<div class="viz5-grid">
  <div>
    <div class="viz5-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Array + Max-Heap (size k)</div>
      <svg id="svg5" width="100%" viewBox="0 0 460 260"></svg>
    </div>
  </div>
  <div>
    <div class="viz5-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz5-log" id="log5"></div>
    </div>
    <div class="viz5-expl" id="expl5"></div>
  </div>
</div>
<script>
const TCS_5=[{name:"k=3",data:{arr:[7,10,4,3,20,15],k:3}},{name:"k=1 (min)",data:{arr:[5,3,8,1],k:1}},{name:"k=n (max)",data:{arr:[4,2,6],k:3}}];
let steps5=[],stepIdx5=-1,autoInt5=null;
function buildSteps5(tc){steps5=[];const arr=tc.arr,k=tc.k;const heap=[];
function heapPush(v){heap.push(v);let i=heap.length-1;while(i>0){const p=Math.floor((i-1)/2);if(heap[i]>heap[p]){const t=heap[i];heap[i]=heap[p];heap[p]=t;i=p;}else break;}}
function heapPop(){if(heap.length<=1)return heap.pop();const v=heap[0];heap[0]=heap[heap.length-1];heap.pop();let i=0;while(2*i+1<heap.length){let s=i;const l=2*i+1,r=2*i+2;if(l<heap.length&&heap[l]>heap[s])s=l;if(r<heap.length&&heap[r]>heap[s])s=r;if(s!==i){const t=heap[i];heap[i]=heap[s];heap[s]=t;i=s;}else break;}return v;}
function add(msg,c,ai,e){steps5.push({msg,color:c,arrIdx:ai,heap:[...heap],arr:[...arr],k,explanation:e});}
add(`Array: [${arr.join(', ')}], k=${k}. Max-heap of size ${k}.`,'#4f8ff7',-1,`Use max-heap of size ${k}. Root = k-th smallest after scan.`);
for(let i=0;i<arr.length;i++){const num=arr[i];
if(heap.length<k){add(`arr[${i}]=${num}: size ${heap.length}<k=${k}, add`,'#4f8ff7',i,`Heap not full. Add ${num}.`);heapPush(num);add(`Added. Heap: [${heap.join(', ')}], root=${heap[0]}`,'#34d399',i,`Root (largest in bottom-${Math.min(heap.length,k)}) = ${heap[0]}.`);}
else if(num<heap[0]){add(`arr[${i}]=${num} < root ${heap[0]}: evict, add`,'#f59e0b',i,`${num} < ${heap[0]}. Belongs in bottom-${k}. Evict root.`);heapPop();heapPush(num);add(`Heap: [${heap.join(', ')}], root=${heap[0]}`,'#34d399',i,`New k-th smallest estimate: ${heap[0]}.`);}
else{add(`arr[${i}]=${num} ≥ root ${heap[0]}: skip`,'#71717a',i,`${num} too large for bottom-${k}. Skip.`);}}
add(`Done! Root = ${heap[0]} → k-th smallest = ${heap[0]}`,'#34d399',-1,`Max-heap contains ${k} smallest: [${heap.join(', ')}]. Root ${heap[0]} = answer.`);}

function render5(){const s=steps5[stepIdx5];if(!s)return;let svg='';
const bW=48,g=4,sx=10,sy=20;s.arr.forEach((v,i)=>{const x=sx+i*(bW+g);const ia=i===s.arrIdx;const c=ia?'#4f8ff7':'#2a2a33';svg+=`<rect x="${x}" y="${sy}" width="${bW}" height="34" rx="6" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="${sy+18}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${ia?'#fafaf9':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${v}</text>`;svg+=`<text x="${x+bW/2}" y="${sy-7}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;});
if(s.arrIdx>=0)svg+=`<text x="${sx+s.arrIdx*(bW+g)+bW/2}" y="${sy+48}" text-anchor="middle" font-size="10" fill="#4f8ff7">▲</text>`;
svg+=`<text x="230" y="100" text-anchor="middle" font-size="11" fill="#71717a" font-family="system-ui">Max-Heap (size ≤ ${s.k})</text>`;
const h=s.heap,n=h.length;for(let i=0;i<n;i++){const l=Math.floor(Math.log2(i+1));const p=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const sp=200/(t+1);const x=130+sp*(p+1);const y=120+l*45;
if(i>0){const pi=Math.floor((i-1)/2);const pl=Math.floor(Math.log2(pi+1));const pp=pi-(Math.pow(2,pl)-1);const pt=Math.pow(2,pl);const psp=200/(pt+1);svg+=`<line x1="${130+psp*(pp+1)}" y1="${120+pl*45+14}" x2="${x}" y2="${y-14}" stroke="#3f3f46" stroke-width="1.5"/>`;}
const isRoot=i===0;svg+=`<circle cx="${x}" cy="${y}" r="16" fill="${isRoot?'rgba(251,191,36,0.1)':'#1a1a20'}" stroke="${isRoot?'#f59e0b':'#3f3f46'}" stroke-width="2"/>`;svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${isRoot?'#f59e0b':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${h[i]}</text>`;}
document.getElementById('svg5').innerHTML=svg;
let lh='';for(let i=0;i<=stepIdx5;i++){lh+=`<div style="color:${steps5[i].color}">${i===stepIdx5?'▶ ':'  '}${steps5[i].msg}</div>`;}
document.getElementById('log5').innerHTML=lh;document.getElementById('log5').scrollTop=99999;
document.getElementById('expl5').innerHTML=s.explanation;document.getElementById('stepLabel5').textContent=`Step ${stepIdx5+1}/${steps5.length}`;
document.getElementById('prev5').disabled=stepIdx5<=0;document.getElementById('next5').disabled=stepIdx5>=steps5.length-1;}
function next5(){if(stepIdx5<steps5.length-1){stepIdx5++;render5();}}
function prev5(){if(stepIdx5>0){stepIdx5--;render5();}}
function toggleAuto5(){if(autoInt5){clearInterval(autoInt5);autoInt5=null;document.getElementById('auto5').textContent='▶ Auto';}else{autoInt5=setInterval(()=>{if(stepIdx5>=steps5.length-1){toggleAuto5();return;}next5();},1200);document.getElementById('auto5').textContent='⏸ Pause';}}
function loadTc5(idx){stepIdx5=0;buildSteps5(TCS_5[idx].data);document.querySelectorAll('[data-tc5]').forEach((b,i)=>{b.className=i===idx?'viz5-btn active':'viz5-btn';});render5();}
const tcBar5=document.getElementById('tcBar5');TCS_5.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz5-btn active':'viz5-btn';b.setAttribute('data-tc5','');b.onclick=()=>loadTc5(i);tcBar5.appendChild(b);});
buildSteps5(TCS_5[0].data);stepIdx5=0;render5();
</script>
</div>

---

# Sort K Sorted Array

**Difficulty:** Easy
**GFG:** https://www.geeksforgeeks.org/problems/nearly-sorted-algorithm/1
**YouTube:** https://www.youtube.com/watch?v=dYfM6J1y0mU

## Description

Given an array where each element is at most `k` positions away from its sorted position, sort the array efficiently.

**Input:** `int[] arr`, `int k`
**Output:** The sorted array

**Constraints:**
- 1 ≤ n ≤ 10⁵
- 0 ≤ k ≤ n - 1
- 1 ≤ arr[i] ≤ 10⁶

**Examples:**

Example 1:
```
Input: arr = [6, 5, 3, 2, 8, 10, 9], k = 3
Output: [2, 3, 5, 6, 8, 9, 10]
Explanation: Each element is at most 3 positions from its sorted position.
  6 should be at index 3 (currently at 0, distance 3) ✓
  5 should be at index 2 (currently at 1, distance 1) ✓
  3 should be at index 1 (currently at 2, distance 1) ✓
```

Example 2:
```
Input: arr = [2, 1], k = 1
Output: [1, 2]
Explanation: Each element is at most 1 position away from sorted position.
```

**Notable Edge Cases:**
- k = 0: array is already sorted
- k = n-1: worst case, essentially unsorted
- Single element: already sorted

## In-depth Explanation

**Reframe:** The key constraint — "each element is at most k away from its final position" — means that the correct element for position `i` must be somewhere in the window `[i-k, i+k]`. So to find the element that belongs at position `i`, we only need to look at the next `k+1` elements.

**Pattern recognition:** "Nearly sorted" + "k distance" → min-heap of size k+1. This is a classic heap application that exploits the bounded disorder.

**Real-world analogy:** Imagine a conveyor belt where packages are ALMOST in order but might be offset by up to k positions. You set up a sorting buffer that holds k+1 packages. Each time you release the lightest package from the buffer onto the output belt, then load the next incoming package into the buffer. Since the correct next package is guaranteed to be within k+1 of the current position, the buffer always contains it.

**Why naive fails:** Standard sorting ignores the "k-sorted" property and runs O(n log n). By exploiting the constraint that the right element is within k+1 candidates, we can sort in O(n log k).

**Approach roadmap:**
- Brute force: Standard sort → O(n log n)
- Optimal: Min-heap of size k+1 → O(n log k)

**Interview cheat sheet:**
- Keywords: "nearly sorted", "k-sorted", "each element at most k away"
- The insight: a sliding window of size k+1 always contains the correct next element
- Memory hook: "Heap of size k+1 = sliding window sorter for nearly-sorted arrays."

## Optimal Intuition

Build a min-heap from the first `k+1` elements. The minimum of these MUST be the element that belongs at position 0 (because it can't be more than k positions away, and it's the smallest in the only possible window). Extract the min, place it at position 0. Add the next element from the array. Repeat. The heap always has at most k+1 elements, so each operation is O(log k).

## Optimal Step-by-Step Solution

**Test case:** `arr = [6, 5, 3, 2, 8, 10, 9], k = 3`
**Expected:** `[2, 3, 5, 6, 8, 9, 10]`

**Initial state:**
- arr = [6, 5, 3, 2, 8, 10, 9], k = 3
- We'll build a min-heap of the first k+1 = 4 elements: {6, 5, 3, 2}

---

**Step 1: Build initial heap from first k+1 elements**

Code executing: Insert arr[0..3] = {6, 5, 3, 2} into min-heap.

**Where are we?** We're loading the first 4 elements (indices 0 to 3) into the heap. The correct element for position 0 MUST be among these 4 — because every element is at most 3 positions from its target, the element destined for position 0 can be at indices 0, 1, 2, or 3 at most.

**What do we see right now?**
- minHeap = [2, 5, 3, 6] (after heapifying)
- Root = 2 (the minimum)
- result = [] (empty output)
- nextIndex = 4 (next element to add from arr)

💡 KEY INSIGHT: The minimum of the first k+1 elements MUST go to position 0. Why? Because: (a) it's the smallest in the window, and (b) the element that truly belongs at position 0 must be within indices 0 to k. So the minimum of this range IS the correct element for position 0.

**State AFTER step 1:** minHeap = [2, 5, 3, 6], root = 2, output index = 0

---

**Step 2: Extract min, place at position 0**

Code: `result[0] = minHeap.poll()` → result[0] = 2. Then add arr[4] = 8.

**The Action:** Extract 2 → place at output[0]. Add 8 to heap. minHeap = [3, 5, 8, 6].

**State:** result = [2, _, _, _, _, _, _], heap = [3, 5, 8, 6], nextIndex = 5

---

**Step 3: Extract min, place at position 1**

Code: `result[1] = minHeap.poll()` → result[1] = 3. Then add arr[5] = 10.

**The Action:** Extract 3 → place at output[1]. Add 10. minHeap = [5, 6, 8, 10].

**State:** result = [2, 3, _, _, _, _, _], heap = [5, 6, 8, 10], nextIndex = 6

---

**Step 4: Extract min, place at position 2**

Code: `result[2] = minHeap.poll()` → result[2] = 5. Then add arr[6] = 9.

**The Action:** Extract 5 → place at output[2]. Add 9. minHeap = [6, 9, 8, 10].

**State:** result = [2, 3, 5, _, _, _, _], heap = [6, 9, 8, 10]

---

**Step 5: Extract min, place at position 3**

Code: `result[3] = minHeap.poll()` → result[3] = 6. No more elements to add.

**State:** result = [2, 3, 5, 6, _, _, _], heap = [8, 9, 10]

---

**Step 6: Extract min, place at position 4**

result[4] = 8. heap = [9, 10].

---

**Step 7: Extract min, place at position 5**

result[5] = 9. heap = [10].

---

**Step 8: Extract min, place at position 6**

result[6] = 10. heap = []. Done!

**Final result:** [2, 3, 5, 6, 8, 9, 10] ✓

---

**Why does this work?** The k-sorted guarantee means position `i`'s correct element is within indices `[i-k, i+k]` of the original array. Since we process left to right and maintain a window of size k+1, the correct element for each position is always in the heap when we extract it. The minimum of the heap is always the correct next element for the output.

**The Key Invariant:** "When we extract the minimum for output position `i`, the heap contains all candidates that could belong at position `i` (elements from positions max(0, i-k) to min(n-1, i+k) that haven't been placed yet)."

**Beginner Mistakes:**
1. **Using heap of size k instead of k+1:** The window needs k+1 elements because an element at position i can come from positions i-k through i, which is k+1 positions.
2. **Not adding new elements before extracting:** Add the next element first, THEN extract. Otherwise you might miss a candidate.
3. **Forgetting to drain the heap at the end:** After processing all elements from the array, the heap still has remaining elements that need to be extracted.

**30-second pitch:** "Min-heap of size k+1. Load first k+1 elements. For each output position: extract min (it's the correct element), add next array element. O(n log k) time, O(k) space."

## Optimal In-depth Intuition

The mathematical insight: in a k-sorted array, the element with rank `i` (i-th smallest) can only be at positions `[max(0, i-k), min(n-1, i+k)]`. This means a sliding window of size 2k+1 centered on position i always contains the correct element. But we can be even tighter: since we process left to right, elements already placed can't be candidates. So we only need a forward-looking window of size k+1.

## Optimal Algorithm

```
function sortKSorted(arr, k):
    minHeap = new PriorityQueue()
    result = new int[arr.length]
    idx = 0
    
    // Load first k+1 elements
    for i = 0 to min(k, arr.length - 1):
        minHeap.offer(arr[i])
    
    // For each remaining element
    for i = k+1 to arr.length - 1:
        result[idx++] = minHeap.poll()    // Extract min for current position
        minHeap.offer(arr[i])              // Add next candidate
    
    // Drain remaining elements
    while minHeap is not empty:
        result[idx++] = minHeap.poll()
    
    return result
```

## Optimal Code

```java
class Solution {
    public void sortKSorted(int[] arr, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        int n = arr.length;
        int idx = 0;
        
        // Add first k+1 elements to heap
        for (int i = 0; i <= Math.min(k, n - 1); i++) {
            minHeap.offer(arr[i]);
        }
        
        // Process remaining elements
        for (int i = k + 1; i < n; i++) {
            arr[idx++] = minHeap.poll();
            minHeap.offer(arr[i]);
        }
        
        // Drain the heap
        while (!minHeap.isEmpty()) {
            arr[idx++] = minHeap.poll();
        }
    }
}
```

## Optimal Complexity

**Time:** O(n log k) — We process n elements. Each heap operation (insert/extract) on a heap of size k+1 takes O(log k). Total: n × O(log k) = O(n log k). This is better than O(n log n) when k ≪ n.

**Space:** O(k) — The heap stores at most k+1 elements.

## Optimal Hints

1. Each element is at most k away from its sorted position. What's the maximum number of candidates for position 0?
2. The candidates for position 0 are the first k+1 elements. Which one goes to position 0?
3. The MINIMUM of the first k+1 elements goes to position 0.
4. After placing position 0's element, slide the window: add the next element, extract the new min.
5. What data structure gives you the minimum of a changing set efficiently? A min-heap!

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz6-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}@media(max-width:700px){.viz6-grid{grid-template-columns:1fr}}
.viz6-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz6-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz6-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz6-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz6-btn:disabled{opacity:0.3}
.viz6-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar6"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz6-btn" id="prev6" onclick="prev6()">← Prev</button>
  <button class="viz6-btn" id="next6" onclick="next6()">Next →</button>
  <button class="viz6-btn" id="auto6" onclick="toggleAuto6()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel6">Ready</span>
</div>
<div class="viz6-grid">
  <div>
    <div class="viz6-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Input Array + Output + Heap</div>
      <svg id="svg6" width="100%" viewBox="0 0 460 310"></svg>
    </div>
  </div>
  <div>
    <div class="viz6-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz6-log" id="log6"></div>
    </div>
    <div class="viz6-expl" id="expl6"></div>
  </div>
</div>
<script>
const TCS_6=[{name:"k=3",data:{arr:[6,5,3,2,8,10,9],k:3}},{name:"k=1",data:{arr:[2,1,4,3,6,5],k:1}},{name:"k=0",data:{arr:[1,2,3],k:0}}];
let steps6=[],stepIdx6=-1,autoInt6=null;
function buildSteps6(tc){steps6=[];const arr=[...tc.arr],k=tc.k,n=arr.length;const result=new Array(n).fill(null);const heap=[];
function hp(v){heap.push(v);let i=heap.length-1;while(i>0){const p=Math.floor((i-1)/2);if(heap[i]<heap[p]){const t=heap[i];heap[i]=heap[p];heap[p]=t;i=p;}else break;}}
function hpop(){if(heap.length<=1)return heap.pop();const v=heap[0];heap[0]=heap[heap.length-1];heap.pop();let i=0;while(2*i+1<heap.length){let s=i;const l=2*i+1,r=2*i+2;if(l<heap.length&&heap[l]<heap[s])s=l;if(r<heap.length&&heap[r]<heap[s])s=r;if(s!==i){const t=heap[i];heap[i]=heap[s];heap[s]=t;i=s;}else break;}return v;}
function add(msg,c,e,inHL,outHL){steps6.push({msg,color:c,explanation:e,arr:[...arr],result:[...result],heap:[...heap],inHL:inHL||{},outHL:outHL||{}});}
add(`k-sorted array: [${arr.join(', ')}], k=${k}`,'#4f8ff7',`Load first ${Math.min(k+1,n)} elements into min-heap.`);
for(let i=0;i<=Math.min(k,n-1);i++){hp(arr[i]);add(`Add arr[${i}]=${arr[i]} to heap. Heap: [${heap.join(', ')}]`,'#4f8ff7',`Building initial heap window of size k+1=${k+1}.`,{[i]:'#4f8ff7'});}
let idx=0;
for(let i=k+1;i<n;i++){const min=hpop();result[idx]=min;add(`Extract min=${min} → result[${idx}]. Add arr[${i}]=${arr[i]}`,'#34d399',`The minimum ${min} goes to output position ${idx}. Add next element ${arr[i]} to maintain window.`,{[i]:'#4f8ff7'},{[idx]:'#34d399'});
hp(arr[i]);idx++;}
while(heap.length>0){const min=hpop();result[idx]=min;add(`Drain: extract ${min} → result[${idx}]`,'#f59e0b',`No more input elements. Extracting remaining heap elements.`,{},{[idx]:'#f59e0b'});idx++;}
add(`Sorted: [${result.join(', ')}]`,'#34d399',`All elements placed. Array is now sorted!`,{},Object.fromEntries(result.map((_,i)=>[i,'#34d399'])));}

function render6(){const s=steps6[stepIdx6];if(!s)return;let svg='';const bW=44,g=3,sx=10;
svg+=`<text x="5" y="15" font-size="10" fill="#52525b" font-weight="600" font-family="system-ui">INPUT</text>`;
s.arr.forEach((v,i)=>{const x=sx+i*(bW+g);const c=s.inHL[i]||'#2a2a33';svg+=`<rect x="${x}" y="22" width="${bW}" height="32" rx="5" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="39" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="${s.inHL[i]?'#fafaf9':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${v}</text>`;});
svg+=`<text x="5" y="80" font-size="10" fill="#52525b" font-weight="600" font-family="system-ui">OUTPUT</text>`;
s.result.forEach((v,i)=>{const x=sx+i*(bW+g);const c=s.outHL[i]||'#2a2a33';const val=v!==null?v:'_';svg+=`<rect x="${x}" y="87" width="${bW}" height="32" rx="5" fill="${c}22" stroke="${c==='#2a2a33'?'#3f3f46':c}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="104" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="${s.outHL[i]?'#fafaf9':'#71717a'}" font-family="JetBrains Mono,monospace">${val}</text>`;});
svg+=`<text x="230" y="150" text-anchor="middle" font-size="10" fill="#52525b" font-weight="600" font-family="system-ui">MIN-HEAP</text>`;
const h=s.heap,hn=h.length;for(let i=0;i<hn;i++){const l=Math.floor(Math.log2(i+1));const p=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const sp=300/(t+1);const x=80+sp*(p+1);const y=170+l*45;
if(i>0){const pi=Math.floor((i-1)/2);const pl=Math.floor(Math.log2(pi+1));const pp=pi-(Math.pow(2,pl)-1);const pt=Math.pow(2,pl);const ps=300/(pt+1);svg+=`<line x1="${80+ps*(pp+1)}" y1="${170+pl*45+14}" x2="${x}" y2="${y-14}" stroke="#3f3f46" stroke-width="1.5"/>`;}
const isRoot=i===0;svg+=`<circle cx="${x}" cy="${y}" r="16" fill="${isRoot?'rgba(52,211,153,0.1)':'#1a1a20'}" stroke="${isRoot?'#34d399':'#3f3f46'}" stroke-width="2"/>`;svg+=`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${isRoot?'#34d399':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${h[i]}</text>`;}
document.getElementById('svg6').innerHTML=svg;
let lh='';for(let i=0;i<=stepIdx6;i++){lh+=`<div style="color:${steps6[i].color}">${i===stepIdx6?'▶ ':'  '}${steps6[i].msg}</div>`;}
document.getElementById('log6').innerHTML=lh;document.getElementById('log6').scrollTop=99999;
document.getElementById('expl6').innerHTML=s.explanation;document.getElementById('stepLabel6').textContent=`Step ${stepIdx6+1}/${steps6.length}`;
document.getElementById('prev6').disabled=stepIdx6<=0;document.getElementById('next6').disabled=stepIdx6>=steps6.length-1;}
function next6(){if(stepIdx6<steps6.length-1){stepIdx6++;render6();}}function prev6(){if(stepIdx6>0){stepIdx6--;render6();}}
function toggleAuto6(){if(autoInt6){clearInterval(autoInt6);autoInt6=null;document.getElementById('auto6').textContent='▶ Auto';}else{autoInt6=setInterval(()=>{if(stepIdx6>=steps6.length-1){toggleAuto6();return;}next6();},1200);document.getElementById('auto6').textContent='⏸ Pause';}}
function loadTc6(idx){stepIdx6=0;buildSteps6(TCS_6[idx].data);document.querySelectorAll('[data-tc6]').forEach((b,i)=>{b.className=i===idx?'viz6-btn active':'viz6-btn';});render6();}
const tcBar6=document.getElementById('tcBar6');TCS_6.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz6-btn active':'viz6-btn';b.setAttribute('data-tc6','');b.onclick=()=>loadTc6(i);tcBar6.appendChild(b);});
buildSteps6(TCS_6[0].data);stepIdx6=0;render6();
</script>
</div>

---

# Merge K Sorted Lists

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/merge-k-sorted-lists/
**YouTube:** https://www.youtube.com/watch?v=q5a5OiGbT6Q

## Description

You are given an array of `k` linked lists, each sorted in ascending order. Merge all linked lists into one sorted linked list and return it.

**Input:** `ListNode[] lists` — array of k sorted linked lists
**Output:** `ListNode` — head of merged sorted linked list

**Constraints:**
- k == lists.length
- 0 ≤ k ≤ 10⁴
- 0 ≤ lists[i].length ≤ 500
- -10⁴ ≤ lists[i][j] ≤ 10⁴
- Total number of nodes across all lists ≤ 10⁴

**Examples:**

Example 1:
```
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
Explanation: Merge three sorted lists into one sorted list.
```

Example 2:
```
Input: lists = []
Output: []
```

Example 3:
```
Input: lists = [[]]
Output: []
```

**Notable Edge Cases:**
- k = 0: return null
- Lists containing empty lists
- All lists have same values
- Single list: return it as-is

## In-depth Explanation

**Reframe:** At every step, we need to pick the SMALLEST element among the current heads of all k lists. This is essentially a k-way merge operation.

**Pattern recognition:** "Merge k sorted" is a textbook heap problem. The heap holds one element from each list (the current head). We always extract the minimum and advance that list's pointer.

**Real-world analogy:** Imagine k checkout lines at a grocery store, each already sorted by item price. You're combining them into one sorted queue. At each step, you look at the front person in each line and pick the one with the cheapest item. They leave their line and join the merged queue. Then you look at the new fronts again.

**Why naive fails:** Merging all lists by repeatedly finding the minimum across k heads (without a heap) takes O(k) per element × O(N) total elements = O(Nk). With a heap, finding the minimum takes O(log k) per element → O(N log k).

**Approach roadmap:**
- Brute force: Collect all values, sort, build new list → O(N log N)
- Better: Compare all k heads each time → O(Nk)
- Optimal: Min-heap of size k holding current heads → O(N log k)

**Interview cheat sheet:**
- Keywords: "merge k sorted", "combine sorted"
- The trick: heap of size k, one entry per list
- The "aha moment": we only compare k elements at a time, not all N
- Memory hook: "k runners on k sorted tracks. Heap picks the leader. Advance that runner."

## Brute Force Intuition

Collect all node values into a single array, sort the array, then build a new linked list from the sorted values. Simple but doesn't leverage the fact that each list is already sorted.

## Brute Force Step-by-Step Solution

**Test case:** `lists = [[1,4,5],[1,3,4],[2,6]]`
**Expected:** `[1,1,2,3,4,4,5,6]`

**Step 1: Collect all values**
Traverse each list and add values to an array: [1, 4, 5, 1, 3, 4, 2, 6]

**Step 2: Sort**
[1, 1, 2, 3, 4, 4, 5, 6]

**Step 3: Build linked list**
Create nodes: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6

Return head. Answer: [1,1,2,3,4,4,5,6] ✓

---

**Why does this work?** All values end up in one sorted collection. We just rebuild the list.

**Beginner Mistakes:**
1. **Not handling empty lists in the input array.**
2. **Using O(N) extra space for the array when the problem could be solved with O(k) space using a heap.**

**30-second pitch:** "Collect all N values, sort O(N log N), rebuild list. Simple but doesn't exploit the pre-sorted structure."

## Brute Force In-depth Intuition

This approach ignores the sorted property entirely. It treats the input as unstructured data. The sorting step redoes work that's already been done (each list is already internally sorted).

## Brute Force Algorithm

```
function mergeKLists_brute(lists):
    values = []
    for each list in lists:
        node = list.head
        while node != null:
            values.add(node.val)
            node = node.next
    sort(values)
    dummy = new ListNode(0)
    cur = dummy
    for val in values:
        cur.next = new ListNode(val)
        cur = cur.next
    return dummy.next
```

## Brute Force Code

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        List<Integer> values = new ArrayList<>();
        for (ListNode list : lists) {
            ListNode cur = list;
            while (cur != null) {
                values.add(cur.val);
                cur = cur.next;
            }
        }
        Collections.sort(values);
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int val : values) {
            cur.next = new ListNode(val);
            cur = cur.next;
        }
        return dummy.next;
    }
}
```

## Brute Force Complexity

**Time:** O(N log N) — N is total nodes. Sorting dominates.
**Space:** O(N) — storing all values.

## Brute Force Hints

1. What if you just collected all values?
2. After sorting them, you can rebuild the list.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz7b-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz7b-btn:disabled{opacity:0.3}
</style>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz7b-btn" id="prev7b" onclick="prev7b()">← Prev</button>
  <button class="viz7b-btn" id="next7b" onclick="next7b()">Next →</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="sl7b">Ready</span>
</div>
<div style="background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px">
  <svg id="svg7b" width="100%" viewBox="0 0 460 160"></svg>
</div>
<div style="padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px" id="expl7b"></div>
<script>
const BS7=[
  {lists:[[1,4,5],[1,3,4],[2,6]],collected:null,sorted:null,msg:'3 sorted lists: [1→4→5], [1→3→4], [2→6]'},
  {lists:[[1,4,5],[1,3,4],[2,6]],collected:[1,4,5,1,3,4,2,6],sorted:null,msg:'Collected all values: [1, 4, 5, 1, 3, 4, 2, 6]'},
  {lists:null,collected:null,sorted:[1,1,2,3,4,4,5,6],msg:'Sorted: [1, 1, 2, 3, 4, 4, 5, 6]. Build linked list from this.'}
];
let si7b=0;
function render7b(){const s=BS7[si7b];let svg='';
if(s.lists){s.lists.forEach((l,li)=>{const y=20+li*40;svg+=`<text x="5" y="${y+12}" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">L${li+1}:</text>`;
l.forEach((v,i)=>{const x=35+i*55;svg+=`<rect x="${x}" y="${y}" width="36" height="24" rx="4" fill="#1a1a20" stroke="#3f3f46" stroke-width="1"/>`;svg+=`<text x="${x+18}" y="${y+13}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#a1a1aa" font-family="JetBrains Mono,monospace">${v}</text>`;if(i<l.length-1)svg+=`<line x1="${x+36}" y1="${y+12}" x2="${x+55}" y2="${y+12}" stroke="#3f3f46" stroke-width="1" marker-end="url(#arr7b)"/>`;});});}
if(s.collected){const y=20;svg+=`<text x="5" y="${y}" font-size="10" fill="#52525b" font-family="system-ui">Collected:</text>`;s.collected.forEach((v,i)=>{const x=80+i*42;svg+=`<rect x="${x}" y="${y+5}" width="36" height="24" rx="4" fill="rgba(79,143,247,0.1)" stroke="#4f8ff7" stroke-width="1"/>`;svg+=`<text x="${x+18}" y="${y+18}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#93c5fd" font-family="JetBrains Mono,monospace">${v}</text>`;});}
if(s.sorted){const y=60;svg+=`<text x="5" y="${y}" font-size="10" fill="#52525b" font-family="system-ui">Result:</text>`;s.sorted.forEach((v,i)=>{const x=60+i*42;svg+=`<rect x="${x}" y="${y+5}" width="36" height="24" rx="4" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>`;svg+=`<text x="${x+18}" y="${y+18}" text-anchor="middle" dominant-baseline="central" font-size="11" fill="#34d399" font-family="JetBrains Mono,monospace">${v}</text>`;if(i<s.sorted.length-1)svg+=`<text x="${x+38}" y="${y+18}" font-size="10" fill="#3f3f46">→</text>`;});}
document.getElementById('svg7b').innerHTML=svg;document.getElementById('expl7b').innerHTML=s.msg;
document.getElementById('sl7b').textContent=`Step ${si7b+1}/${BS7.length}`;document.getElementById('prev7b').disabled=si7b<=0;document.getElementById('next7b').disabled=si7b>=BS7.length-1;}
function next7b(){if(si7b<BS7.length-1){si7b++;render7b();}}
function prev7b(){if(si7b>0){si7b--;render7b();}}
render7b();
</script>
</div>

## Optimal Intuition

Use a min-heap of size k. Initially, add the head node of each non-empty list. Repeatedly: extract the minimum node from the heap, append it to the result, and if that node has a next pointer, add next to the heap. The heap always holds at most k elements (one per list), so each operation is O(log k).

## Optimal Step-by-Step Solution

**Test case:** `lists = [[1,4,5],[1,3,4],[2,6]]`, k = 3
**Expected:** `[1,1,2,3,4,4,5,6]`

**Initial state:**
- List 0: 1 → 4 → 5
- List 1: 1 → 3 → 4
- List 2: 2 → 6
- minHeap = [] (empty)
- result = dummy → (empty)

---

**Step 1: Initialize heap with heads of all lists**

Add head of list 0 (value 1), list 1 (value 1), list 2 (value 2).
minHeap = [(1, list0), (1, list1), (2, list2)]
Root = 1 (from list 0, by insertion order tiebreak).

---

**Step 2: Extract min = 1 (from list 0)**

Code: `node = heap.poll()` → node with value 1 from list 0. Append to result.
node.next = 4, so add (4, list0) to heap.
minHeap = [(1, list1), (2, list2), (4, list0)]
result: 1

---

**Step 3: Extract min = 1 (from list 1)**

node with value 1 from list 1. Append.
node.next = 3, add to heap.
minHeap = [(2, list2), (4, list0), (3, list1)]
result: 1 → 1

---

**Step 4: Extract min = 2 (from list 2)**

node.next = 6, add to heap.
minHeap = [(3, list1), (4, list0), (6, list2)]
result: 1 → 1 → 2

---

**Step 5: Extract min = 3 (from list 1)**

node.next = 4, add to heap.
minHeap = [(4, list0), (6, list2), (4, list1)]
result: 1 → 1 → 2 → 3

---

**Step 6: Extract min = 4 (from list 0)**

node.next = 5, add to heap.
minHeap = [(4, list1), (6, list2), (5, list0)]
result: 1 → 1 → 2 → 3 → 4

---

**Step 7: Extract min = 4 (from list 1)**

node.next = null. Don't add anything.
minHeap = [(5, list0), (6, list2)]
result: 1 → 1 → 2 → 3 → 4 → 4

💡 KEY INSIGHT: When a list is exhausted (next = null), we simply don't add anything to the heap. The heap naturally shrinks. This handles lists of different lengths elegantly.

---

**Step 8: Extract min = 5 (from list 0)**

node.next = null. List 0 exhausted.
minHeap = [(6, list2)]
result: 1 → 1 → 2 → 3 → 4 → 4 → 5

---

**Step 9: Extract min = 6 (from list 2)**

node.next = null. Last list exhausted.
minHeap = [] (empty)
result: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6 ✓

---

**Why does this work?** At every step, the heap contains the current "front" of each active list. The minimum of these fronts is the globally smallest remaining element (because each list is sorted, elements behind the front are even larger). So extracting the heap minimum always gives us the next element in sorted order.

**The Key Invariant:** "At every step, the heap contains exactly one node from each non-exhausted list, and these nodes are the smallest unprocessed nodes from their respective lists."

**Beginner Mistakes:**
1. **Not handling null/empty lists:** Some lists might be empty. Check before adding to heap.
2. **Comparing ListNode objects directly:** Java's PriorityQueue needs a Comparator for ListNode. Use `(a, b) -> a.val - b.val`.
3. **Forgetting to advance the pointer:** After extracting a node, you must check `node.next` and add it to the heap if non-null.

**30-second pitch:** "Min-heap of size k. Initialize with all list heads. Repeatedly: extract min, append to result, push next node from that list. O(N log k) where N is total nodes. The heap ensures we always pick the globally smallest available element."

## Optimal In-depth Intuition

This is a generalization of merge sort's merge step. Merge sort merges 2 sorted arrays; this merges k sorted lists. With 2 lists, we just compare two elements. With k lists, comparing all k heads naively is O(k) per step. A heap reduces this to O(log k) per step, turning the total from O(Nk) to O(N log k).

The connection to merge sort is deep: you could also solve this by divide-and-conquer — merge lists pairwise, then merge the results pairwise, etc. That's also O(N log k) but uses O(1) extra space (no heap). Both approaches are valid in interviews.

## Optimal Algorithm

```
function mergeKLists(lists):
    minHeap = new PriorityQueue(compareByValue)
    for list in lists:
        if list != null:
            minHeap.offer(list)         // Add head of each list
    
    dummy = new ListNode(0)
    tail = dummy
    
    while minHeap is not empty:
        node = minHeap.poll()           // Get smallest
        tail.next = node
        tail = tail.next
        if node.next != null:
            minHeap.offer(node.next)    // Add next from that list
    
    return dummy.next
```

## Optimal Code

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        // Min-heap comparing by node value
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );
        
        // Add head of each non-empty list
        for (ListNode list : lists) {
            if (list != null) {
                minHeap.offer(list);
            }
        }
        
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        
        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            tail.next = node;
            tail = tail.next;
            if (node.next != null) {
                minHeap.offer(node.next);
            }
        }
        
        return dummy.next;
    }
}
```

## Optimal Complexity

**Time:** O(N log k) — N is total number of nodes. Each of the N nodes is inserted and extracted from the heap exactly once. Each heap operation on a heap of size ≤ k costs O(log k).

**Space:** O(k) — The heap stores at most k nodes at any time (one per list).

## Optimal Hints

1. At each step, you need the smallest among k candidates. What data structure gives min in O(log k)?
2. Initialize the heap with the head of each list.
3. After extracting a node, what should you add to the heap?
4. When a list is exhausted (next = null), the heap naturally shrinks.
5. Use a dummy head node to simplify list construction.
6. The Comparator for ListNode: `(a, b) -> a.val - b.val`.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz7-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}@media(max-width:700px){.viz7-grid{grid-template-columns:1fr}}
.viz7-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz7-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz7-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz7-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz7-btn:disabled{opacity:0.3}
.viz7-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar7"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz7-btn" id="prev7" onclick="prev7()">← Prev</button>
  <button class="viz7-btn" id="next7" onclick="next7()">Next →</button>
  <button class="viz7-btn" id="auto7" onclick="toggleAuto7()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel7">Ready</span>
</div>
<div class="viz7-grid">
  <div>
    <div class="viz7-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Lists + Heap + Result</div>
      <svg id="svg7" width="100%" viewBox="0 0 460 320"></svg>
    </div>
  </div>
  <div>
    <div class="viz7-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz7-log" id="log7"></div>
    </div>
    <div class="viz7-expl" id="expl7"></div>
  </div>
</div>
<script>
const TCS_7=[
    {name:"3 lists",data:{lists:[[1,4,5],[1,3,4],[2,6]]}},
    {name:"2 lists",data:{lists:[[1,2,3],[1,2,3]]}},
    {name:"Empty+non",data:{lists:[[],[1,3],[2]]}}
];
let steps7=[],stepIdx7=-1,autoInt7=null;
function buildSteps7(tc){steps7=[];const lists=tc.lists.map(l=>[...l]);const ptrs=lists.map(()=>0);const heap=[];const result=[];
function heapCmp(a,b){return a.val-b.val;}
function hp(item){heap.push(item);let i=heap.length-1;while(i>0){const p=Math.floor((i-1)/2);if(heapCmp(heap[i],heap[p])<0){const t=heap[i];heap[i]=heap[p];heap[p]=t;i=p;}else break;}}
function hpop(){if(heap.length<=1)return heap.pop();const v=heap[0];heap[0]=heap[heap.length-1];heap.pop();let i=0;while(2*i+1<heap.length){let s=i;const l=2*i+1,r=2*i+2;if(l<heap.length&&heapCmp(heap[l],heap[s])<0)s=l;if(r<heap.length&&heapCmp(heap[r],heap[s])<0)s=r;if(s!==i){const t=heap[i];heap[i]=heap[s];heap[s]=t;i=s;}else break;}return v;}
function add(msg,c,e){steps7.push({msg,color:c,explanation:e,lists:lists.map(l=>[...l]),ptrs:[...ptrs],heap:heap.map(h=>({...h})),result:[...result]});}
add(`${lists.length} sorted lists. Initialize heap with heads.`,'#4f8ff7',`Add the first element of each non-empty list to the min-heap.`);
for(let i=0;i<lists.length;i++){if(lists[i].length>0){hp({val:lists[i][0],li:i});ptrs[i]=1;add(`Add head of list ${i}: value ${lists[i][0]}`,'#4f8ff7',`Heap now has ${heap.length} elements. Root = ${heap[0].val}.`);}}
while(heap.length>0){const node=hpop();result.push(node.val);const li=node.li;
add(`Extract min=${node.val} from list ${li}. Append to result.`,'#34d399',`Smallest current head is ${node.val} from list ${li}. It becomes the next element in our merged result.`);
if(ptrs[li]<lists[li].length){const nv=lists[li][ptrs[li]];hp({val:nv,li:li});ptrs[li]++;add(`Advance list ${li}: add next value ${nv}`,'#4f8ff7',`List ${li} still has elements. Add ${nv} to heap. Heap root = ${heap.length>0?heap[0].val:'empty'}.`);} else {add(`List ${li} exhausted. Heap size now ${heap.length}.`,'#71717a',`No more elements in list ${li}. Heap naturally shrinks.`);}}
add(`Done! Merged: [${result.join(', ')}]`,'#34d399',`All lists exhausted. Merged result is complete.`);}

function render7(){const s=steps7[stepIdx7];if(!s)return;let svg='';
// Lists
s.lists.forEach((l,li)=>{const y=10+li*28;svg+=`<text x="5" y="${y+12}" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">L${li}:</text>`;
l.forEach((v,i)=>{const x=28+i*40;const used=i<s.ptrs[li];const c=used?'#3f3f46':'#a1a1aa';const bg=used?'transparent':'#1a1a20';
svg+=`<rect x="${x}" y="${y}" width="30" height="20" rx="3" fill="${bg}" stroke="${c}" stroke-width="1" ${used?'stroke-dasharray="3"':''}/>`;svg+=`<text x="${x+15}" y="${y+11}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="${c}" font-family="JetBrains Mono,monospace">${v}</text>`;});
if(s.ptrs[li]<l.length){const px=28+s.ptrs[li]*40+15;svg+=`<text x="${px}" y="${y+26}" text-anchor="middle" font-size="8" fill="#4f8ff7">▲</text>`;}});

// Heap
const hY=100;svg+=`<text x="230" y="${hY}" text-anchor="middle" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">MIN-HEAP</text>`;
const h=s.heap;
for(let i=0;i<h.length;i++){const l=Math.floor(Math.log2(i+1));const p=i-(Math.pow(2,l)-1);const t=Math.pow(2,l);const sp=280/(t+1);const x=90+sp*(p+1);const y=hY+15+l*40;
if(i>0){const pi=Math.floor((i-1)/2);const pl=Math.floor(Math.log2(pi+1));const pp=pi-(Math.pow(2,pl)-1);const pt=Math.pow(2,pl);const ps=280/(pt+1);svg+=`<line x1="${90+ps*(pp+1)}" y1="${hY+15+pl*40+12}" x2="${x}" y2="${y-12}" stroke="#3f3f46" stroke-width="1"/>`;}
const isR=i===0;svg+=`<circle cx="${x}" cy="${y}" r="14" fill="${isR?'rgba(52,211,153,0.1)':'#1a1a20'}" stroke="${isR?'#34d399':'#3f3f46'}" stroke-width="1.5"/>`;
svg+=`<text x="${x}" y="${y-1}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="700" fill="${isR?'#34d399':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${h[i].val}</text>`;
svg+=`<text x="${x}" y="${y+10}" text-anchor="middle" font-size="7" fill="#52525b" font-family="JetBrains Mono,monospace">L${h[i].li}</text>`;}

// Result
const rY=230;svg+=`<text x="5" y="${rY}" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">RESULT:</text>`;
s.result.forEach((v,i)=>{const x=60+i*36;svg+=`<rect x="${x}" y="${rY+5}" width="28" height="20" rx="3" fill="rgba(52,211,153,0.1)" stroke="#34d399" stroke-width="1"/>`;svg+=`<text x="${x+14}" y="${rY+16}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#34d399" font-family="JetBrains Mono,monospace">${v}</text>`;if(i<s.result.length-1)svg+=`<text x="${x+30}" y="${rY+16}" font-size="8" fill="#3f3f46">→</text>`;});

document.getElementById('svg7').innerHTML=svg;
let lh='';for(let i=0;i<=stepIdx7;i++){lh+=`<div style="color:${steps7[i].color}">${i===stepIdx7?'▶ ':'  '}${steps7[i].msg}</div>`;}
document.getElementById('log7').innerHTML=lh;document.getElementById('log7').scrollTop=99999;
document.getElementById('expl7').innerHTML=s.explanation;document.getElementById('stepLabel7').textContent=`Step ${stepIdx7+1}/${steps7.length}`;
document.getElementById('prev7').disabled=stepIdx7<=0;document.getElementById('next7').disabled=stepIdx7>=steps7.length-1;}
function next7(){if(stepIdx7<steps7.length-1){stepIdx7++;render7();}}function prev7(){if(stepIdx7>0){stepIdx7--;render7();}}
function toggleAuto7(){if(autoInt7){clearInterval(autoInt7);autoInt7=null;document.getElementById('auto7').textContent='▶ Auto';}else{autoInt7=setInterval(()=>{if(stepIdx7>=steps7.length-1){toggleAuto7();return;}next7();},1200);document.getElementById('auto7').textContent='⏸ Pause';}}
function loadTc7(idx){stepIdx7=0;buildSteps7(TCS_7[idx].data);document.querySelectorAll('[data-tc7]').forEach((b,i)=>{b.className=i===idx?'viz7-btn active':'viz7-btn';});render7();}
const tcBar7=document.getElementById('tcBar7');TCS_7.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz7-btn active':'viz7-btn';b.setAttribute('data-tc7','');b.onclick=()=>loadTc7(i);tcBar7.appendChild(b);});
buildSteps7(TCS_7[0].data);stepIdx7=0;render7();
</script>
</div>
