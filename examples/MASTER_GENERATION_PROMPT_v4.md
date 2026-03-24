# DSA Studio — Master Problem Generation Prompt v4

---

## HOW TO USE

1. Copy the entire prompt between the ═══ lines
2. Replace `[SUBTOPIC]` and the problem list
3. Paste into Claude / ChatGPT / any AI
4. If it's too long, tell it to split: "Give me File 1 (problems 1-3). I'll ask for File 2 next."
5. Upload the .md file into DSA Studio

---

═══════════════════════════════════════════════════════════════════

You are generating a comprehensive DSA study file in markdown format for the subtopic **[SUBTOPIC]** containing these problems:

1. [Problem 1] — [Difficulty] — [LeetCode link] — [YouTube: Striver/takeUforward preferred]
2. [Problem 2] — [Difficulty] — [LeetCode link] — [YouTube: Striver/takeUforward preferred]
... (list all)

**YOUTUBE LINK PRIORITY:** For every problem, search in this order:
1. **Striver (takeUforward)** — https://youtube.com/@takeUforward — THE first choice
2. **NeetCode** — https://youtube.com/@NeetCode 
3. **Abdul Bari** — for theory/foundations
4. **Tushar Roy** — for DP problems
5. Any other high-quality channel with >100K views on that specific video

**SIZE RULE:** If total exceeds ~15,000 words, split into multiple files. Each file is self-contained. Separate problems within a file with `---` on its own line.

---

## ABSOLUTE RULES — READ BEFORE ANYTHING ELSE

**RULE 1 — VISUALIZATION HTML MUST NOT BE IN CODE FENCES.**
The `## [Approach] Visualization` section contains raw HTML that will be rendered in an iframe. Do NOT wrap it in triple backticks (```). Write the `<div>`, `<style>`, `<script>` tags directly in the markdown. If you put them inside a code fence, they render as plain text and the entire visualization is broken. This is the #1 most common mistake.

Correct:
```
## Brute Force Visualization

<div style="font-family:system-ui,sans-serif">
<style>...</style>
<script>...</script>
</div>
```

WRONG (broken):
```
## Brute Force Visualization

` ` `html
<div>...</div>
` ` `
```

**RULE 2 — EVERY VISUALIZATION MUST USE SVG FOR DIAGRAMS.**
Do NOT render data structures using `<div>` elements with margin/padding. Use `<svg>` with `<circle>`, `<rect>`, `<line>`, `<text>`, and `<path>`. Text-based rendering (├─ └─ with margin-left) is NOT acceptable. The visualization must look like a professional diagram, not a terminal output.

**RULE 3 — UNIQUE IDS FOR EACH PROBLEM'S VISUALIZATION.**
In a multi-problem file, every element ID must be unique. Suffix with the problem number: `id="svg1"`, `id="log1"`, `id="state1"` for problem 1, `id="svg2"`, `id="log2"` for problem 2, etc. Same for function names: `render1()`, `next1()`, `buildSteps1()`. If IDs collide, only one visualization works.

**RULE 4 — STEP-BY-STEP MUST TEACH A BEGINNER, NOT SUMMARIZE FOR AN EXPERT.**
Not "Step 1: Initialize. Step 2: Loop. Step 3: Return." Imagine you are sitting next to a first-year CS student who has never seen this algorithm. Each step must show: which code line is executing, what variables change, the before/after state of ALL data structures, WHY this step happens (not just WHAT), and a concrete example value at every point. Use a real test case and trace through every single iteration — never skip iterations with "and so on." Minimum 1000 words per step-by-step section.

**RULE 5 — EVERY APPROACH GETS EQUAL DEPTH.**
Brute force gets the same depth as optimal. Do NOT write 3 lines for brute and 30 for optimal. Each approach independently has ALL 10 sections at full depth.

**RULE 6 — DEPTH ENFORCEMENT. READ THIS CAREFULLY.**
AIs tend to produce shallow content that summarizes instead of explains. Here are the MINIMUM word counts per section. If a section is shorter than the minimum, it is REJECTED:

| Section | Minimum Words | What "too shallow" looks like |
|---------|--------------|-------------------------------|
| Intuition | 150 | "Use a heap to track K elements. Poll when size > K." |
| Step-by-Step | 1000 | "Step 1: Init. Step 2: Loop. Step 3: Return." |
| In-depth Intuition | 500 | "The math is that heap gives O(log n) operations." |
| In-depth Explanation | 400 | "This is a heap problem. Use PriorityQueue." |
| Algorithm | 150 | Just pseudocode with no explanation after it |

**The test:** After writing each section, re-read it and ask: "Would a student who has NEVER seen this algorithm understand WHY every step happens?" If the answer is no, it's too shallow. Add more WHY, more analogies, more concrete values, more "what would happen if we didn't do this?"

---

## STRUCTURE FOR EVERY PROBLEM

```
# [Problem Name]

**Difficulty:** Easy/Medium/Hard
**LeetCode:** [full URL]
**GFG:** [full URL if exists]
**YouTube:** [full URL — Priority: Striver (takeUforward) > NeetCode > Abdul Bari > other channels. Search "problem name striver" first. If not available, use NeetCode. Include the BEST explanation video, not just any video.]
```

---

### SECTION 1: ## Description

**MINIMUM 200 WORDS.** Include ALL of the following:

- **Plain English explanation** — What the problem asks, as if explaining to someone who has never seen it. No jargon. Example: "Given a list of numbers and a target number, find TWO numbers from the list that add up to the target, and return their positions (starting from 0)."
- **Input/output format** — Exact types: "Input: an integer array `nums` of length `n` (1 ≤ n ≤ 10^5) and an integer `target`"
- **ALL constraints with ranges** — Every constraint matters for choosing the approach. "1 ≤ n ≤ 10^5 means O(n²) will TLE. Values are -10^9 to 10^9 means we need long or careful int handling."
- **3 examples** (not 2):
  - Example 1: The "happy path" that shows normal behavior
  - Example 2: A case that reveals a tricky aspect (duplicates, negatives, boundary)
  - Example 3: The smallest possible valid input (edge case)
  - For EACH example: Input → Output → **WHY** that's the answer (trace through the logic in 2-3 sentences)
- **Edge cases worth noting** — At least 3: empty input, single element, all same values, maximum size, negative values, etc.

---

### SECTION 2: ## In-depth Explanation

**MINIMUM 400 WORDS. This is the "how to think about this problem in an interview" section.**

- **Reframe (50+ words):** What is this REALLY asking? Strip the story completely. Example: "This problem says 'find the minimum cost to connect all cities.' Strip the story: we have N nodes and weighted edges. We need to find a subset of edges that connects all nodes with minimum total weight. That's literally the definition of a Minimum Spanning Tree."

- **Pattern recognition (80+ words):** What DSA pattern is this? What SPECIFIC keywords in the problem statement hint at it? Be explicit: "The phrase 'maximum subarray' is a dead giveaway for Kadane's algorithm. The constraint 'contiguous subarray' rules out sorting. The fact that values can be negative means we can't just take all positive elements." List at least 3 keywords/clues.

- **Real-world analogy (50+ words):** Make the concept click with a SPECIFIC familiar comparison. Not "it's like searching." More like "Imagine you're looking for a word in a physical dictionary. You don't read every page — you open to the middle, check if your word comes before or after, then repeat in the right half. That's exactly binary search."

- **Why naive fails (80+ words):** What most people try first, what's its time complexity, and a SPECIFIC test case where it's too slow. Example: "The brute force checks all pairs → O(n²). With n = 10^5, that's 10^10 operations — about 100 seconds at 10^8 ops/sec. The time limit is usually 1-2 seconds, so we need at least O(n log n)."

- **Approach roadmap:** Brute → Better → Optimal, one sentence each with the KEY difference between them

- **Interview cheat sheet (100+ words):**
  - Keywords that signal this pattern (list at least 5)
  - What makes this different from the 2-3 most similar problems
  - The "aha moment" insight — the ONE thing that makes the solution click
  - 1-sentence memory hook that's memorable and specific

---

### SECTION 3: ## [Approach] Intuition

**MINIMUM 150 WORDS.** Not a 2-sentence summary. This should be a clear, complete explanation that someone could read and understand the approach WITHOUT reading any other section. Include:

- **The core idea** in 2-3 sentences (the elevator pitch)
- **WHY this works** — what property of the problem makes this approach valid? (e.g., "Because the array is sorted, any element to the left of mid must be smaller, so we can safely discard half")
- **The key data structure/technique** and WHY it was chosen over alternatives (e.g., "We use a HashMap instead of nested loops because it lets us check 'does the complement exist?' in O(1) instead of O(n)")
- **A concrete mini-example** — show the approach working on a 3-4 element input in 2-3 sentences. Not a full trace, just enough to see the pattern.
- **One sentence connecting to similar problems** — "This is the same pattern as [other problem] because..."

---

### SECTION 4: ## [Approach] Step-by-Step Solution

**THIS IS THE MOST CRITICAL LEARNING SECTION. 1000+ WORDS MINIMUM.**

You are explaining this to someone who has NEVER seen this algorithm before. They know basic programming (loops, arrays, functions) but nothing about this specific technique. Your job is to make them say "oh, THAT's why we do that!" at every step.

**BEFORE THE WALKTHROUGH — Set the scene:**
- State the exact test case you'll trace: `Input: nums = [2, 7, 11, 15], target = 9`
- Show what the correct output is and WHY: `Output: [0, 1] because nums[0] + nums[1] = 2 + 7 = 9`
- Draw the initial state of ALL data structures in text: `Array: [2, 7, 11, 15], HashMap: {} (empty), target = 9`

**FORMAT — for every step:**
```
**Step N: [what happens in plain English]**

Code executing: `exact line of code being run`

**Where are we?** We are at index/position [X] in [data structure]. Think of it like [real-world analogy].

**What do we see right now?**
- variable1 = value (was previousValue)
- variable2 = value
- dataStructure = [show FULL contents, not abbreviated]

**The Decision:** We check `[condition]`. Let's evaluate: [plug in actual values]. 
Is [value] [operator] [value]? → [YES/NO].

**Why this matters (the intuition):** [Explain WHY we check this condition. What would go wrong if we didn't? What are we trying to avoid or achieve? Connect it to the big picture of the algorithm.]

**The Action:** Because the condition was [true/false], we [do specific action].
This changes [variable] from [old value] → [new value].

**Analogy:** Think of this like [everyday analogy that makes the logic click]. For example, [concrete comparison].

**State AFTER this step:**
- variable1 = newValue ← CHANGED
- variable2 = value (unchanged)
- result so far = [partial result]
- [data structure visual]:
  Array:   [2, 7, 11, 15]
              ^
              i=1
  HashMap: {2: 0, 7: 1}
```

**CRITICAL RULES FOR STEPS:**
1. **NEVER skip iterations.** If the loop runs 5 times, show all 5 iterations. Don't write "Steps 3-4 are similar" or "this continues until..." — show every single one.
2. **ALWAYS show the FULL data structure** at each step, not just the changed part. If the array has 8 elements, show all 8 with an arrow pointing to the current position.
3. **ALWAYS explain WHY before WHAT.** Before saying "we move left pointer right", explain "because the current sum (4) is less than target (9), and since the array is sorted, the only way to increase the sum is to make the left value bigger."
4. **USE REAL VALUES, not variable names.** Don't write "arr[left] + arr[right]". Write "arr[0] + arr[4] = 2 + 15 = 17".
5. **HIGHLIGHT the "aha" moment.** When the algorithm finds the answer, makes a key decision, or does something non-obvious, add a callout: `💡 KEY INSIGHT: This is the moment where...`
6. **SHOW WRONG PATHS TOO.** If the algorithm checks a condition and it fails, explain what WOULD have happened if it succeeded, so the reader understands the branching.

**AFTER THE WALKTHROUGH — include ALL of these:**

- **Why does this work? (Correctness proof for beginners):** Don't say "by induction." Say "Notice that every time we [do X], we guarantee that [property Y] is maintained. So by the time we finish, [conclusion]. Think of it like: if you check every locker in a hallway from left to right, you're guaranteed to find the one with your stuff — you can't miss it."

- **The Key Invariant (in plain English):** What property is ALWAYS true at the start of every loop iteration? State it as a simple English sentence, not math. Example: "At any point, every element to the LEFT of our pointer has already been processed and won't be needed again."

- **Beginner Mistakes (at least 3):**
  1. [Specific mistake] — "Many beginners write `i <= n` instead of `i < n`, which causes [specific bad thing] because [reason]."
  2. [Specific mistake] — "A common error is forgetting to [action], which leads to [wrong result] on test case [example]."
  3. [Specific mistake] — "Watch out for [edge case]. When [condition], the algorithm should [correct behavior], but beginners often [wrong behavior]."

- **What if the interviewer asks "Why not just...":** Anticipate the 2 most common alternative suggestions and explain why they don't work or are slower.

- **30-second interview pitch:** "This problem asks us to [reframe]. The key insight is [one sentence]. We use [data structure/technique] because [reason]. Time: O(X), Space: O(Y)."

**BAD example (too shallow — DO NOT do this):**
```
Step 1: Insert "apple" into the trie. Traverse nodes.
Step 2: Search for "apple". Found it. Return true.
```

**BAD example (skips iterations):**
```
Step 1: Check index 0. Not the answer.
Step 2: Check index 1. Not the answer.
Steps 3-7: Similar checks...
Step 8: Found the answer at index 8.
```

**GOOD example (correct depth — THIS is what every step should look like):**
```
**Step 1: Insert "apple" — processing character 'a' (index 0)**

Code executing: `if (node.children[ch - 'a'] == null) node.children[ch - 'a'] = new TrieNode();`

**Where are we?** We're at the ROOT node of our Trie. The root is like the entrance to a building — it doesn't represent any character itself, it's just the starting point. All words begin their journey from here.

**What do we see right now?**
- word = "apple" (5 characters to process)
- current character = 'a' (index 0 of "apple")
- node = ROOT (has 26 child slots, ALL currently null)
- index = ch - 'a' = 'a' - 'a' = 0

**The Decision:** We check `node.children[0] == null`. Since we just created this Trie, the root has no children yet. So yes, children[0] is null.

**Why this matters:** We're about to walk down a path that spells "apple". But the path doesn't exist yet! It's like trying to walk down a hallway that hasn't been built. So before we can walk to the 'a' room, we need to BUILD it.

💡 KEY INSIGHT: This is the magic of Tries — we build the path as we insert. Later words that START with 'a' (like "app", "axe", "ant") will reuse this same 'a' node instead of creating a new one. This is how Tries share prefixes.

**The Action:** We create a new TrieNode: `root.children[0] = new TrieNode()`. Then we move our pointer down: `node = root.children[0]`.

**Analogy:** Imagine you're creating a filing system. You open the cabinet (root), look for the 'A' folder — it doesn't exist yet, so you create one. Now you open the 'A' folder and you'll look for the 'P' subfolder next.

**State AFTER step 1:**
- node = the 'a' node (depth 1) ← MOVED from root
- path so far: root → a
- characters remaining: ['p', 'p', 'l', 'e']
- nodes created this step: 1
- total nodes created: 1
- endCount at current node: 0 (we're mid-word, not done yet)
```

---

### SECTION 5: ## [Approach] In-depth Intuition

**MINIMUM 500 WORDS. This is NOT a summary — it's a deep dive that makes the reader truly UNDERSTAND.**

The previous sections told the reader WHAT to do. This section explains WHY it works at a deeper level. Think of this as the "office hours" explanation — the student already saw the lecture (Step-by-Step), now they want to understand the underlying theory.

**MUST INCLUDE ALL of these subsections:**

**1. Why this data structure / technique? (100+ words)**
- What alternatives exist? (e.g., "We could use a sorted array, a BST, or a heap")
- Why is THIS one the best fit? (e.g., "A heap gives O(log n) insert and O(1) access to min/max, while a sorted array would need O(n) insert. Since we insert n elements, heap gives O(n log n) total vs O(n²)")
- What specific OPERATION does this data structure optimize that the problem needs?

**2. The mathematical / logical proof (150+ words)**
- Don't just say "it works." Explain WHY it's correct.
- Use a concrete example to prove it: "Suppose the optimal answer includes element X. Then [argument]. But our algorithm would have picked X at step [N] because [condition]. Therefore our algorithm finds the optimal answer."
- For greedy: prove the greedy choice property. For DP: show optimal substructure. For graphs: explain why the traversal order guarantees correctness.
- Use "proof by contradiction" thinking: "What if our algorithm missed the optimal answer? Then [something impossible] would have to be true, which contradicts [property]."

**3. What property of the input are we exploiting? (100+ words)**
- Every efficient algorithm exploits some structure in the input. Name it explicitly.
- Examples: "sorted order lets us binary search", "the constraint that values are 1..n lets us use array indices", "the tree structure means each node has exactly one parent", "the string has only 26 lowercase letters so our array is bounded"
- What happens if this property is removed? (e.g., "If the array wasn't sorted, two pointers wouldn't work because we couldn't guarantee which direction to move")

**4. Connection to other problems (50+ words)**
- Name 2-3 specific LeetCode/GFG problems that use the same core technique
- Explain what makes THIS problem different from those (e.g., "Unlike regular Two Sum, this version has a sorted input which lets us avoid the HashMap and use two pointers instead")

**5. What breaks if we change constraints? (100+ words)**
- "If the array could have duplicates, we'd need to [modification]"
- "If the values could be negative, our assumption that [X] breaks because [reason]"
- "If n went from 10^5 to 10^9, this approach would TLE because [reason], and we'd need [different approach]"
- "If this were a directed graph instead of undirected, [specific thing] would change"

**BAD example (what AIs typically produce — DO NOT do this):**
```
The mathematical insight is that we use the heap property to maintain the 
top K elements. This works because the heap gives us O(log n) operations.
When the heap size exceeds K, we remove the smallest element.
```
(This is 3 sentences. It says WHAT but not WHY. No proof, no alternatives, no connections.)

**GOOD example (the depth we need):**
```
**Why a Min-Heap of size K?**

We need the K-th largest element, which means we need to know: "what is 
the smallest among the K biggest values?" That's literally what a min-heap 
of size K gives us — the root is always the smallest of whatever we've 
stored, and if we only store K items, the root is the K-th largest overall.

Why not a max-heap? A max-heap gives us the LARGEST element, not the K-th 
largest. We'd have to pop K times to get the K-th largest, which is O(K log n) 
per query. With our min-heap approach, we just read the root — O(1).

Why not sort? Sorting gives O(n log n) and works for a single query, but 
if the data is streaming (elements arrive one at a time), we'd need to 
re-sort each time. The heap handles streaming naturally: insert new element, 
remove root if size > K, done.

**Proof of correctness:**
Invariant: After processing the first i elements, the heap contains the K 
largest of those i elements, and the root is the K-th largest.

Base case: After K elements, the heap contains all K, so the root is trivially 
the K-th largest (it's the smallest of K elements).

Inductive step: Suppose the invariant holds after i elements. When element (i+1) 
arrives:
- If arr[i+1] > heap.root: arr[i+1] belongs in the top K (it's bigger than the 
  current K-th largest). We add it and remove the old root. The new root is the 
  new K-th largest. ✓
- If arr[i+1] <= heap.root: arr[i+1] is NOT in the top K (it's smaller than or 
  equal to the current K-th largest). We ignore it. The heap is unchanged. ✓

In both cases, the invariant is maintained. After all n elements, the root is 
the K-th largest of the entire array. □

**What property are we exploiting?**
We exploit the fact that we only need ONE specific rank (the K-th), not the 
full sorted order. This means we can discard information — we don't care about 
the relative order of the top K-1 elements or the bottom N-K elements. A heap 
captures exactly the right amount of information.

**Connection to other problems:**
- "Top K Frequent Elements" (LC 347) — same min-heap-of-size-K pattern, but 
  heapify by frequency instead of value
- "Find Median from Data Stream" (LC 295) — uses TWO heaps (max-heap + min-heap) 
  to track the middle element instead of the K-th

**What breaks with different constraints?**
- If K could be up to N: The heap approach is O(N log K). When K ≈ N, this is 
  O(N log N) — no better than sorting. QuickSelect (O(N) average) would be better.
- If the array had duplicates and we wanted the K-th DISTINCT largest: We'd need 
  a Set alongside the heap to skip duplicates.
```

---

### SECTION 6: ## [Approach] Algorithm

**Pseudocode with 4-space indentation PLUS a paragraph explanation after EACH block.**

The pseudocode alone is NOT enough. After the code block, write 3-5 paragraphs explaining:
1. **Initialization block** — What each variable represents and WHY it's initialized to that value (e.g., "We set `left = 0` because we start searching from the beginning. We set `right = n-1` (not `n`) because array indices are 0-based, so the last valid index is n-1.")
2. **Main loop** — What the loop invariant is, when does the loop terminate, and WHY that termination condition is correct
3. **Key decision inside the loop** — The most important if/else branch. Explain BOTH paths: what happens when the condition is true AND what happens when it's false.
4. **Return value** — What exactly is being returned and WHY it's the correct answer. What does it represent?

---

### SECTION 7: ## [Approach] Code

```java
// Compilable Java code with 4-space indentation
// Comments on non-obvious lines
// LeetCode's exact function signature
```

---

### SECTION 8: ## [Approach] Complexity

Time: O(...) — explain WHY (which loop contributes what)
Space: O(...) — explain what's stored

---

### SECTION 9: ## [Approach] Hints

4-6 progressive hints from gentle nudge to near-answer.

---

### SECTION 10: ## [Approach] Visualization

**THIS IS THE MOST IMPORTANT SECTION. READ EVERY RULE.**

Generate raw HTML (NOT inside code fences) with `<style>` and `<script>` that creates an interactive visualization.

#### CRITICAL RENDERING RULES

**Use SVG for ALL data structure rendering. Here are the EXACT patterns:**

**Arrays:**
```javascript
// Render array as horizontal SVG boxes
function drawArray(svgEl, arr, highlights, labels) {
    const boxW = 48, boxH = 40, gap = 4, startX = 20, startY = 30;
    let svg = '';
    // Index labels on top
    arr.forEach((val, i) => {
        const x = startX + i * (boxW + gap);
        svg += `<text x="${x + boxW/2}" y="${startY - 8}" text-anchor="middle" 
                  font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
    });
    // Boxes with values
    arr.forEach((val, i) => {
        const x = startX + i * (boxW + gap);
        const color = highlights[i] || '#2a2a33';
        const textColor = highlights[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6" 
                  fill="${color}" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svg += `<text x="${x + boxW/2}" y="${startY + boxH/2 + 1}" text-anchor="middle" 
                  dominant-baseline="central" font-size="14" font-weight="600" 
                  fill="${textColor}" font-family="JetBrains Mono,monospace">${val}</text>`;
    });
    // Pointer labels below (e.g., "left", "right", "mid")
    if (labels) {
        Object.entries(labels).forEach(([idx, label]) => {
            const x = startX + parseInt(idx) * (boxW + gap);
            svg += `<text x="${x + boxW/2}" y="${startY + boxH + 16}" text-anchor="middle" 
                      font-size="10" font-weight="600" fill="#4f8ff7" 
                      font-family="JetBrains Mono,monospace">${label}</text>`;
        });
    }
    svgEl.innerHTML = svg;
}
```

**Graphs (nodes + edges):**
```javascript
function drawGraph(svgEl, nodes, edges, nodeColors, edgeColors) {
    let svg = '';
    // Edges first (behind nodes)
    edges.forEach(([u, v], i) => {
        const n1 = nodes[u], n2 = nodes[v];
        const color = edgeColors[i] || '#2a2a33';
        const sw = edgeColors[i] ? 2.5 : 1.5;
        svg += `<line x1="${n1.x}" y1="${n1.y}" x2="${n2.x}" y2="${n2.y}" 
                  stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
    });
    // Nodes on top
    nodes.forEach((n, i) => {
        const fill = nodeColors[i]?.fill || '#1a1a20';
        const stroke = nodeColors[i]?.stroke || '#3f3f46';
        const textColor = nodeColors[i]?.text || '#a1a1aa';
        const r = nodeColors[i]?.r || 20;
        svg += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}" 
                  stroke="${stroke}" stroke-width="2"/>`;
        svg += `<text x="${n.x}" y="${n.y}" text-anchor="middle" dominant-baseline="central" 
                  font-size="13" font-weight="700" fill="${textColor}" 
                  font-family="JetBrains Mono,monospace">${n.label || i}</text>`;
        // Show extra info below node (like disc/low values)
        if (n.sub) {
            svg += `<text x="${n.x}" y="${n.y + 14}" text-anchor="middle" font-size="9" 
                      fill="${textColor}" opacity="0.7" 
                      font-family="JetBrains Mono,monospace">${n.sub}</text>`;
        }
    });
    svgEl.innerHTML = svg;
}
```

**Trees (with proper layout):**
```javascript
function drawTree(svgEl, treeNodes, highlights) {
    // treeNodes: [{label, children:[], x, y, data:{}}]
    // First pass: compute positions with level-order, spacing
    // Then draw edges (parent to each child), then draw nodes
    let svg = '';
    function drawEdges(node) {
        (node.children || []).forEach(child => {
            svg += `<line x1="${node.x}" y1="${node.y + 16}" x2="${child.x}" y2="${child.y - 16}" 
                      stroke="#3f3f46" stroke-width="1.5" stroke-linecap="round"/>`;
            drawEdges(child);
        });
    }
    function drawNodes(node) {
        const hl = highlights?.includes(node.id);
        const fill = hl ? 'rgba(79,143,247,0.15)' : '#1a1a20';
        const stroke = hl ? '#4f8ff7' : '#3f3f46';
        const textC = hl ? '#93c5fd' : '#a1a1aa';
        svg += `<circle cx="${node.x}" cy="${node.y}" r="16" fill="${fill}" 
                  stroke="${stroke}" stroke-width="1.5"/>`;
        svg += `<text x="${node.x}" y="${node.y}" text-anchor="middle" dominant-baseline="central" 
                  font-size="12" font-weight="600" fill="${textC}" 
                  font-family="JetBrains Mono,monospace">${node.label}</text>`;
        (node.children || []).forEach(child => drawNodes(child));
    }
    drawEdges(treeNodes); drawNodes(treeNodes);
    svgEl.innerHTML = svg;
}
```

#### VARIABLE STATE PANEL — MANDATORY FORMAT

Show ALL variables as a table. Highlight changes in amber. This is what makes the visualization educational:

```javascript
function renderState(stateEl, vars, changes) {
    // vars: {name: value, ...}
    // changes: Set of variable names that changed this step
    let html = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(vars).forEach(([name, value]) => {
        const changed = changes.has(name);
        const bg = changed ? 'rgba(251,191,36,0.1)' : 'transparent';
        const nameColor = changed ? '#fbbf24' : '#52525b';
        const valColor = changed ? '#fbbf24' : '#b8b8be';
        html += `<tr style="background:${bg}">
            <td style="padding:4px 10px;color:${nameColor};font-weight:600;width:40%">${name}</td>
            <td style="padding:4px 10px;color:${valColor}">${
                Array.isArray(value) ? '[' + value.map((v,i) => 
                    changes.has(name+'['+i+']') ? `<span style="color:#fbbf24;font-weight:700">${v}</span>` : v
                ).join(', ') + ']' : value
            }${changed ? ' ← changed' : ''}</td>
        </tr>`;
    });
    html += '</table>';
    stateEl.innerHTML = html;
}
```

#### CODE HIGHLIGHT PANEL

```javascript
const CODE_LINES = [
    "disc[u] = low[u] = timer++",
    "for each neighbor v of u:",
    "    if v not visited: dfs(v, u)",
    "    low[u] = min(low[u], low[v])",
    "    if low[v] > disc[u]: BRIDGE!",
    "    else if v ≠ parent: low[u] = min(low[u], disc[v])"
];

function renderCode(codeEl, activeLine) {
    let html = '';
    CODE_LINES.forEach((line, i) => {
        const isActive = i === activeLine;
        const bg = isActive ? 'rgba(79,143,247,0.15)' : 'transparent';
        const color = isActive ? '#93c5fd' : '#3f3f46';
        const weight = isActive ? '600' : '400';
        html += `<div style="padding:2px 8px;border-radius:4px;background:${bg};
                    color:${color};font-weight:${weight};font-size:12px;line-height:2;
                    font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    codeEl.innerHTML = html;
}
```

#### COMPLETE HTML TEMPLATE

Every visualization MUST follow this structure. Replace `N` with a unique number per problem:

```
<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.vizN-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.vizN-grid{grid-template-columns:1fr}}
.vizN-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.vizN-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.vizN-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.vizN-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.vizN-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.vizN-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
.vizN-btn:disabled{opacity:0.3}
.vizN-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}
</style>

<!-- Test case buttons -->
<div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap" id="tcBarN"></div>

<!-- Step controls -->
<div style="display:flex;gap:6px;align-items:center;margin-bottom:12px">
  <button class="vizN-btn" id="prevN" onclick="prevN()">← Prev</button>
  <button class="vizN-btn" id="nextN" onclick="nextN()">Next →</button>
  <button class="vizN-btn" id="autoN" onclick="toggleAutoN()">▶ Auto</button>
  <span style="flex:1;text-align:center;font-size:12px;color:#71717a" id="stepLabelN">Ready</span>
</div>

<div class="vizN-grid">
  <!-- LEFT COLUMN -->
  <div>
    <!-- Panel 1: SVG Data Structure -->
    <div class="vizN-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Data Structure</div>
      <svg id="svgN" width="100%" viewBox="0 0 450 280"></svg>
    </div>
    <!-- Panel 2: Variables & Memory -->
    <div class="vizN-state" id="stateN"></div>
    <!-- Panel 3: Code with line highlight -->
    <div class="vizN-code" id="codeN"></div>
  </div>
  <!-- RIGHT COLUMN -->
  <div>
    <!-- Panel 4: Algorithm Log -->
    <div class="vizN-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="vizN-log" id="logN"></div>
    </div>
    <!-- Panel 5: Step Explanation -->
    <div class="vizN-expl" id="explN"></div>
  </div>
</div>

<script>
// === UNIQUE FUNCTION NAMES (suffix with N) ===
const TCS_N = [
    { name: "Basic", data: ... },
    { name: "Complex", data: ... },
    { name: "Edge case", data: ... },
];

let stepsN = [], stepIdxN = -1, autoIntN = null, tcIdxN = 0;

function buildStepsN(tc) {
    stepsN = [];
    // SIMULATE the algorithm step by step
    // Each step captures:
    // { type, msg, svgState, variables, changedVars, codeLine, explanation }
    // svgState: data needed to render the SVG (node positions, colors, values)
    // variables: ALL algorithm variables as key-value pairs
    // changedVars: Set of variable names that changed this step
    // codeLine: which line of CODE_LINES_N is executing
    // explanation: 2-3 sentence natural language explanation
}

function renderN() {
    const s = stepsN[stepIdxN];
    if (!s) return;
    
    // 1. Draw SVG data structure
    const svg = document.getElementById('svgN');
    // ... use drawArray/drawGraph/drawTree patterns above ...
    
    // 2. Render variable state table
    renderState(document.getElementById('stateN'), s.variables, s.changedVars);
    
    // 3. Highlight current code line
    renderCode(document.getElementById('codeN'), s.codeLine);
    
    // 4. Update log (all steps up to current)
    let logHtml = '';
    for (let i = 0; i <= stepIdxN; i++) {
        const marker = i === stepIdxN ? '▶ ' : '  ';
        logHtml += `<div style="color:${stepsN[i].color}">${marker}${stepsN[i].msg}</div>`;
    }
    document.getElementById('logN').innerHTML = logHtml;
    document.getElementById('logN').scrollTop = 99999;
    
    // 5. Show explanation
    document.getElementById('explN').innerHTML = s.explanation;
    
    // 6. Update step counter
    document.getElementById('stepLabelN').textContent = `Step ${stepIdxN + 1} / ${stepsN.length}`;
    document.getElementById('prevN').disabled = stepIdxN <= 0;
    document.getElementById('nextN').disabled = stepIdxN >= stepsN.length - 1;
}

function nextN() { if (stepIdxN < stepsN.length - 1) { stepIdxN++; renderN(); } }
function prevN() { if (stepIdxN > 0) { stepIdxN--; renderN(); } }
function toggleAutoN() {
    if (autoIntN) { clearInterval(autoIntN); autoIntN = null; document.getElementById('autoN').textContent = '▶ Auto'; }
    else { autoIntN = setInterval(() => { if (stepIdxN >= stepsN.length - 1) { toggleAutoN(); return; } nextN(); }, 1000);
        document.getElementById('autoN').textContent = '⏸ Pause'; }
}
function loadTcN(idx) {
    tcIdxN = idx; stepIdxN = 0;
    buildStepsN(TCS_N[idx]);
    document.querySelectorAll('[data-tcn]').forEach((b, i) => { b.className = i === idx ? 'vizN-btn active' : 'vizN-btn'; });
    renderN();
}

// Initialize
const tcBar = document.getElementById('tcBarN');
TCS_N.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'vizN-btn active' : 'vizN-btn';
    b.setAttribute('data-tcn', '');
    b.onclick = () => loadTcN(i);
    tcBar.appendChild(b);
});
buildStepsN(TCS_N[0]); renderN();
</script>
</div>
```

#### STEP GRANULARITY FOR VISUALIZATION

Each algorithmic operation should be broken into MULTIPLE steps in the visualization. For example, inserting "apple" into a Trie should NOT be one step. It should be 5-6 steps:

1. Start at root, look at character 'a'
2. Create node for 'a', move to it
3. Look at character 'p', create node, move
4. Look at character 'p', create node, move
5. Look at character 'l', create node, move
6. Look at character 'e', create node, mark endOfWord=true

Each step updates the SVG to show the tree growing, highlights the current node, updates the variable state panel, highlights the executing code line, and shows an explanation.

For graph algorithms (DFS, BFS, Dijkstra), each node visit, edge exploration, and backtrack should be a separate step.

For array algorithms (two pointer, sliding window, binary search), each pointer movement or comparison should be a separate step.

#### MANDATORY TEST CASES — MINIMUM 4 PER VISUALIZATION

The AI MUST include AT LEAST 4 test cases that cover DIFFERENT scenarios:

1. **"Happy path"** — A straightforward input where the algorithm works normally. 4-6 elements. The answer is clearly in the middle of processing (not the first or last element).
2. **"Edge case - small"** — The smallest valid input (1-2 elements, empty array, single node graph). Tests boundary conditions.
3. **"Tricky case"** — An input that trips up beginners. Examples: all elements the same, already sorted in wrong order, negative numbers, target at the very end, graph with a cycle, duplicate values.
4. **"Complex case"** — A larger input (7-10 elements) that shows the algorithm doing more work. Multiple iterations, backtracking, re-heapifying, etc. This is the case that really demonstrates the algorithm's behavior.

**BAD test cases (too simple, don't teach anything):**
```
{ name: "Basic", data: [1, 2, 3] }
{ name: "Another", data: [4, 5, 6] }
{ name: "Edge", data: [1] }
```

**GOOD test cases (diverse, each reveals different algorithm behavior):**
```
{ name: "Find in middle", data: { arr: [2,3,5,7,11,13,17], target: 7 } }       // found at step 1 (lucky mid)
{ name: "Not found", data: { arr: [1,3,5,7,9], target: 4 } }                    // exhausts search space
{ name: "First element", data: { arr: [1,2,3,4,5,6,7,8], target: 1 } }          // always goes left
{ name: "Last element", data: { arr: [10,20,30,40,50,60,70,80], target: 80 } }  // always goes right
```

---

### QUALITY CHECKLIST

Before outputting, verify:

- [ ] Visualization HTML is NOT inside triple backtick code fences
- [ ] Visualization uses SVG `<circle>`, `<rect>`, `<line>`, `<text>` — NOT div-based rendering
- [ ] Every element ID and function name is unique per problem (suffixed with problem number)
- [ ] Variable state panel shows ALL variables as a table with change highlighting
- [ ] Code panel highlights the currently executing line
- [ ] At least 3 test cases per visualization
- [ ] Step-by-Step Solution is 1000+ words with per-line code tracing — NO skipped iterations
- [ ] In-depth Intuition is 500+ words with: proof, alternatives, input properties, connections, constraint changes
- [ ] Intuition is 150+ words with: core idea, why it works, data structure choice, mini-example
- [ ] In-depth Explanation is 400+ words with: reframe, pattern recognition, analogy, naive failure, cheat sheet
- [ ] Description is 200+ words with 3 examples (happy path + tricky + edge) and constraint analysis
- [ ] Algorithm has pseudocode PLUS 3-5 paragraph explanation of each block
- [ ] Every step has: Where are we? → What do we see? → The Decision → Why it matters → The Action → Analogy → State after
- [ ] At least one 💡 KEY INSIGHT callout per step-by-step section
- [ ] After walkthrough: Correctness (beginner-friendly), Key Invariant (plain English), 3+ Beginner Mistakes, "Why not just..." answers, 30-second pitch
- [ ] Real values used everywhere (not "arr[i]" but "arr[2] = 11")
- [ ] Every approach (brute, better, optimal) has ALL 10 sections at equal depth
- [ ] Code inside ```java blocks has proper 4-space indentation
- [ ] Complexity explains WHY, not just states the Big-O
- [ ] Problems separated by `---`
- [ ] Description includes constraints and 2+ examples
- [ ] In-depth Explanation includes interview cheat sheet with memory hook
- [ ] YouTube video link included for every problem
- [ ] LeetCode and GFG links included where available

---

### BAD vs GOOD VISUALIZATION — STUDY THIS

**BAD (text-based tree — NEVER do this):**
```javascript
// This renders as plain text, not a visual diagram
html += `<div style="margin-left:${depth*24}px">├─ ${label}</div>`;
```

**GOOD (SVG-based tree):**
```javascript
// This renders as a proper visual diagram with circles and lines
svg += `<line x1="${parent.x}" y1="${parent.y+16}" x2="${child.x}" y2="${child.y-16}" 
          stroke="#3f3f46" stroke-width="1.5"/>`;
svg += `<circle cx="${child.x}" cy="${child.y}" r="16" fill="#0e1a2e" stroke="#4f8ff7"/>`;
svg += `<text x="${child.x}" y="${child.y}" text-anchor="middle" dominant-baseline="central" 
          font-size="12" fill="#93c5fd">${child.label}</text>`;
```

**BAD (minimal state display):**
```javascript
statePanel.innerHTML = `Operation: ${s.msg}. Map size: ${s.size}`;
```

**GOOD (full variable table with highlights):**
```javascript
statePanel.innerHTML = `
<table>
  <tr><td>current_node</td><td style="color:#fbbf24">node_3 ← moved from node_2</td></tr>
  <tr><td>disc[]</td><td>[0, 1, 2, <span style="color:#fbbf24">3</span>, -]</td></tr>
  <tr><td>low[]</td><td>[0, 1, <span style="color:#fbbf24">0</span>, 3, -]</td></tr>
  <tr><td>stack</td><td>[0, 1, 3]</td></tr>
  <tr><td>bridges</td><td>[]</td></tr>
</table>`;
```

═══════════════════════════════════════════════════════════════════

---

## QUICK-USE EXAMPLES

**Single subtopic:**
```
Generate the markdown for subtopic "Trie" with these problems:
1. Implement Trie — Hard — https://leetcode.com/problems/implement-trie-prefix-tree/ — https://youtube.com/watch?v=dBGUmUQhjaM (Striver)
2. Longest Word With All Prefixes — Medium — [GFG link] — https://youtube.com/watch?v=AWnBa91lThI (Striver)
3. Count Distinct Substrings — Hard — [GFG link] — https://youtube.com/watch?v=RV0QeTyHZxo (Striver)
```

**Requesting a split:**
```
This has 10 problems. Generate File 1 (problems 1-3) now. I'll ask for File 2 next.
```

**Fixing a bad visualization:**
```
The visualization for problem 2 uses div-based tree rendering. 
Regenerate ONLY the ## Optimal Visualization section using SVG 
with circles for nodes and lines for edges. Follow the SVG patterns 
in the prompt. Remember: NO code fences around the HTML.
```

---

## HEADING → FIELD MAPPING

```
**YouTube:** URL                            → youtube_url
## Description                           → description
## In-depth Explanation                  → in_depth_explanation
## [Approach] Intuition                  → solutions[].intuition
## [Approach] Step-by-Step Solution      → solutions[].in_depth_intuition
## [Approach] In-depth Intuition         → solutions[].in_depth_intuition (merged)
## [Approach] Algorithm                  → solutions[].algorithm
## [Approach] Code                       → solutions[].code
## [Approach] Complexity                 → solutions[].time_complexity + space_complexity
## [Approach] Hints                      → solutions[].hints
## [Approach] Visualization              → solutions[].visualization_html

Approach keywords: "brute force/brute/naive" → Brute Force
                   "better/improved" → Better
                   "optimal/efficient/best" → Optimal
```
