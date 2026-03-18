# Replace Elements by Their Rank

**Difficulty:** Easy
**GFG:** https://www.geeksforgeeks.org/problems/replace-elements-by-its-rank-in-the-array/1
**YouTube:** https://www.youtube.com/watch?v=g2RwVaGpHT4

## Description

Given an array of `n` integers, replace each element by its rank in the array. The rank of an element is defined as the distance between the element and the smallest element. The smallest element has rank 1. If two elements are equal, they have the same rank.

**Input:** `int[] arr` of size `n`
**Output:** Array where each element is replaced by its rank

**Constraints:**
- 1 ≤ n ≤ 10⁵
- 1 ≤ arr[i] ≤ 10⁹

**Examples:**

Example 1:
```
Input: arr = [20, 15, 26, 2, 98, 6]
Output: [4, 3, 5, 1, 6, 2]
Explanation: Sorted unique: [2, 6, 15, 20, 26, 98] → ranks 1,2,3,4,5,6
  20 → rank 4, 15 → rank 3, 26 → rank 5, 2 → rank 1, 98 → rank 6, 6 → rank 2
```

Example 2:
```
Input: arr = [2, 2, 1, 6]
Output: [2, 2, 1, 3]
Explanation: Sorted unique: [1, 2, 6] → ranks 1, 2, 3
  2 → rank 2, 2 → rank 2, 1 → rank 1, 6 → rank 3
```

**Notable Edge Cases:**
- All elements equal: every element gets rank 1
- Already sorted: ranks are 1, 2, 3, ...
- Single element: rank is 1

## In-depth Explanation

**Reframe:** Coordinate compress the array. Map each distinct value to its position in the sorted order of unique values.

**Pattern recognition:** This is a sorting + mapping problem. While a heap can solve it, a sorted map or sort + HashMap is more natural.

**Real-world analogy:** Students take an exam. Instead of showing scores, you show rankings. If two students score the same, they share a rank.

**Why naive fails:** For each element, scanning the entire array to count how many are smaller is O(n²).

**Approach roadmap:**
- Brute force: For each element, count distinct smaller elements → O(n²)
- Optimal: Sort to determine ranks, use HashMap → O(n log n)

**Interview cheat sheet:**
- Keywords: "rank", "relative order", "coordinate compression"
- Memory hook: "Sort, rank, map back."

## Optimal Intuition

Create pairs of (value, original index), sort by value, assign ranks (incrementing only when value changes for handling duplicates), then place ranks back at original indices.

## Optimal Step-by-Step Solution

**Test case:** `arr = [20, 15, 26, 2, 98, 6]`
**Expected:** `[4, 3, 5, 1, 6, 2]`

**Initial state:** arr = [20, 15, 26, 2, 98, 6]

---

**Step 1: Create (value, index) pairs and sort by value**

Pairs: [(20,0), (15,1), (26,2), (2,3), (98,4), (6,5)]
After sorting by value: [(2,3), (6,5), (15,1), (20,0), (26,2), (98,4)]

---

**Step 2: Assign ranks**

Process sorted pairs. Start rank = 1. Increment rank only when value changes.

- (2, 3): rank = 1. result[3] = 1.
- (6, 5): 6 ≠ 2, so rank = 2. result[5] = 2.
- (15, 1): 15 ≠ 6, rank = 3. result[1] = 3.
- (20, 0): 20 ≠ 15, rank = 4. result[0] = 4.
- (26, 2): 26 ≠ 20, rank = 5. result[2] = 5.
- (98, 4): 98 ≠ 26, rank = 6. result[4] = 6.

💡 KEY INSIGHT: By sorting first, we process elements in order. Equal elements get the same rank because we only increment when the value changes. The original index lets us put the rank back in the right position.

**Final result:** [4, 3, 5, 1, 6, 2] ✓

---

**Why does this work?** Sorting reveals the natural ordering. The rank of an element equals "how many distinct values are ≤ this value." By processing sorted order and tracking previous value, we assign ranks in O(n) after the O(n log n) sort.

**The Key Invariant:** "After processing sorted pair i, all elements with values ≤ sorted[i].value have their correct rank assigned."

**Beginner Mistakes:**
1. **Incrementing rank for duplicates:** If two consecutive sorted values are equal, rank should NOT change.
2. **Losing original positions:** Without storing original indices, you can't map ranks back.
3. **Using 0-based rank instead of 1-based:** Problem says smallest = rank 1, not rank 0.

**30-second pitch:** "Sort (value, index) pairs by value. Walk through sorted order, assigning incrementing ranks (same rank for ties). Place each rank at original index. O(n log n) time, O(n) space."

## Optimal In-depth Intuition

This is essentially coordinate compression. We map the actual values to their ranks (1, 2, 3, ...) based on sorted order. A HashMap from value → rank after sorting unique values works cleanly. Alternatively, the sort-with-index approach avoids explicit deduplication.

## Optimal Algorithm

```
function replaceByRank(arr):
    n = arr.length
    // Create sorted copy with original indices
    pairs = [(arr[i], i) for i in 0..n-1]
    sort pairs by value
    
    result = new int[n]
    rank = 1
    result[pairs[0].index] = 1
    
    for i = 1 to n-1:
        if pairs[i].value != pairs[i-1].value:
            rank++
        result[pairs[i].index] = rank
    
    return result
```

## Optimal Code

```java
class Solution {
    public int[] replaceByRank(int[] arr) {
        int n = arr.length;
        // Create pairs: [value, originalIndex]
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = arr[i];
            pairs[i][1] = i;
        }
        
        // Sort by value
        Arrays.sort(pairs, (a, b) -> a[0] - b[0]);
        
        int[] result = new int[n];
        int rank = 1;
        result[pairs[0][1]] = 1;
        
        for (int i = 1; i < n; i++) {
            if (pairs[i][0] != pairs[i - 1][0]) {
                rank++;
            }
            result[pairs[i][1]] = rank;
        }
        
        return result;
    }
}
```

## Optimal Complexity

**Time:** O(n log n) — Sorting the pairs dominates. The rank assignment loop is O(n).
**Space:** O(n) — For the pairs array and result array.

## Optimal Hints

1. How do you determine rank? By comparing with other elements. Sorting makes comparison trivial.
2. Handle duplicates: same value → same rank. Only increment when value changes.
3. Store original indices so you can place ranks back.
4. Alternative: sort unique values, build a value → rank HashMap, then map back.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz8-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz8-btn:disabled{opacity:0.3}
.viz8-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar8"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz8-btn" id="prev8" onclick="prev8()">← Prev</button>
  <button class="viz8-btn" id="next8" onclick="next8()">Next →</button>
  <button class="viz8-btn" id="auto8" onclick="toggleAuto8()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel8">Ready</span>
</div>
<div style="background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px">
  <svg id="svg8" width="100%" viewBox="0 0 460 200"></svg>
</div>
<div style="padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px" id="expl8"></div>
<script>
const TCS_8=[{name:"No dupes",data:[20,15,26,2,98,6]},{name:"With dupes",data:[2,2,1,6]},{name:"All same",data:[5,5,5]}];
let steps8=[],stepIdx8=-1,autoInt8=null;
function buildSteps8(arr){steps8=[];const n=arr.length;const pairs=arr.map((v,i)=>({v,i}));
steps8.push({msg:`Original: [${arr.join(', ')}]`,color:'#4f8ff7',original:arr,sorted:null,result:new Array(n).fill('_'),curSorted:-1,explanation:'Start with the original array. We need to replace each element with its rank.'});
pairs.sort((a,b)=>a.v-b.v);const sorted=pairs.map(p=>p.v);
steps8.push({msg:`Sorted: [${sorted.join(', ')}]`,color:'#4f8ff7',original:arr,sorted:sorted.map((v,i)=>({v,origIdx:pairs[i].i})),result:new Array(n).fill('_'),curSorted:-1,explanation:'Sort by value. Now assign ranks left to right, incrementing only when value changes.'});
const result=new Array(n).fill('_');let rank=1;
for(let i=0;i<n;i++){if(i>0&&pairs[i].v!==pairs[i-1].v)rank++;result[pairs[i].i]=rank;
steps8.push({msg:`Sorted[${i}]=${pairs[i].v} (orig idx ${pairs[i].i}) → rank ${rank}`,color:i>0&&pairs[i].v===pairs[i-1].v?'#f59e0b':'#34d399',original:arr,sorted:sorted.map((v,j)=>({v,origIdx:pairs[j].i})),result:[...result],curSorted:i,explanation:i>0&&pairs[i].v===pairs[i-1].v?`Same value as previous (${pairs[i].v} = ${pairs[i-1].v}), so same rank ${rank}.`:`${i>0?'New value '+pairs[i].v+' ≠ '+pairs[i-1].v+', increment to rank '+rank+'.':'First element, rank = 1.'} Place rank ${rank} at original index ${pairs[i].i}.`});}
steps8.push({msg:`Result: [${result.join(', ')}]`,color:'#34d399',original:arr,sorted:null,result:[...result],curSorted:-1,explanation:'All ranks assigned! Each element replaced by its rank.'});}

function render8(){const s=steps8[stepIdx8];if(!s)return;let svg='';const bW=48,g=5,sx=30;
svg+=`<text x="5" y="18" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">ORIGINAL</text>`;
s.original.forEach((v,i)=>{const x=sx+i*55;svg+=`<rect x="${x}" y="24" width="${bW}" height="30" rx="5" fill="#1a1a20" stroke="#3f3f46" stroke-width="1"/>`;svg+=`<text x="${x+bW/2}" y="40" text-anchor="middle" dominant-baseline="central" font-size="12" fill="#a1a1aa" font-family="JetBrains Mono,monospace">${v}</text>`;svg+=`<text x="${x+bW/2}" y="18" text-anchor="middle" font-size="8" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;});
if(s.sorted){svg+=`<text x="5" y="85" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">SORTED</text>`;
s.sorted.forEach((item,i)=>{const x=sx+i*55;const isCur=i===s.curSorted;const c=isCur?'#4f8ff7':'#2a2a33';svg+=`<rect x="${x}" y="91" width="${bW}" height="30" rx="5" fill="${c}22" stroke="${isCur?c:'#3f3f46'}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="107" text-anchor="middle" dominant-baseline="central" font-size="12" fill="${isCur?'#fafaf9':'#a1a1aa'}" font-family="JetBrains Mono,monospace">${item.v}</text>`;svg+=`<text x="${x+bW/2}" y="85" text-anchor="middle" font-size="7" fill="#52525b" font-family="JetBrains Mono,monospace">orig:${item.origIdx}</text>`;});}
svg+=`<text x="5" y="150" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">RESULT</text>`;
s.result.forEach((v,i)=>{const x=sx+i*55;const filled=v!=='_';const c=filled?'#34d399':'#2a2a33';svg+=`<rect x="${x}" y="156" width="${bW}" height="30" rx="5" fill="${c}22" stroke="${filled?c:'#3f3f46'}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="172" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="${filled?'600':'400'}" fill="${filled?'#34d399':'#52525b'}" font-family="JetBrains Mono,monospace">${v}</text>`;});
document.getElementById('svg8').innerHTML=svg;document.getElementById('expl8').innerHTML=s.explanation;
document.getElementById('stepLabel8').textContent=`Step ${stepIdx8+1}/${steps8.length}`;document.getElementById('prev8').disabled=stepIdx8<=0;document.getElementById('next8').disabled=stepIdx8>=steps8.length-1;}
function next8(){if(stepIdx8<steps8.length-1){stepIdx8++;render8();}}function prev8(){if(stepIdx8>0){stepIdx8--;render8();}}
function toggleAuto8(){if(autoInt8){clearInterval(autoInt8);autoInt8=null;document.getElementById('auto8').textContent='▶ Auto';}else{autoInt8=setInterval(()=>{if(stepIdx8>=steps8.length-1){toggleAuto8();return;}next8();},1200);document.getElementById('auto8').textContent='⏸ Pause';}}
function loadTc8(idx){stepIdx8=0;buildSteps8(TCS_8[idx].data);document.querySelectorAll('[data-tc8]').forEach((b,i)=>{b.className=i===idx?'viz8-btn active':'viz8-btn';});render8();}
const tcBar8=document.getElementById('tcBar8');TCS_8.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz8-btn active':'viz8-btn';b.setAttribute('data-tc8','');b.onclick=()=>loadTc8(i);tcBar8.appendChild(b);});
buildSteps8(TCS_8[0].data);stepIdx8=0;render8();
</script>
</div>

---

# Task Scheduler

**Difficulty:** Medium
**LeetCode:** https://leetcode.com/problems/task-scheduler/
**YouTube:** https://www.youtube.com/watch?v=s8p8ukTyA2I

## Description

Given a character array `tasks` where each character represents a task, and a non-negative integer `n` representing the cooldown period between two same tasks, return the minimum number of intervals the CPU needs to finish all tasks. During cooldown, the CPU can be idle or execute a different task.

**Input:** `char[] tasks`, `int n`
**Output:** `int` — minimum intervals to complete all tasks

**Constraints:**
- 1 ≤ tasks.length ≤ 10⁴
- tasks[i] is uppercase English letter
- 0 ≤ n ≤ 100

**Examples:**

Example 1:
```
Input: tasks = ["A","A","A","B","B","B"], n = 2
Output: 8
Explanation: A → B → idle → A → B → idle → A → B
  Between each pair of A's, there are at least 2 intervals (B + idle).
```

Example 2:
```
Input: tasks = ["A","A","A","B","B","B"], n = 0
Output: 6
Explanation: No cooldown needed. Just execute all 6 tasks: AABBAB or any order.
```

Example 3:
```
Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
Output: 16
Explanation: A → B → C → A → D → E → A → F → G → A → idle → idle → A → idle → idle → A
```

**Notable Edge Cases:**
- n = 0: answer is just tasks.length (no cooldown)
- Single task type: answer is 1 + (count-1) × (n+1)
- Many task types: idles may not be needed

## In-depth Explanation

**Reframe:** The most frequent task creates the "skeleton" of the schedule. Between consecutive executions of the most frequent task, we have `n` slots to fill with other tasks or idle time. The answer depends on whether we have enough distinct tasks to fill these gaps.

**Pattern recognition:** This is a greedy + math problem. Count frequencies, then use the formula based on the maximum frequency. A heap can simulate the scheduling, but the math approach is O(n).

**Real-world analogy:** Imagine a chef who must wait 2 minutes between cooking the same dish (oven needs to cool). If they can cook other dishes in the gap, there's no wasted time. But if they have 10 orders of the same dish and only 1 other dish type, they'll have lots of idle waiting.

**Why naive fails:** Simulating the schedule step-by-step without strategy would try all possible orderings.

**Approach roadmap:**
- Greedy with max-heap: simulate scheduling, always pick highest-frequency available task → O(N log 26) ≈ O(N)
- Math formula: compute directly from frequencies → O(N)

**Interview cheat sheet:**
- Keywords: "cooldown", "scheduler", "minimum intervals"
- The formula: `max(tasks.length, (maxFreq - 1) × (n + 1) + countOfMaxFreq)`
- The "aha moment": the most frequent task determines the frame; other tasks fill gaps
- Memory hook: "Frame = (maxFreq-1) × (n+1) + ties. Answer = max(frame, total tasks)."

## Optimal Intuition (Math Approach)

Count the frequency of each task. Find the maximum frequency `maxFreq` and count how many tasks have this maximum frequency `maxCount`. The minimum intervals = `max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)`. The first term handles when there are enough tasks to fill all gaps; the second handles when idle time is needed.

## Optimal Step-by-Step Solution

**Test case:** `tasks = ["A","A","A","B","B","B"], n = 2`
**Expected:** `8`

**Initial state:**
- tasks = [A, A, A, B, B, B]
- n = 2 (cooldown period)
- total tasks = 6

---

**Step 1: Count frequencies**

Code executing: Count each task's occurrences.

**What do we see?**
- freq['A'] = 3
- freq['B'] = 3

---

**Step 2: Find maxFreq and maxCount**

**What do we see?**
- maxFreq = 3 (both A and B appear 3 times)
- maxCount = 2 (two tasks have the maximum frequency)

---

**Step 3: Build the frame**

**Where are we?** We're constructing the minimum schedule based on the most frequent task(s).

The schedule frame for maxFreq = 3 with cooldown n = 2:

```
[A] [_] [_] | [A] [_] [_] | [A]
```

We have (maxFreq - 1) = 2 "full blocks" of size (n + 1) = 3, plus a final partial block.

Frame size = (maxFreq - 1) × (n + 1) + maxCount = (3-1) × (2+1) + 2 = 2 × 3 + 2 = 8

💡 KEY INSIGHT: The frame represents the minimum time if we ONLY had the most frequent tasks. `(maxFreq - 1)` gaps between the first and last execution, each gap must be `n + 1` intervals long (including the task itself). The `+ maxCount` accounts for the final row where all max-frequency tasks execute once more.

---

**Step 4: Fill in the frame with B tasks**

```
[A] [B] [idle] | [A] [B] [idle] | [A] [B]
  1    2    3      4    5    6      7    8
```

We filled B into the first slot of each block. One idle remains per block.

---

**Step 5: Apply the formula**

result = max(tasks.length, frame) = max(6, 8) = **8**

**Why take the max?** If there are more tasks than the frame size, it means we have enough variety to fill all gaps (and more), so no idle time is needed. In that case, the answer is just `tasks.length`. But here, 6 < 8, so we need 2 idle slots → answer is 8.

---

**Let's verify with another case:** tasks = ["A","A","A","B","B","B","C","C","C","D","D","E"], n = 2

- Frequencies: A=3, B=3, C=3, D=2, E=1. Total = 12
- maxFreq = 3, maxCount = 3 (A, B, C)
- Frame = (3-1) × (2+1) + 3 = 6 + 3 = 9
- result = max(12, 9) = **12** (enough tasks to fill all gaps!)

Schedule: A B C D A B C D A B C E → 12 intervals, no idle!

---

**Why does this work?** The most frequent task creates a "skeleton" with mandatory gaps. Other tasks fill these gaps. If there are enough tasks to fill all gaps, no idle time is needed and the answer equals the total number of tasks. If not, the formula calculates the exact number of idle slots needed.

**The Key Invariant:** "The most frequent task dictates the minimum frame. Other tasks reduce idle time but can never increase the frame beyond `total tasks`."

**Beginner Mistakes:**
1. **Forgetting the `max(tasks.length, formula)`:** When tasks are abundant, the frame might be smaller than the total tasks, and the answer is just `tasks.length`.
2. **Not counting maxCount correctly:** If multiple tasks share the max frequency (like A=3, B=3), they ALL go in the final partial block.
3. **Confusing n with n+1:** Each block has size `n + 1` (the task itself + n cooldown slots), not just `n`.

**What if the interviewer asks "Can you simulate this with a heap?"** Yes — use a max-heap of frequencies. Each round: extract up to n+1 tasks from the heap, execute them (decrement frequency), put non-zero frequencies back. Count the intervals. This is O(N × 26) ≈ O(N).

**30-second pitch:** "Count frequencies. The most frequent task creates a frame: (maxFreq - 1) × (n + 1) + count of tasks at maxFreq. Answer is max of this frame and total task count. O(N) time."

## Optimal In-depth Intuition

The mathematical insight is that the schedule has `(maxFreq - 1)` "full rounds" of length `(n + 1)`, where in each round we execute the max-frequency task plus up to `n` other tasks. The last round is partial — it only contains the tasks that have the maximum frequency (since they need one more execution).

When `total_tasks > frame_size`, it means the idle slots are completely filled by other tasks, and we might even need to "extend" rounds. But extending rounds doesn't violate cooldown (there are more tasks than slots), so the answer is simply `total_tasks`.

## Optimal Algorithm

```
function leastInterval(tasks, n):
    freq = count frequency of each task
    maxFreq = maximum frequency
    maxCount = number of tasks with frequency == maxFreq
    
    frame = (maxFreq - 1) * (n + 1) + maxCount
    return max(tasks.length, frame)
```

## Optimal Code

```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char task : tasks) {
            freq[task - 'A']++;
        }
        
        int maxFreq = 0;
        for (int f : freq) {
            maxFreq = Math.max(maxFreq, f);
        }
        
        // Count how many tasks have the maximum frequency
        int maxCount = 0;
        for (int f : freq) {
            if (f == maxFreq) maxCount++;
        }
        
        // Frame: (maxFreq-1) full blocks of (n+1) + final partial block
        int frame = (maxFreq - 1) * (n + 1) + maxCount;
        
        // Answer: at least total tasks, at least the frame size
        return Math.max(tasks.length, frame);
    }
}
```

## Optimal Complexity

**Time:** O(N) — One pass to count frequencies, one pass to find max, one pass to count maxCount. N = tasks.length.

**Space:** O(1) — The frequency array is fixed size 26 (constant).

## Optimal Hints

1. Which task constrains the schedule the most? The most frequent one.
2. If A appears 3 times and n = 2, the minimum is: A _ _ A _ _ A = 7 slots.
3. What fills those underscores? Other tasks, or idle.
4. What if multiple tasks share the maximum frequency? They all need one slot in the last group.
5. The formula: `(maxFreq - 1) * (n + 1) + maxCount`. Don't forget `max(tasks.length, formula)`.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz9-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}@media(max-width:700px){.viz9-grid{grid-template-columns:1fr}}
.viz9-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz9-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz9-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz9-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz9-btn:disabled{opacity:0.3}
.viz9-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar9"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz9-btn" id="prev9" onclick="prev9()">← Prev</button>
  <button class="viz9-btn" id="next9" onclick="next9()">Next →</button>
  <button class="viz9-btn" id="auto9" onclick="toggleAuto9()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel9">Ready</span>
</div>
<div class="viz9-grid">
  <div>
    <div class="viz9-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Schedule Grid</div>
      <svg id="svg9" width="100%" viewBox="0 0 460 250"></svg>
    </div>
  </div>
  <div>
    <div class="viz9-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz9-log" id="log9"></div>
    </div>
    <div class="viz9-expl" id="expl9"></div>
  </div>
</div>
<script>
const TCS_9=[
    {name:"n=2, basic",data:{tasks:['A','A','A','B','B','B'],n:2}},
    {name:"n=0",data:{tasks:['A','A','A','B','B','B'],n:0}},
    {name:"Many tasks",data:{tasks:['A','A','A','A','A','A','B','C','D','E','F','G'],n:2}}
];
let steps9=[],stepIdx9=-1,autoInt9=null;
function buildSteps9(tc){steps9=[];const tasks=tc.tasks,n=tc.n;const freq={};
tasks.forEach(t=>{freq[t]=(freq[t]||0)+1;});const entries=Object.entries(freq).sort((a,b)=>b[1]-a[1]);
const maxFreq=entries[0][1];let maxCount=0;entries.forEach(([k,v])=>{if(v===maxFreq)maxCount++;});
const frame=(maxFreq-1)*(n+1)+maxCount;const ans=Math.max(tasks.length,frame);

// Build schedule grid
const grid=[];const cols=n+1;const rows=maxFreq;
for(let r=0;r<rows;r++)grid.push(new Array(cols).fill(null));
// Place max-freq tasks in first columns
let col=0;entries.forEach(([task,count])=>{if(count===maxFreq){for(let r=0;r<rows;r++)grid[r][col]=task;col++;}});
// Fill remaining
let r=0,c=col;entries.forEach(([task,count])=>{if(count<maxFreq){for(let i=0;i<count;i++){if(c>=cols){c=col;r++;}if(r>=rows-1&&c>=maxCount)break;grid[r][c]=task;c++;if(c>=cols){c=col;r++;}}}});

steps9.push({msg:`Tasks: [${tasks.join(',')}], n=${n}`,color:'#4f8ff7',grid:null,freqs:entries,phase:'freq',explanation:`Count frequencies: ${entries.map(([k,v])=>`${k}=${v}`).join(', ')}.`});
steps9.push({msg:`maxFreq=${maxFreq}, maxCount=${maxCount}`,color:'#4f8ff7',grid:null,freqs:entries,phase:'max',explanation:`Most frequent task(s) appear ${maxFreq} times. ${maxCount} task(s) share this frequency.`});
steps9.push({msg:`Frame: (${maxFreq}-1)×(${n}+1)+${maxCount} = ${frame}`,color:'#f59e0b',grid:grid,freqs:entries,phase:'frame',explanation:`Create a grid: ${maxFreq-1} full rows of ${n+1} slots + final row with ${maxCount} slots. Frame = ${frame}.`});
steps9.push({msg:`Fill tasks into grid slots`,color:'#34d399',grid:grid,freqs:entries,phase:'fill',explanation:`Place max-freq tasks in columns. Fill remaining tasks into empty slots left-to-right, top-to-bottom.`});
steps9.push({msg:`Answer: max(${tasks.length}, ${frame}) = ${ans}`,color:'#34d399',grid:grid,freqs:entries,phase:'done',explanation:`${tasks.length >= frame ? 'Enough tasks to fill all gaps. Answer = total tasks.' : 'Not enough tasks. Some slots are idle. Answer = frame size.'} Result: ${ans}.`});}

const TASK_COLORS={'A':'#4f8ff7','B':'#34d399','C':'#f59e0b','D':'#a78bfa','E':'#f472b6','F':'#fb923c','G':'#38bdf8'};
function render9(){const s=steps9[stepIdx9];if(!s)return;let svg='';
// Frequency bars
svg+=`<text x="5" y="15" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">FREQUENCIES</text>`;
s.freqs.forEach(([task,count],i)=>{const x=10+i*60;const c=TASK_COLORS[task]||'#71717a';
svg+=`<rect x="${x}" y="25" width="45" height="22" rx="4" fill="${c}22" stroke="${c}" stroke-width="1"/>`;
svg+=`<text x="${x+22}" y="37" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="${c}" font-family="JetBrains Mono,monospace">${task}:${count}</text>`;});

if(s.grid){svg+=`<text x="5" y="70" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">SCHEDULE GRID</text>`;
const bW=38,bH=28,g=3,sx=10,sy=80;
s.grid.forEach((row,ri)=>{row.forEach((cell,ci)=>{const x=sx+ci*(bW+g);const y=sy+ri*(bH+g);
if(cell){const c=TASK_COLORS[cell]||'#71717a';svg+=`<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="4" fill="${c}22" stroke="${c}" stroke-width="1.5"/>`;svg+=`<text x="${x+bW/2}" y="${y+bH/2}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="${c}" font-family="JetBrains Mono,monospace">${cell}</text>`;}
else if(ri<s.grid.length-1||(ri===s.grid.length-1&&ci<(s.freqs.filter(([_,v])=>v===s.freqs[0][1]).length))){svg+=`<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="4" fill="transparent" stroke="#3f3f46" stroke-width="1" stroke-dasharray="4"/>`;svg+=`<text x="${x+bW/2}" y="${y+bH/2}" text-anchor="middle" dominant-baseline="central" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">idle</text>`;}});});}

document.getElementById('svg9').innerHTML=svg;
let lh='';for(let i=0;i<=stepIdx9;i++){lh+=`<div style="color:${steps9[i].color}">${i===stepIdx9?'▶ ':'  '}${steps9[i].msg}</div>`;}
document.getElementById('log9').innerHTML=lh;document.getElementById('log9').scrollTop=99999;
document.getElementById('expl9').innerHTML=s.explanation;document.getElementById('stepLabel9').textContent=`Step ${stepIdx9+1}/${steps9.length}`;
document.getElementById('prev9').disabled=stepIdx9<=0;document.getElementById('next9').disabled=stepIdx9>=steps9.length-1;}
function next9(){if(stepIdx9<steps9.length-1){stepIdx9++;render9();}}function prev9(){if(stepIdx9>0){stepIdx9--;render9();}}
function toggleAuto9(){if(autoInt9){clearInterval(autoInt9);autoInt9=null;document.getElementById('auto9').textContent='▶ Auto';}else{autoInt9=setInterval(()=>{if(stepIdx9>=steps9.length-1){toggleAuto9();return;}next9();},1500);document.getElementById('auto9').textContent='⏸ Pause';}}
function loadTc9(idx){stepIdx9=0;buildSteps9(TCS_9[idx].data);document.querySelectorAll('[data-tc9]').forEach((b,i)=>{b.className=i===idx?'viz9-btn active':'viz9-btn';});render9();}
const tcBar9=document.getElementById('tcBar9');TCS_9.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz9-btn active':'viz9-btn';b.setAttribute('data-tc9','');b.onclick=()=>loadTc9(i);tcBar9.appendChild(b);});
buildSteps9(TCS_9[0].data);stepIdx9=0;render9();
</script>
</div>

---

# Hand of Straights

**Difficulty:** Medium
**LeetCode:** https://leetcode.com/problems/hand-of-straights/
**YouTube:** https://www.youtube.com/watch?v=amnrMCVd2YI

## Description

Alice has `hand.length` cards. She wants to rearrange them into groups where each group contains `groupSize` consecutive cards. Return `true` if she can, `false` otherwise.

**Input:** `int[] hand`, `int groupSize`
**Output:** `boolean`

**Constraints:**
- 1 ≤ hand.length ≤ 10⁴
- 0 ≤ hand[i] ≤ 10⁹
- 1 ≤ groupSize ≤ hand.length

**Examples:**

Example 1:
```
Input: hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3
Output: true
Explanation: Groups: [1,2,3], [2,3,4], [6,7,8]
```

Example 2:
```
Input: hand = [1, 2, 3, 4, 5], groupSize = 4
Output: false
Explanation: 5 cards can't be evenly divided into groups of 4.
```

**Notable Edge Cases:**
- `hand.length % groupSize != 0`: immediately false
- groupSize = 1: always true (each card is its own group)
- All same values: false unless groupSize = 1

## In-depth Explanation

**Reframe:** Can we partition the multiset of numbers into groups of `groupSize` consecutive integers? Greedily: always start a group from the smallest available number.

**Pattern recognition:** This is a greedy + frequency counting problem. A TreeMap (or sorted map) efficiently finds the smallest key. A min-heap can also provide the minimum, but TreeMap is more natural here.

**Real-world analogy:** You're dealing cards into runs (like in Rummy). You always start a new run with the smallest card available. If at any point you can't complete a run, it's impossible.

**Why naive fails:** Trying all possible groupings is exponential.

**Approach roadmap:**
- Brute force: Try all permutations → exponential
- Optimal: Greedy with TreeMap → O(n log n)

**Interview cheat sheet:**
- Keywords: "consecutive", "groups", "rearrange into sequences"
- Quick check: if `n % groupSize != 0`, return false immediately
- The greedy: always start from the smallest, try to form a group of size `groupSize`
- Memory hook: "TreeMap, grab smallest, extend groupSize times, decrement counts."

## Optimal Intuition

Count frequencies using a TreeMap. While the map is non-empty: take the smallest key, try to form a group starting from it (key, key+1, ..., key+groupSize-1). For each number in the group, decrement its count. If any number is missing, return false. If count reaches 0, remove from map.

## Optimal Step-by-Step Solution

**Test case:** `hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3`
**Expected:** `true`

**Initial state:**
- hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3
- n = 9, 9 % 3 = 0 ✓ (possible)
- TreeMap: {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}

---

**Step 1: First group starting from smallest = 1**

Need: 1, 2, 3 (three consecutive starting from 1).
- 1: count 1 → 0, remove from map
- 2: count 2 → 1
- 3: count 2 → 1
Group formed: [1, 2, 3] ✓

Map: {2:1, 3:1, 4:1, 6:1, 7:1, 8:1}

---

**Step 2: Second group starting from smallest = 2**

Need: 2, 3, 4.
- 2: count 1 → 0, remove
- 3: count 1 → 0, remove
- 4: count 1 → 0, remove
Group formed: [2, 3, 4] ✓

Map: {6:1, 7:1, 8:1}

---

**Step 3: Third group starting from smallest = 6**

Need: 6, 7, 8.
- 6: count 1 → 0, remove
- 7: count 1 → 0, remove
- 8: count 1 → 0, remove
Group formed: [6, 7, 8] ✓

Map: {} (empty)

💡 KEY INSIGHT: The greedy approach works because starting from the smallest available number is optimal. If the smallest number can't start a valid group, then it can't be part of ANY group (there's nothing smaller to pair with it). So failing early is correct.

All cards assigned. Return **true** ✓

---

**Failing case:** `hand = [1, 2, 3, 4, 5], groupSize = 4`
- 5 % 4 ≠ 0 → return false immediately. 5 cards can't form groups of 4.

**Another failing case:** `hand = [1, 2, 4, 5, 6], groupSize = 3`
- Map: {1:1, 2:1, 4:1, 5:1, 6:1}
- Group 1: start at 1, need 1, 2, 3. But 3 doesn't exist → return false!

---

**Why does this work?** The greedy strategy is correct because the smallest element MUST be the start of some group (no smaller element exists to include it mid-group). If it can't start a group, the partition is impossible. This extends inductively: after removing the first group, the new smallest must start another group, and so on.

**The Key Invariant:** "After forming k groups, the remaining elements in the TreeMap can still be partitioned into valid groups if and only if the overall answer is true."

**Beginner Mistakes:**
1. **Not checking `n % groupSize != 0` first:** This is an instant false.
2. **Not using a sorted structure:** An unsorted HashMap can work but requires manually finding the minimum each time (O(n) per group vs O(log n) with TreeMap).
3. **Decrementing but not removing zero-count keys:** If you don't remove keys with count 0, the TreeMap's `firstKey()` might return an exhausted value, breaking the logic.

**30-second pitch:** "TreeMap of frequencies. While non-empty: start group at smallest key, need groupSize consecutive values. Decrement counts, remove zeros. If any value missing, return false. O(n log n)."

## Optimal In-depth Intuition

The TreeMap provides two critical operations in O(log n): finding the minimum key and looking up/updating counts. The greedy works because consecutive groups starting from the minimum are the ONLY valid placement for that minimum element. There's a formal proof: if the min element `m` could be in the middle of some group `[m-i, ..., m, ..., m-i+groupSize-1]`, then `m-i < m` would be in the map, contradicting `m` being the minimum.

## Optimal Algorithm

```
function isHandOfStraights(hand, groupSize):
    if hand.length % groupSize != 0: return false
    
    treeMap = count frequencies (sorted by key)
    
    while treeMap is not empty:
        start = treeMap.firstKey()     // Smallest available card
        for i = start to start + groupSize - 1:
            if i not in treeMap: return false
            treeMap[i]--
            if treeMap[i] == 0: remove i from treeMap
    
    return true
```

## Optimal Code

```java
class Solution {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (hand.length % groupSize != 0) return false;
        
        TreeMap<Integer, Integer> map = new TreeMap<>();
        for (int card : hand) {
            map.merge(card, 1, Integer::sum);
        }
        
        while (!map.isEmpty()) {
            int start = map.firstKey();
            for (int i = start; i < start + groupSize; i++) {
                if (!map.containsKey(i)) return false;
                int count = map.get(i);
                if (count == 1) {
                    map.remove(i);
                } else {
                    map.put(i, count - 1);
                }
            }
        }
        
        return true;
    }
}
```

## Optimal Complexity

**Time:** O(n log n) — Building the TreeMap is O(n log n). Each card is processed once (added and removed from map), with each operation O(log n). Total: O(n log n).

**Space:** O(n) — The TreeMap stores up to n distinct values.

## Optimal Hints

1. Quick check: can n be evenly divided by groupSize?
2. The smallest card MUST start a group. Why?
3. From the smallest, try to form groupSize consecutive cards.
4. A TreeMap gives you sorted order with O(log n) operations.
5. Decrement counts. Remove entries when count hits 0.
6. If any needed card is missing, return false immediately.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz10-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}@media(max-width:700px){.viz10-grid{grid-template-columns:1fr}}
.viz10-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz10-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz10-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz10-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer}
.viz10-btn:disabled{opacity:0.3}
.viz10-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBar10"></div>
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="viz10-btn" id="prev10" onclick="prev10()">← Prev</button>
  <button class="viz10-btn" id="next10" onclick="next10()">Next →</button>
  <button class="viz10-btn" id="auto10" onclick="toggleAuto10()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabel10">Ready</span>
</div>
<div class="viz10-grid">
  <div>
    <div class="viz10-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Card Frequencies + Groups</div>
      <svg id="svg10" width="100%" viewBox="0 0 460 280"></svg>
    </div>
  </div>
  <div>
    <div class="viz10-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz10-log" id="log10"></div>
    </div>
    <div class="viz10-expl" id="expl10"></div>
  </div>
</div>
<script>
const TCS_10=[
    {name:"Valid",data:{hand:[1,2,3,6,2,3,4,7,8],gs:3}},
    {name:"Invalid (size)",data:{hand:[1,2,3,4,5],gs:4}},
    {name:"Invalid (gap)",data:{hand:[1,2,4,5,6,7],gs:3}}
];
let steps10=[],stepIdx10=-1,autoInt10=null;
function buildSteps10(tc){steps10=[];const hand=tc.hand,gs=tc.gs;
if(hand.length%gs!==0){steps10.push({msg:`n=${hand.length} % gs=${gs} = ${hand.length%gs} ≠ 0 → FALSE`,color:'#ef4444',map:{},groups:[],hl:{},explanation:`${hand.length} cards cannot be evenly divided into groups of ${gs}. Impossible.`});return;}
const map=new Map();hand.forEach(c=>{map.set(c,(map.get(c)||0)+1);});const sorted=[...map.keys()].sort((a,b)=>a-b);
function mapToObj(){const o={};sorted.forEach(k=>{if(map.has(k))o[k]=map.get(k);});return o;}
const groups=[];
steps10.push({msg:`Map: {${sorted.map(k=>`${k}:${map.get(k)}`).join(', ')}}`,color:'#4f8ff7',map:mapToObj(),groups:[],hl:{},explanation:`Frequency map built. We'll greedily form groups of ${gs} consecutive cards starting from the smallest.`});

while(true){let start=null;for(const k of sorted){if(map.has(k)){start=k;break;}}
if(start===null)break;
const group=[];let failed=false;const hl={};
for(let i=start;i<start+gs;i++){if(!map.has(i)){steps10.push({msg:`Need ${i} but not available → FALSE`,color:'#ef4444',map:mapToObj(),groups:[...groups],hl:{[i]:'#ef4444'},explanation:`Trying to form group starting at ${start}. Need ${i} but it's not in the map. Cannot form this group. Return false.`});return;}
hl[i]='#34d399';group.push(i);const c=map.get(i);if(c===1)map.delete(i);else map.set(i,c-1);}
groups.push(group);
steps10.push({msg:`Group: [${group.join(', ')}]. Map: {${sorted.filter(k=>map.has(k)).map(k=>`${k}:${map.get(k)}`).join(', ')}}`,color:'#34d399',map:mapToObj(),groups:[...groups],hl,explanation:`Formed group [${group.join(', ')}]. Decremented counts. ${map.size===0?'Map empty — all cards assigned!':'Continue with next smallest.'}`});}
steps10.push({msg:`All groups formed → TRUE`,color:'#34d399',map:{},groups:[...groups],hl:{},explanation:`All ${groups.length} groups of ${gs} consecutive cards formed successfully. Return true.`});}

const GRP_COLORS=['#4f8ff7','#34d399','#f59e0b','#a78bfa','#f472b6'];
function render10(){const s=steps10[stepIdx10];if(!s)return;let svg='';
// Frequency bars
const keys=Object.keys(s.map).map(Number).sort((a,b)=>a-b);
svg+=`<text x="5" y="15" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">REMAINING CARDS</text>`;
const barW=40,barG=8,barSx=10,barSy=25,barMaxH=80;
const maxVal=Math.max(...Object.values(s.map),1);
keys.forEach((k,i)=>{const x=barSx+i*(barW+barG);const v=s.map[k];const h=Math.max(v/maxVal*barMaxH,5);const c=s.hl[k]||'#4f8ff7';
svg+=`<rect x="${x}" y="${barSy+barMaxH-h}" width="${barW}" height="${h}" rx="4" fill="${c}33" stroke="${c}" stroke-width="1.5"/>`;
svg+=`<text x="${x+barW/2}" y="${barSy+barMaxH-h-6}" text-anchor="middle" font-size="10" fill="${c}" font-family="JetBrains Mono,monospace">${v}</text>`;
svg+=`<text x="${x+barW/2}" y="${barSy+barMaxH+14}" text-anchor="middle" font-size="11" font-weight="600" fill="#a1a1aa" font-family="JetBrains Mono,monospace">${k}</text>`;});

// Groups formed
svg+=`<text x="5" y="150" font-size="9" fill="#52525b" font-weight="600" font-family="system-ui">GROUPS FORMED</text>`;
s.groups.forEach((g,gi)=>{const y=160+gi*30;const c=GRP_COLORS[gi%GRP_COLORS.length];
svg+=`<text x="5" y="${y+14}" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">G${gi+1}:</text>`;
g.forEach((v,vi)=>{const x=30+vi*42;svg+=`<rect x="${x}" y="${y}" width="34" height="22" rx="4" fill="${c}22" stroke="${c}" stroke-width="1"/>`;svg+=`<text x="${x+17}" y="${y+12}" text-anchor="middle" dominant-baseline="central" font-size="11" font-weight="600" fill="${c}" font-family="JetBrains Mono,monospace">${v}</text>`;});});

document.getElementById('svg10').innerHTML=svg;
let lh='';for(let i=0;i<=stepIdx10;i++){lh+=`<div style="color:${steps10[i].color}">${i===stepIdx10?'▶ ':'  '}${steps10[i].msg}</div>`;}
document.getElementById('log10').innerHTML=lh;document.getElementById('log10').scrollTop=99999;
document.getElementById('expl10').innerHTML=s.explanation;document.getElementById('stepLabel10').textContent=`Step ${stepIdx10+1}/${steps10.length}`;
document.getElementById('prev10').disabled=stepIdx10<=0;document.getElementById('next10').disabled=stepIdx10>=steps10.length-1;}
function next10(){if(stepIdx10<steps10.length-1){stepIdx10++;render10();}}function prev10(){if(stepIdx10>0){stepIdx10--;render10();}}
function toggleAuto10(){if(autoInt10){clearInterval(autoInt10);autoInt10=null;document.getElementById('auto10').textContent='▶ Auto';}else{autoInt10=setInterval(()=>{if(stepIdx10>=steps10.length-1){toggleAuto10();return;}next10();},1500);document.getElementById('auto10').textContent='⏸ Pause';}}
function loadTc10(idx){stepIdx10=0;buildSteps10(TCS_10[idx].data);document.querySelectorAll('[data-tc10]').forEach((b,i)=>{b.className=i===idx?'viz10-btn active':'viz10-btn';});render10();}
const tcBar10=document.getElementById('tcBar10');TCS_10.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz10-btn active':'viz10-btn';b.setAttribute('data-tc10','');b.onclick=()=>loadTc10(i);tcBar10.appendChild(b);});
buildSteps10(TCS_10[0].data);stepIdx10=0;render10();
</script>
</div>
