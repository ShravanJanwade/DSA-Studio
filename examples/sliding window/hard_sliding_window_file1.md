# Longest Substring With At Most K Distinct Characters

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/

## Description

Given a string `s` and an integer `k`, return the length of the longest substring of `s` that contains at most `k` distinct characters.

**Input:** A string `s` (1 ≤ s.length ≤ 5 × 10⁴) consisting of English letters, and an integer `k` (0 ≤ k ≤ 50).

**Output:** An integer — the length of the longest substring with at most `k` distinct characters.

**Constraints:**
- 1 ≤ s.length ≤ 5 × 10⁴
- 0 ≤ k ≤ 50

**Example 1:**
Input: s = "eceba", k = 2
Output: 3
Explanation: The substring "ece" has 2 distinct characters ('e' and 'c') and length 3. No longer substring has ≤ 2 distinct characters.

**Example 2:**
Input: s = "aa", k = 1
Output: 2
Explanation: The entire string "aa" has only 1 distinct character, which is ≤ 1.

**Example 3:**
Input: s = "aabbcc", k = 0
Output: 0
Explanation: With k=0, no characters are allowed, so the answer is 0.

**Edge Cases:**
- k = 0 → answer is always 0
- k ≥ 26 (or total distinct chars in s) → answer is s.length
- All same characters → answer is s.length for any k ≥ 1

## In-depth Explanation

**Reframe:** Find the longest contiguous window in the string such that the number of unique characters inside the window does not exceed k.

**Pattern recognition:** This is a classic **sliding window** problem. Keywords: "longest substring", "at most K distinct" — these scream variable-length sliding window with a constraint on the window's content. The "at most K" constraint means we expand the window while valid and shrink it when invalid.

**Real-world analogy:** Imagine a TV screen showing a scrolling ticker. You can only track k different stock symbols at once. You want to find the longest uninterrupted stretch of the ticker where only k or fewer different symbols appear.

**Why naive fails:** Checking all O(n²) substrings and counting distinct characters in each O(n) gives O(n³). Even with a frequency map making each check O(n²), it's too slow for n = 50,000.

**Approach roadmap:**
- **Brute Force:** Check all substrings, count distinct characters — O(n²).
- **Optimal (Sliding Window):** Expand right pointer, shrink left when distinct > k — O(n).

**Interview cheat sheet:**
- Keywords: "longest", "at most K distinct", "substring" (contiguous)
- Different from "exactly K distinct" (which uses the at-most-K trick as a building block)
- The "aha moment": The window only needs to shrink from the left when we exceed k distinct characters, and we track frequencies with a HashMap
- Memory hook: "Expand right greedily, shrink left reluctantly — HashMap counts keep you honest"

## Brute Force Intuition

Generate every possible substring, count the number of distinct characters in each, and track the maximum length among those with ≤ k distinct characters. This directly translates the problem statement into code with no clever optimization.

## Brute Force Step-by-Step Solution

Let's trace through s = "eceba", k = 2.

**Step 1: Initialize outer loop, i = 0**

Code executing: `for (int i = 0; i < n; i++)`

We begin examining all substrings starting at index 0. We create a fresh HashSet to track distinct characters for substrings starting at this position.
- i = 0
- maxLen = 0
- set = {} (empty)

**Step 2: Inner loop, i = 0, j = 0, character 'e'**

Code executing: `set.add(s.charAt(j))` then `if (set.size() <= k)`

We add 'e' to the set. set = {'e'}, size = 1. Since 1 ≤ 2 (k), this substring "e" is valid. Update maxLen = max(0, 0 - 0 + 1) = 1.

State after: set = {'e'}, maxLen = 1

**Step 3: Inner loop, i = 0, j = 1, character 'c'**

Code executing: `set.add(s.charAt(j))`

We add 'c'. set = {'e', 'c'}, size = 2. Since 2 ≤ 2, "ec" is valid. maxLen = max(1, 2) = 2.

State after: set = {'e', 'c'}, maxLen = 2

**Step 4: Inner loop, i = 0, j = 2, character 'e'**

'e' already in set. set = {'e', 'c'}, size = 2 ≤ 2. "ece" valid. maxLen = max(2, 3) = 3.

State after: set = {'e', 'c'}, maxLen = 3

**Step 5: Inner loop, i = 0, j = 3, character 'b'**

We add 'b'. set = {'e', 'c', 'b'}, size = 3. Since 3 > 2 (k), the substring "eceb" is INVALID. We break out of the inner loop — no point extending further because any longer substring starting at i=0 will also contain these 3+ characters.

State after: maxLen = 3

**Step 6: Outer loop, i = 1 through i = 4**

For i = 1 (starting at 'c'): "ce" (2 distinct, len 2), "ceb" breaks at 3 distinct. Max from this start = 2.
For i = 2 (starting at 'e'): "e", "eb", "eba" breaks at 3 distinct. Max = 2.
For i = 3 (starting at 'b'): "b", "ba" — both ≤ 2 distinct. Max = 2.
For i = 4 (starting at 'a'): "a" — 1 distinct. Max = 1.

Overall maxLen = 3.

**Correctness argument:** We enumerate every possible substring. For each, we correctly count distinct characters using a HashSet. We track the maximum length that satisfies the constraint. Since we check all substrings, we cannot miss the optimal one.

**Key invariant:** At any point in the inner loop, the set contains exactly the distinct characters in s[i..j].

**Common mistakes:**
1. Forgetting to reset the set for each new starting index i — this causes character leakage from previous substrings.
2. Using `break` vs `continue` incorrectly — once distinct > k, we should break the inner loop since extending further can only add more characters.

**30-second interview pitch:** "I check every substring using two nested loops. For each, I use a HashSet to count distinct characters, and I track the max length where distinct ≤ k. It's O(n²) which is correct but slow — I'd then optimize to O(n) with a sliding window."

## Brute Force In-depth Intuition

The brute force directly models the problem: a substring is just a contiguous range [i, j], and we need to find the longest range where the number of unique elements is ≤ k. By iterating all possible starting points and extending each as far as possible, we guarantee correctness. The HashSet gives us O(1) lookups for whether a character is already present. The key observation that enables a small optimization: once a substring starting at i exceeds k distinct characters, any longer substring starting at i will also exceed k, so we can break early. However, we still restart from scratch for each new starting position, which is what the sliding window avoids.

## Brute Force Algorithm

```
function lengthOfLongestSubstringKDistinct(s, k):
    n = s.length
    if k == 0: return 0
    maxLen = 0

    for i = 0 to n - 1:
        set = new HashSet()
        for j = i to n - 1:
            set.add(s[j])
            if set.size() > k:
                break
            maxLen = max(maxLen, j - i + 1)

    return maxLen
```

The outer loop fixes the start of the substring. The inner loop extends the end. We add each character to a set and break when we exceed k distinct characters. The max valid length seen across all substrings is our answer.

## Brute Force Code

```java
class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        if (k == 0) return 0;
        int n = s.length();
        int maxLen = 0;

        for (int i = 0; i < n; i++) {
            Set<Character> set = new HashSet<>();
            for (int j = i; j < n; j++) {
                set.add(s.charAt(j));
                if (set.size() > k) {
                    break; // no point extending further
                }
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
        return maxLen;
    }
}
```

## Brute Force Complexity

**Time: O(n²)** — The outer loop runs n times. For each, the inner loop runs up to n times. The HashSet operations are O(1). So worst case is O(n²) (e.g., when all characters are distinct and k is large, or when k = n).

**Space: O(min(n, 26))** — The HashSet stores at most min(n, 26) characters (since we're dealing with English letters). Effectively O(1) for bounded alphabets.

## Brute Force Hints

1. What's the simplest way to check if a substring has ≤ k distinct characters? Think about a data structure for uniqueness.
2. If you fix the start index, how far can you extend the end before exceeding k distinct characters?
3. Once distinct count exceeds k, can any longer substring from the same start be valid?
4. Use a HashSet to track the distinct characters in the current window.
5. The answer is the maximum (j - i + 1) across all valid windows.

## Brute Force Visualization

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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Array & Window</div>
      <svg id="svg1" width="100%" viewBox="0 0 500 120"></svg>
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
const TCS_1 = [
    { name: "eceba, k=2", data: "eceba", k: 2 },
    { name: "aa, k=1", data: "aa", k: 1 },
    { name: "abcba, k=2", data: "abcba", k: 2 }
];

const CODE_LINES_1 = [
    "for i = 0 to n-1:",
    "    set = new HashSet()",
    "    for j = i to n-1:",
    "        set.add(s[j])",
    "        if set.size() > k: break",
    "        maxLen = max(maxLen, j-i+1)"
];

let steps1 = [], stepIdx1 = -1, autoInt1 = null, tcIdx1 = 0;

function buildSteps1(tc) {
    steps1 = [];
    const s = tc.data, k = tc.k, n = s.length;
    let maxLen = 0;
    steps1.push({ msg: "Initialize maxLen=0", vars: { i:"-", j:"-", "s[j]":"-", set:"{}", "set.size":0, maxLen:0 }, changed: new Set(["maxLen"]), codeLine: 0, explanation: "We start with maxLen=0. We will try every starting index i and extend j as far as possible.", color: "#71717a", highlights: {}, windowStart: -1, windowEnd: -1 });
    for (let i = 0; i < n; i++) {
        const set = new Set();
        steps1.push({ msg: `i=${i}: start new substring at '${s[i]}'`, vars: { i:i, j:"-", "s[j]":"-", set:"{}", "set.size":0, maxLen:maxLen }, changed: new Set(["i","set"]), codeLine: 1, explanation: `Starting a new substring at index ${i} (character '${s[i]}'). We reset the HashSet to empty.`, color: "#4f8ff7", highlights: { [i]: "#4f8ff7" }, windowStart: i, windowEnd: i });
        let broke = false;
        for (let j = i; j < n; j++) {
            set.add(s[j]);
            const setStr = "{" + Array.from(set).map(c => `'${c}'`).join(", ") + "}";
            if (set.size > k) {
                steps1.push({ msg: `  j=${j}: add '${s[j]}' → distinct=${set.size} > k=${k}, BREAK`, vars: { i:i, j:j, "s[j]":s[j], set:setStr, "set.size":set.size, maxLen:maxLen }, changed: new Set(["j","s[j]","set","set.size"]), codeLine: 4, explanation: `Added '${s[j]}' to set. Now we have ${set.size} distinct characters which exceeds k=${k}. We break the inner loop — no longer substring from i=${i} can be valid.`, color: "#ef4444", highlights: getHighlights(i, j, s, "#ef4444"), windowStart: i, windowEnd: j });
                broke = true;
                break;
            }
            maxLen = Math.max(maxLen, j - i + 1);
            const hlObj = getHighlights(i, j, s, "#22c55e");
            steps1.push({ msg: `  j=${j}: add '${s[j]}' → distinct=${set.size} ≤ k, len=${j-i+1}, maxLen=${maxLen}`, vars: { i:i, j:j, "s[j]":s[j], set:setStr, "set.size":set.size, maxLen:maxLen }, changed: new Set(["j","s[j]","set", maxLen === j-i+1 ? "maxLen" : ""]), codeLine: 5, explanation: `Added '${s[j]}' to set. We have ${set.size} distinct character(s) which is ≤ k=${k}. Current window length is ${j-i+1}. maxLen updated to ${maxLen}.`, color: "#22c55e", highlights: hlObj, windowStart: i, windowEnd: j });
        }
    }
    steps1.push({ msg: `Done! Answer = ${maxLen}`, vars: { maxLen: maxLen }, changed: new Set(["maxLen"]), codeLine: -1, explanation: `We've examined all starting positions. The longest valid substring has length ${maxLen}.`, color: "#fbbf24", highlights: {}, windowStart: -1, windowEnd: -1 });
    stepIdx1 = 0;
}

function getHighlights(i, j, s, color) {
    const h = {};
    for (let x = i; x <= j; x++) h[x] = color;
    return h;
}

function render1() {
    const s1 = steps1[stepIdx1];
    if (!s1) return;
    const tc = TCS_1[tcIdx1];
    const s = tc.data;
    // SVG
    const boxW = 48, boxH = 40, gap = 4, startX = 20, startY = 30;
    let svg = '';
    for (let i = 0; i < s.length; i++) {
        const x = startX + i * (boxW + gap);
        svg += `<text x="${x + boxW/2}" y="${startY - 8}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color = s1.highlights[i] || '#2a2a33';
        const tc2 = s1.highlights[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6" fill="${color}" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svg += `<text x="${x + boxW/2}" y="${startY + boxH/2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s[i]}</text>`;
    }
    if (s1.windowStart >= 0 && s1.windowEnd >= 0) {
        const lx = startX + s1.windowStart * (boxW + gap);
        svg += `<text x="${lx + boxW/2}" y="${startY + boxH + 16}" text-anchor="middle" font-size="10" font-weight="600" fill="#4f8ff7" font-family="JetBrains Mono,monospace">i=${s1.windowStart}</text>`;
        if (s1.windowEnd !== s1.windowStart) {
            const rx = startX + s1.windowEnd * (boxW + gap);
            svg += `<text x="${rx + boxW/2}" y="${startY + boxH + 16}" text-anchor="middle" font-size="10" font-weight="600" fill="#fbbf24" font-family="JetBrains Mono,monospace">j=${s1.windowEnd}</text>`;
        }
    }
    document.getElementById('svg1').innerHTML = svg;
    // State
    renderState1(document.getElementById('state1'), s1.vars, s1.changed);
    // Code
    renderCode1(document.getElementById('code1'), s1.codeLine);
    // Log
    let logHtml = '';
    for (let i = 0; i <= stepIdx1; i++) {
        const marker = i === stepIdx1 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps1[i].color}">${marker}${steps1[i].msg}</div>`;
    }
    document.getElementById('log1').innerHTML = logHtml;
    document.getElementById('log1').scrollTop = 99999;
    document.getElementById('expl1').innerHTML = s1.explanation;
    document.getElementById('stepLabel1').textContent = `Step ${stepIdx1 + 1} / ${steps1.length}`;
    document.getElementById('prev1').disabled = stepIdx1 <= 0;
    document.getElementById('next1').disabled = stepIdx1 >= steps1.length - 1;
}

function renderState1(el, vars, changes) {
    let html = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(vars).forEach(([name, value]) => {
        const changed = changes.has(name);
        const bg = changed ? 'rgba(251,191,36,0.1)' : 'transparent';
        const nc = changed ? '#fbbf24' : '#52525b';
        const vc = changed ? '#fbbf24' : '#b8b8be';
        html += `<tr style="background:${bg}"><td style="padding:4px 10px;color:${nc};font-weight:600;width:40%">${name}</td><td style="padding:4px 10px;color:${vc}">${value}${changed ? ' ← changed' : ''}</td></tr>`;
    });
    html += '</table>';
    el.innerHTML = html;
}

function renderCode1(el, activeLine) {
    let html = '';
    CODE_LINES_1.forEach((line, i) => {
        const isActive = i === activeLine;
        const bg = isActive ? 'rgba(79,143,247,0.15)' : 'transparent';
        const color = isActive ? '#93c5fd' : '#3f3f46';
        const weight = isActive ? '600' : '400';
        html += `<div style="padding:2px 8px;border-radius:4px;background:${bg};color:${color};font-weight:${weight};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    el.innerHTML = html;
}

function next1() { if (stepIdx1 < steps1.length - 1) { stepIdx1++; render1(); } }
function prev1() { if (stepIdx1 > 0) { stepIdx1--; render1(); } }
function toggleAuto1() {
    if (autoInt1) { clearInterval(autoInt1); autoInt1 = null; document.getElementById('auto1').textContent = '▶ Auto'; }
    else { autoInt1 = setInterval(() => { if (stepIdx1 >= steps1.length - 1) { toggleAuto1(); return; } next1(); }, 1000); document.getElementById('auto1').textContent = '⏸ Pause'; }
}
function loadTc1(idx) {
    tcIdx1 = idx; stepIdx1 = 0;
    if (autoInt1) toggleAuto1();
    buildSteps1(TCS_1[idx]);
    document.querySelectorAll('[data-tc1]').forEach((b, i) => { b.className = i === idx ? 'viz1-btn active' : 'viz1-btn'; });
    render1();
}

const tcBar1El = document.getElementById('tcBar1');
TCS_1.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'viz1-btn active' : 'viz1-btn';
    b.setAttribute('data-tc1', '');
    b.onclick = () => loadTc1(i);
    tcBar1El.appendChild(b);
});
buildSteps1(TCS_1[0]); render1();
</script>
</div>

## Optimal Intuition

Use a sliding window with two pointers (left, right) and a HashMap that stores each character's frequency. Expand right to include characters. When distinct characters exceed k, shrink from the left by decrementing frequencies and removing characters that drop to zero. The window always represents a valid (or about-to-be-fixed) substring, and we track the max valid window size seen.

## Optimal Step-by-Step Solution

Let's trace through s = "eceba", k = 2.

**Step 1: Initialize**

Code executing: `int left = 0, maxLen = 0; Map<Character, Integer> map = new HashMap<>();`

We set up two pointers both at 0 and an empty frequency map. left = 0, right will iterate via the for loop. maxLen = 0, map = {}.

State: left = 0, maxLen = 0, map = {}

**Step 2: right = 0, character 'e'**

Code executing: `map.put(c, map.getOrDefault(c, 0) + 1)`

We add 'e' to the map. map = {'e': 1}. Distinct count = map.size() = 1 ≤ 2 (k), so the window [0, 0] is valid. maxLen = max(0, 0 - 0 + 1) = 1.

State: left = 0, right = 0, map = {'e':1}, maxLen = 1

**Step 3: right = 1, character 'c'**

Code executing: `map.put(c, map.getOrDefault(c, 0) + 1)`

Add 'c'. map = {'e':1, 'c':1}. map.size() = 2 ≤ 2, valid. maxLen = max(1, 1 - 0 + 1) = 2.

State: left = 0, right = 1, map = {'e':1, 'c':1}, maxLen = 2

**Step 4: right = 2, character 'e'**

Add 'e'. map = {'e':2, 'c':1}. map.size() = 2 ≤ 2, valid. maxLen = max(2, 2 - 0 + 1) = 3.

State: left = 0, right = 2, map = {'e':2, 'c':1}, maxLen = 3

**Step 5: right = 3, character 'b'**

Code executing: `map.put(c, map.getOrDefault(c, 0) + 1)` then `while (map.size() > k)`

Add 'b'. map = {'e':2, 'c':1, 'b':1}. map.size() = 3 > 2! We must shrink the window from the left.

**Shrink iteration 1:** left = 0, s[0] = 'e'. Decrement: map['e'] = 2 - 1 = 1. map['e'] is not 0, so don't remove. left becomes 1. map.size() = 3, still > 2, keep shrinking.

**Shrink iteration 2:** left = 1, s[1] = 'c'. Decrement: map['c'] = 1 - 1 = 0. Remove 'c' from map. left becomes 2. map = {'e':1, 'b':1}. map.size() = 2 ≤ 2. Stop shrinking!

Now window is [2, 3] = "eb", length 2. maxLen stays 3.

State: left = 2, right = 3, map = {'e':1, 'b':1}, maxLen = 3

**Step 6: right = 4, character 'a'**

Add 'a'. map = {'e':1, 'b':1, 'a':1}. map.size() = 3 > 2! Shrink.

**Shrink:** left = 2, s[2] = 'e'. Decrement: map['e'] = 0. Remove 'e'. left = 3. map = {'b':1, 'a':1}. size = 2 ≤ 2. Stop.

Window [3, 4] = "ba", length 2. maxLen stays 3.

State: left = 3, right = 4, map = {'b':1, 'a':1}, maxLen = 3

**Step 7: Loop ends, return maxLen = 3.**

**Correctness argument:** The sliding window considers every possible right endpoint. For each right endpoint, we find the smallest left such that the window has ≤ k distinct characters. Because left only moves forward (never backward), every valid window is considered, and the maximum is tracked.

**Key invariant:** At the end of each iteration, the window [left, right] contains at most k distinct characters, and left is as small as possible for this right endpoint.

**Common mistakes:**
1. Forgetting to remove the character from the map when its count drops to 0 — this inflates map.size() and causes over-shrinking.
2. Using `map.size() >= k` instead of `map.size() > k` — "at most k" means we should only shrink when we EXCEED k.

**30-second interview pitch:** "I use a sliding window with a HashMap tracking character frequencies. I expand right greedily. When map.size() exceeds k, I shrink from the left, decrementing counts and removing zero-frequency characters. The max window length seen is the answer. Linear time because each character enters and leaves the window at most once."

## Optimal In-depth Intuition

The sliding window works because of the **monotonicity property**: if the window [left, right] has more than k distinct characters, then [left, right+1] will also have ≥ k+1 distinct characters, so moving right without moving left can never fix the violation. Conversely, moving left forward can only decrease (or maintain) the number of distinct characters. This means left never needs to go backward — it's a one-pass, amortized O(n) algorithm. The HashMap is the key data structure because it lets us track both the count of each character AND the number of distinct characters (via map.size()) in O(1) time per operation. An alternative approach uses an ordered data structure (like TreeMap) to track the rightmost occurrence of each character, allowing us to jump left to the optimal position. But the HashMap approach is simpler and equally efficient.

## Optimal Algorithm

```
function lengthOfLongestSubstringKDistinct(s, k):
    if k == 0: return 0
    map = new HashMap()     // char → frequency
    left = 0, maxLen = 0

    for right = 0 to n - 1:
        c = s[right]
        map[c] = map.getOrDefault(c, 0) + 1    // expand window

        while map.size() > k:                   // too many distinct chars
            leftChar = s[left]
            map[leftChar] -= 1
            if map[leftChar] == 0:
                map.remove(leftChar)            // remove from distinct count
            left += 1                           // shrink window

        maxLen = max(maxLen, right - left + 1)  // update answer

    return maxLen
```

The for loop expands the window by adding the character at `right`. The while loop shrinks from the left until we're back to ≤ k distinct characters. After both, the window is valid and we check if it's the longest seen. The HashMap tracks frequencies; removing a key when its count hits 0 ensures `map.size()` correctly reflects the distinct count.

## Optimal Code

```java
class Solution {
    public int lengthOfLongestSubstringKDistinct(String s, int k) {
        if (k == 0) return 0;
        int n = s.length();
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < n; right++) {
            char c = s.charAt(right);
            map.put(c, map.getOrDefault(c, 0) + 1); // add to window

            while (map.size() > k) { // shrink until valid
                char leftChar = s.charAt(left);
                map.put(leftChar, map.get(leftChar) - 1);
                if (map.get(leftChar) == 0) {
                    map.remove(leftChar); // crucial: remove zero-freq chars
                }
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

## Optimal Complexity

**Time: O(n)** — The right pointer traverses the string once (n iterations). The left pointer also traverses at most n positions total across all iterations of the while loop (each character is added and removed at most once). So total work is O(n + n) = O(n). HashMap operations are O(1) amortized.

**Space: O(k)** — The HashMap stores at most k + 1 entries before shrinking kicks in, so it holds at most k distinct characters at any valid state. For bounded alphabets, this is also O(min(k, 26)).

## Optimal Hints

1. Think about maintaining a window [left, right] and expanding right one step at a time.
2. What data structure lets you quickly know how many distinct characters are in the current window?
3. When should you shrink the window? What condition signals that the window is invalid?
4. When removing a character from the left, what must you check before updating the distinct count?
5. Each character enters the window once (right moves) and leaves once (left moves) — what's the total work?
6. The answer is simply the maximum value of (right - left + 1) across all valid windows.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz2-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz2-grid{grid-template-columns:1fr}}
.viz2-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz2-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz2-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Sliding Window</div>
      <svg id="svg2" width="100%" viewBox="0 0 500 130"></svg>
    </div>
    <div class="viz2-state" id="state2"></div>
    <div class="viz2-code" id="code2"></div>
  </div>
  <div>
    <div class="viz2-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz2-log" id="log2"></div>
    </div>
    <div class="viz2-expl" id="expl2"></div>
  </div>
</div>

<script>
const TCS_2 = [
    { name: "eceba, k=2", data: "eceba", k: 2 },
    { name: "aa, k=1", data: "aa", k: 1 },
    { name: "abaccc, k=2", data: "abaccc", k: 2 }
];

const CODE_LINES_2 = [
    "for right = 0 to n-1:",
    "    map[s[right]] += 1",
    "    while map.size() > k:",
    "        map[s[left]] -= 1",
    "        if map[s[left]]==0: remove",
    "        left++",
    "    maxLen = max(maxLen, right-left+1)"
];

let steps2 = [], stepIdx2 = -1, autoInt2 = null, tcIdx2 = 0;

function buildSteps2(tc) {
    steps2 = [];
    const s = tc.data, k = tc.k, n = s.length;
    let left = 0, maxLen = 0;
    const map = {};

    steps2.push({ msg: "Init: left=0, maxLen=0, map={}", vars: { left:0, right:"-", maxLen:0, "map":"{}","map.size":0 }, changed: new Set(["left","maxLen"]), codeLine: -1, explanation: "Initialize two pointers and an empty frequency map.", color: "#71717a", hl: {}, ptrs: {} });

    for (let right = 0; right < n; right++) {
        const c = s[right];
        map[c] = (map[c] || 0) + 1;
        const mapStr = JSON.stringify(map);
        const hl = {}; for (let x = left; x <= right; x++) hl[x] = '#4f8ff7';
        hl[right] = '#22c55e';

        steps2.push({ msg: `right=${right}: add '${c}' → map=${mapStr}`, vars: { left, right, maxLen, map: mapStr, "map.size": Object.keys(map).length }, changed: new Set(["right","map","map.size"]), codeLine: 1, explanation: `Expand window to include s[${right}]='${c}'. Increment its count in the map. Now map has ${Object.keys(map).length} distinct character(s).`, color: "#22c55e", hl, ptrs: { [left]: "L", [right]: "R" } });

        while (Object.keys(map).length > k) {
            const lc = s[left];
            map[lc]--;
            if (map[lc] === 0) delete map[lc];
            left++;
            const mapStr2 = JSON.stringify(map);
            const hl2 = {}; for (let x = left; x <= right; x++) hl2[x] = '#fbbf24';

            steps2.push({ msg: `  shrink: remove '${lc}', left=${left}, map=${mapStr2}`, vars: { left, right, maxLen, map: mapStr2, "map.size": Object.keys(map).length }, changed: new Set(["left","map","map.size"]), codeLine: 5, explanation: `Window has ${Object.keys(map).length + (map[lc] === undefined ? 1 : 0)} > k=${k} distinct. Remove s[${left-1}]='${lc}' from left. ${map[lc] === undefined ? "Count dropped to 0, removed from map." : "Count decremented."} Left moves to ${left}.`, color: "#fbbf24", hl: hl2, ptrs: { [left]: "L", [right]: "R" } });
        }

        maxLen = Math.max(maxLen, right - left + 1);
        const hl3 = {}; for (let x = left; x <= right; x++) hl3[x] = '#4f8ff7';

        steps2.push({ msg: `  window [${left},${right}], len=${right-left+1}, maxLen=${maxLen}`, vars: { left, right, maxLen, map: JSON.stringify(map), "map.size": Object.keys(map).length }, changed: new Set(["maxLen"]), codeLine: 6, explanation: `Window [${left},${right}] = "${s.substring(left,right+1)}" is valid with ${Object.keys(map).length} distinct ≤ k=${k}. Length = ${right-left+1}. maxLen = ${maxLen}.`, color: "#4f8ff7", hl: hl3, ptrs: { [left]: "L", [right]: "R" } });
    }

    steps2.push({ msg: `Answer: ${maxLen}`, vars: { maxLen }, changed: new Set(["maxLen"]), codeLine: -1, explanation: `All positions processed. Longest valid substring length = ${maxLen}.`, color: "#fbbf24", hl: {}, ptrs: {} });
    stepIdx2 = 0;
}

function render2() {
    const s2 = steps2[stepIdx2];
    if (!s2) return;
    const s = TCS_2[tcIdx2].data;
    const boxW = 48, boxH = 40, gap = 4, startX = 20, startY = 30;
    let svg = '';
    for (let i = 0; i < s.length; i++) {
        const x = startX + i * (boxW + gap);
        svg += `<text x="${x + boxW/2}" y="${startY - 8}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color = s2.hl[i] || '#2a2a33';
        const tc2 = s2.hl[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6" fill="${color}" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svg += `<text x="${x + boxW/2}" y="${startY + boxH/2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s[i]}</text>`;
    }
    if (s2.ptrs) {
        Object.entries(s2.ptrs).forEach(([idx, label]) => {
            const x = startX + parseInt(idx) * (boxW + gap);
            const c = label === 'L' ? '#4f8ff7' : '#fbbf24';
            svg += `<text x="${x + boxW/2}" y="${startY + boxH + 16}" text-anchor="middle" font-size="10" font-weight="600" fill="${c}" font-family="JetBrains Mono,monospace">${label}</text>`;
        });
    }
    document.getElementById('svg2').innerHTML = svg;
    renderState2(document.getElementById('state2'), s2.vars, s2.changed);
    renderCode2(document.getElementById('code2'), s2.codeLine);
    let logHtml = '';
    for (let i = 0; i <= stepIdx2; i++) {
        const marker = i === stepIdx2 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps2[i].color}">${marker}${steps2[i].msg}</div>`;
    }
    document.getElementById('log2').innerHTML = logHtml;
    document.getElementById('log2').scrollTop = 99999;
    document.getElementById('expl2').innerHTML = s2.explanation;
    document.getElementById('stepLabel2').textContent = `Step ${stepIdx2 + 1} / ${steps2.length}`;
    document.getElementById('prev2').disabled = stepIdx2 <= 0;
    document.getElementById('next2').disabled = stepIdx2 >= steps2.length - 1;
}

function renderState2(el, vars, changes) {
    let html = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(vars).forEach(([name, value]) => {
        const changed = changes.has(name);
        const bg = changed ? 'rgba(251,191,36,0.1)' : 'transparent';
        const nc = changed ? '#fbbf24' : '#52525b';
        const vc = changed ? '#fbbf24' : '#b8b8be';
        html += `<tr style="background:${bg}"><td style="padding:4px 10px;color:${nc};font-weight:600;width:40%">${name}</td><td style="padding:4px 10px;color:${vc}">${value}${changed ? ' ← changed' : ''}</td></tr>`;
    });
    html += '</table>';
    el.innerHTML = html;
}

function renderCode2(el, activeLine) {
    let html = '';
    CODE_LINES_2.forEach((line, i) => {
        const isActive = i === activeLine;
        const bg = isActive ? 'rgba(79,143,247,0.15)' : 'transparent';
        const color = isActive ? '#93c5fd' : '#3f3f46';
        const weight = isActive ? '600' : '400';
        html += `<div style="padding:2px 8px;border-radius:4px;background:${bg};color:${color};font-weight:${weight};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    el.innerHTML = html;
}

function next2() { if (stepIdx2 < steps2.length - 1) { stepIdx2++; render2(); } }
function prev2() { if (stepIdx2 > 0) { stepIdx2--; render2(); } }
function toggleAuto2() {
    if (autoInt2) { clearInterval(autoInt2); autoInt2 = null; document.getElementById('auto2').textContent = '▶ Auto'; }
    else { autoInt2 = setInterval(() => { if (stepIdx2 >= steps2.length - 1) { toggleAuto2(); return; } next2(); }, 1200); document.getElementById('auto2').textContent = '⏸ Pause'; }
}
function loadTc2(idx) {
    tcIdx2 = idx; stepIdx2 = 0;
    if (autoInt2) toggleAuto2();
    buildSteps2(TCS_2[idx]);
    document.querySelectorAll('[data-tc2]').forEach((b, i) => { b.className = i === idx ? 'viz2-btn active' : 'viz2-btn'; });
    render2();
}

const tcBar2El = document.getElementById('tcBar2');
TCS_2.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'viz2-btn active' : 'viz2-btn';
    b.setAttribute('data-tc2', '');
    b.onclick = () => loadTc2(i);
    tcBar2El.appendChild(b);
});
buildSteps2(TCS_2[0]); render2();
</script>
</div>

---

# Subarrays with K Different Integers

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/subarrays-with-k-different-integers/

## Description

Given an integer array `nums` and an integer `k`, return the number of **good subarrays** of `nums`. A good subarray is a subarray where the number of different integers in that subarray is **exactly** `k`.

**Input:** An integer array `nums` (1 ≤ nums.length ≤ 2 × 10⁴), where 1 ≤ nums[i] ≤ nums.length, and an integer `k` (1 ≤ k ≤ nums.length).

**Output:** An integer — the count of subarrays with exactly k distinct integers.

**Constraints:**
- 1 ≤ nums.length ≤ 2 × 10⁴
- 1 ≤ nums[i] ≤ nums.length
- 1 ≤ k ≤ nums.length

**Example 1:**
Input: nums = [1,2,1,2,3], k = 2
Output: 7
Explanation: Subarrays with exactly 2 distinct: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2].

**Example 2:**
Input: nums = [1,2,1,3,4], k = 3
Output: 3
Explanation: [1,2,1,3], [2,1,3], [1,3,4].

**Edge Cases:**
- k = 1 and all elements the same → every subarray is valid (n*(n+1)/2)
- All elements are distinct and k = n → exactly 1 valid subarray
- k > number of distinct elements in nums → answer is 0

## In-depth Explanation

**Reframe:** Count the number of contiguous subarrays that contain exactly k unique values.

**Pattern recognition:** This is the **"exactly K" sliding window** pattern. The trick: `exactly(k) = atMost(k) - atMost(k-1)`. This converts a hard "exactly K" counting problem into two easy "at most K" problems. Keywords: "number of subarrays", "exactly K different" — the subtraction trick is the standard approach.

**Real-world analogy:** Imagine counting playlists on a streaming service where each playlist must feature songs from exactly k different genres. It's hard to count "exactly k" directly. But if you know how many playlists use ≤ k genres and subtract those using ≤ k-1 genres, the difference gives you the "exactly k" playlists.

**Why naive fails:** Enumerating all O(n²) subarrays and counting distinct in each is O(n²) or O(n³), which is too slow.

**Approach roadmap:**
- **Brute Force:** Check all subarrays, count distinct — O(n²).
- **Optimal (atMost trick + Sliding Window):** Two passes of atMost sliding window — O(n).

**Interview cheat sheet:**
- Keywords: "exactly K distinct", "count subarrays"
- The atMost(k) - atMost(k-1) trick works for ANY "exactly k" counting problem
- The "aha moment": Inside the atMost sliding window, the number of valid subarrays ending at `right` is `right - left + 1`
- Memory hook: "Exactly = AtMost(k) minus AtMost(k-1); each right endpoint contributes (right - left + 1) subarrays"

## Brute Force Intuition

Check every possible subarray [i, j] and count the number of distinct integers using a HashSet. If the count equals exactly k, increment our answer. This is a straightforward O(n²) enumeration.

## Brute Force Step-by-Step Solution

Let's trace through nums = [1,2,1,2,3], k = 2.

**Step 1: Initialize, i = 0**

Code executing: `for (int i = 0; i < n; i++)`

We will check all subarrays starting at index 0. count = 0 (total valid subarrays found so far).

State: i = 0, count = 0

**Step 2: i = 0, j = 0, subarray [1]**

Code executing: `map.put(nums[j], map.getOrDefault(nums[j], 0) + 1)`

map = {1:1}. Distinct = 1. Since 1 ≠ 2 (k), this subarray is not counted.

State: map = {1:1}, distinct = 1, count = 0

**Step 3: i = 0, j = 1, subarray [1, 2]**

Add 2. map = {1:1, 2:1}. Distinct = 2 = k. Count++ → count = 1.

State: map = {1:1, 2:1}, distinct = 2, count = 1

**Step 4: i = 0, j = 2, subarray [1, 2, 1]**

Add 1. map = {1:2, 2:1}. Distinct = 2 = k. Count++ → count = 2.

State: map = {1:2, 2:1}, distinct = 2, count = 2

**Step 5: i = 0, j = 3, subarray [1, 2, 1, 2]**

Add 2. map = {1:2, 2:2}. Distinct = 2 = k. Count++ → count = 3.

State: map = {1:2, 2:2}, distinct = 2, count = 3

**Step 6: i = 0, j = 4, subarray [1, 2, 1, 2, 3]**

Add 3. map = {1:2, 2:2, 3:1}. Distinct = 3 ≠ 2. Not counted. We can optionally break since distinct > k (any extension adds more).

**Step 7: Continue for i = 1 through i = 4**

i=1: [2]→1, [2,1]→2✓, [2,1,2]→2✓, [2,1,2,3]→3. Count += 2 → count = 5.
i=2: [1]→1, [1,2]→2✓, [1,2,3]→3. Count += 1 → count = 6.
i=3: [2]→1, [2,3]→2✓. Count += 1 → count = 7.
i=4: [3]→1. Count += 0.

Final count = 7.

**Correctness argument:** Every subarray is checked. We correctly count distinct elements for each. The count is incremented only when distinct equals exactly k.

**Key invariant:** The frequency map accurately reflects the contents of nums[i..j] at each iteration.

**Common mistakes:**
1. Using a set instead of a map — when you move to the next i, you'd need to rebuild the set from scratch each time, losing the ability to do incremental updates.
2. Not resetting the map for each new starting index i.

**30-second interview pitch:** "I enumerate all n² subarrays, track distinct count with a HashMap, and increment the answer when distinct equals k. It works but is O(n²). The optimal approach uses the atMost(k) - atMost(k-1) trick with sliding window for O(n)."

## Brute Force In-depth Intuition

This is the direct simulation. The key realization that makes brute force slightly smarter is that as we extend j for a fixed i, the number of distinct elements only increases (or stays the same). So if distinct exceeds k, we can break the inner loop early. However, when distinct drops below k or fluctuates, we still need to check each new j. The frequency map allows incremental updates as j moves right, avoiding recounting from scratch. Despite this, the two nested loops make it O(n²) in the worst case (e.g., when all elements are the same and k = 1).

## Brute Force Algorithm

```
function subarraysWithKDistinct(nums, k):
    n = nums.length
    count = 0

    for i = 0 to n - 1:
        map = new HashMap()
        for j = i to n - 1:
            map[nums[j]] = map.getOrDefault(nums[j], 0) + 1
            if map.size() == k:
                count++
            else if map.size() > k:
                break

    return count
```

The outer loop picks the start. The inner loop extends the end, maintaining a frequency map. When distinct count equals k, we count. When it exceeds k, we break early since adding more elements cannot reduce the distinct count.

## Brute Force Code

```java
class Solution {
    public int subarraysWithKDistinct(int[] nums, int k) {
        int n = nums.length;
        int count = 0;

        for (int i = 0; i < n; i++) {
            Map<Integer, Integer> map = new HashMap<>();
            for (int j = i; j < n; j++) {
                map.put(nums[j], map.getOrDefault(nums[j], 0) + 1);
                if (map.size() == k) {
                    count++;
                } else if (map.size() > k) {
                    break; // can't go back to exactly k by extending
                }
            }
        }
        return count;
    }
}
```

## Brute Force Complexity

**Time: O(n²)** — Two nested loops, each up to n iterations. The HashMap operations are O(1). In the best case (all same elements, k = 1), every subarray is valid and we iterate through all n² pairs. In many cases the break-early optimization helps, but worst-case is quadratic.

**Space: O(n)** — The HashMap stores up to n distinct values in the worst case (though typically bounded by the alphabet size).

## Brute Force Hints

1. Start with the simplest approach: check every subarray.
2. How can you count distinct elements efficiently as you extend the subarray by one element?
3. If distinct count exceeds k, can extending the subarray further ever bring it back to k?
4. Use a HashMap for incremental frequency tracking.
5. The answer is the total number of subarrays where map.size() == k.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz3-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz3-grid{grid-template-columns:1fr}}
.viz3-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz3-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz3-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Array & Subarray</div>
      <svg id="svg3" width="100%" viewBox="0 0 500 120"></svg>
    </div>
    <div class="viz3-state" id="state3"></div>
    <div class="viz3-code" id="code3"></div>
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
    { name: "[1,2,1,2,3] k=2", data: [1,2,1,2,3], k: 2 },
    { name: "[1,2,1,3,4] k=3", data: [1,2,1,3,4], k: 3 },
    { name: "[1,1,1] k=1", data: [1,1,1], k: 1 }
];

const CODE_LINES_3 = [
    "for i = 0 to n-1:",
    "    map = new HashMap()",
    "    for j = i to n-1:",
    "        map[nums[j]] += 1",
    "        if map.size() == k: count++",
    "        else if map.size() > k: break"
];

let steps3 = [], stepIdx3 = -1, autoInt3 = null, tcIdx3 = 0;

function buildSteps3(tc) {
    steps3 = [];
    const nums = tc.data, k = tc.k, n = nums.length;
    let count = 0;
    steps3.push({ msg: "Initialize count=0", vars: { i:"-", j:"-", count:0, distinct:"-", "map":"{}" }, changed: new Set(["count"]), codeLine: -1, explanation: "We will enumerate all subarrays and count those with exactly k distinct integers.", color: "#71717a", hl: {} });
    for (let i = 0; i < n; i++) {
        const map = {};
        steps3.push({ msg: `i=${i}: new start`, vars: { i, j:"-", count, distinct:0, map:"{}" }, changed: new Set(["i","map"]), codeLine: 1, explanation: `Start checking subarrays beginning at index ${i}. Reset the frequency map.`, color: "#4f8ff7", hl: { [i]: "#4f8ff7" } });
        for (let j = i; j < n; j++) {
            map[nums[j]] = (map[nums[j]] || 0) + 1;
            const dist = Object.keys(map).length;
            const mapStr = JSON.stringify(map);
            const hl = {};
            for (let x = i; x <= j; x++) hl[x] = dist === k ? '#22c55e' : (dist > k ? '#ef4444' : '#4f8ff7');
            if (dist === k) {
                count++;
                steps3.push({ msg: `  [${i},${j}]=${JSON.stringify(nums.slice(i,j+1))} dist=${dist}=k ✓ count=${count}`, vars: { i, j, count, distinct:dist, map:mapStr }, changed: new Set(["j","count","map","distinct"]), codeLine: 4, explanation: `Subarray [${i},${j}] = [${nums.slice(i,j+1)}] has ${dist} distinct integers which equals k=${k}. Count incremented to ${count}.`, color: "#22c55e", hl });
            } else if (dist > k) {
                steps3.push({ msg: `  [${i},${j}] dist=${dist} > k=${k}, BREAK`, vars: { i, j, count, distinct:dist, map:mapStr }, changed: new Set(["j","map","distinct"]), codeLine: 5, explanation: `Subarray [${i},${j}] has ${dist} distinct integers which exceeds k=${k}. Break inner loop.`, color: "#ef4444", hl });
                break;
            } else {
                steps3.push({ msg: `  [${i},${j}] dist=${dist} < k`, vars: { i, j, count, distinct:dist, map:mapStr }, changed: new Set(["j","map","distinct"]), codeLine: 3, explanation: `Subarray [${i},${j}] has only ${dist} distinct integers, less than k=${k}. Not counted, continue extending.`, color: "#71717a", hl });
            }
        }
    }
    steps3.push({ msg: `Answer: ${count}`, vars: { count }, changed: new Set(["count"]), codeLine: -1, explanation: `All subarrays checked. Total with exactly k=${tc.k} distinct = ${count}.`, color: "#fbbf24", hl: {} });
    stepIdx3 = 0;
}

function render3() {
    const s = steps3[stepIdx3];
    if (!s) return;
    const nums = TCS_3[tcIdx3].data;
    const boxW = 48, boxH = 40, gap = 4, startX = 20, startY = 30;
    let svg = '';
    for (let i = 0; i < nums.length; i++) {
        const x = startX + i * (boxW + gap);
        svg += `<text x="${x + boxW/2}" y="${startY - 8}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color = s.hl[i] || '#2a2a33';
        const tc2 = s.hl[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6" fill="${color}" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svg += `<text x="${x + boxW/2}" y="${startY + boxH/2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${nums[i]}</text>`;
    }
    document.getElementById('svg3').innerHTML = svg;
    let html = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(s.vars).forEach(([name, value]) => {
        const changed = s.changed.has(name);
        const bg = changed ? 'rgba(251,191,36,0.1)' : 'transparent';
        const nc = changed ? '#fbbf24' : '#52525b';
        const vc = changed ? '#fbbf24' : '#b8b8be';
        html += `<tr style="background:${bg}"><td style="padding:4px 10px;color:${nc};font-weight:600;width:40%">${name}</td><td style="padding:4px 10px;color:${vc}">${value}${changed ? ' ← changed' : ''}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('state3').innerHTML = html;
    let codeHtml = '';
    CODE_LINES_3.forEach((line, i) => {
        const isActive = i === s.codeLine;
        const bg = isActive ? 'rgba(79,143,247,0.15)' : 'transparent';
        const color = isActive ? '#93c5fd' : '#3f3f46';
        codeHtml += `<div style="padding:2px 8px;border-radius:4px;background:${bg};color:${color};font-weight:${isActive?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    document.getElementById('code3').innerHTML = codeHtml;
    let logHtml = '';
    for (let i = 0; i <= stepIdx3; i++) {
        const marker = i === stepIdx3 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps3[i].color}">${marker}${steps3[i].msg}</div>`;
    }
    document.getElementById('log3').innerHTML = logHtml;
    document.getElementById('log3').scrollTop = 99999;
    document.getElementById('expl3').innerHTML = s.explanation;
    document.getElementById('stepLabel3').textContent = `Step ${stepIdx3 + 1} / ${steps3.length}`;
    document.getElementById('prev3').disabled = stepIdx3 <= 0;
    document.getElementById('next3').disabled = stepIdx3 >= steps3.length - 1;
}

function next3() { if (stepIdx3 < steps3.length - 1) { stepIdx3++; render3(); } }
function prev3() { if (stepIdx3 > 0) { stepIdx3--; render3(); } }
function toggleAuto3() {
    if (autoInt3) { clearInterval(autoInt3); autoInt3 = null; document.getElementById('auto3').textContent = '▶ Auto'; }
    else { autoInt3 = setInterval(() => { if (stepIdx3 >= steps3.length - 1) { toggleAuto3(); return; } next3(); }, 800); document.getElementById('auto3').textContent = '⏸ Pause'; }
}
function loadTc3(idx) {
    tcIdx3 = idx; stepIdx3 = 0;
    if (autoInt3) toggleAuto3();
    buildSteps3(TCS_3[idx]);
    document.querySelectorAll('[data-tc3]').forEach((b, i) => { b.className = i === idx ? 'viz3-btn active' : 'viz3-btn'; });
    render3();
}

const tcBar3El = document.getElementById('tcBar3');
TCS_3.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'viz3-btn active' : 'viz3-btn';
    b.setAttribute('data-tc3', '');
    b.onclick = () => loadTc3(i);
    tcBar3El.appendChild(b);
});
buildSteps3(TCS_3[0]); render3();
</script>
</div>

## Optimal Intuition

The key insight: **exactly(k) = atMost(k) - atMost(k-1)**. The `atMost(k)` function counts all subarrays with ≤ k distinct integers using a standard sliding window. For a valid window [left, right] with ≤ k distinct, the number of valid subarrays ending at `right` is `right - left + 1` (all subarrays [left, right], [left+1, right], ..., [right, right]). We call this function twice and subtract.

## Optimal Step-by-Step Solution

Let's trace atMost(2) and atMost(1) for nums = [1,2,1,2,3], k = 2.

**Tracing atMost(2):**

**Step 1: right=0, num=1**

Code executing: `map[1]++ → map={1:1}, size=1 ≤ 2`

Window [0,0]. Subarrays ending here with ≤2 distinct: [1] → count += 1. Total = 1.

**Step 2: right=1, num=2**

map = {1:1, 2:1}, size=2 ≤ 2. Window [0,1]. count += 2 (subarrays [1,2] and [2]). Total = 3.

**Step 3: right=2, num=1**

map = {1:2, 2:1}, size=2 ≤ 2. Window [0,2]. count += 3. Total = 6.

**Step 4: right=3, num=2**

map = {1:2, 2:2}, size=2 ≤ 2. Window [0,3]. count += 4. Total = 10.

**Step 5: right=4, num=3**

map = {1:2, 2:2, 3:1}, size=3 > 2! Shrink: remove nums[0]=1 → map={1:1, 2:2, 3:1}, size=3 > 2. Remove nums[1]=2 → map={1:1, 2:1, 3:1}, size=3 > 2. Remove nums[2]=1 → map={2:1, 3:1}, size=2 ≤ 2. left=3. Window [3,4]. count += 2. Total = 12.

**atMost(2) = 12.**

**Tracing atMost(1):** Similar logic gives atMost(1) = 5 (subarrays with ≤1 distinct: [1],[2],[1],[2],[3],[1,1] — wait, no repeated values at adjacent positions here. Actually for [1,2,1,2,3]: each single element gives 1 subarray with 1 distinct = 5 total single elements. No pairs have just 1 distinct. So atMost(1) = 5.)

**Answer = atMost(2) - atMost(1) = 12 - 5 = 7.** ✓

**Correctness argument:** atMost(k) counts subarrays with 0, 1, 2, ..., or k distinct integers. atMost(k-1) counts those with 0, 1, ..., k-1. The difference is exactly those with k distinct.

**Key invariant:** In the atMost sliding window, the window [left, right] always has ≤ goal distinct integers after shrinking, and left is the smallest valid starting position for this right.

**Common mistakes:**
1. Trying to count exactly k directly with a single sliding window — this doesn't work because the window might jump over valid states.
2. Forgetting that for the atMost helper, each right endpoint contributes `right - left + 1` subarrays, not just 1.
3. Off-by-one: calling atMost(k) - atMost(k-1), not atMost(k) - atMost(k).

**30-second interview pitch:** "I use the identity exactly(k) = atMost(k) - atMost(k-1). The atMost function is a standard sliding window: expand right, shrink left when distinct exceeds the goal, and each right endpoint contributes (right - left + 1) valid subarrays. Two passes of O(n) each gives O(n) total."

## Optimal In-depth Intuition

Why can't we do "exactly k" with a single sliding window? Because when the window has exactly k distinct integers, we can't just count the single window — there may be multiple valid left positions. We'd need to track a range of valid lefts, which gets complicated. The atMost subtraction trick elegantly sidesteps this by converting the problem into two standard "at most" problems.

The magic of counting `right - left + 1` at each step: consider a window [left, right]. Every subarray that ends at `right` and starts anywhere from `left` to `right` is valid (all have ≤ goal distinct). That's exactly `right - left + 1` subarrays. This counting is the key insight that makes the sliding window give us the total count, not just a single window.

The two calls to atMost share the same structure — only the parameter changes. This makes the implementation clean: write one helper function and call it twice.

## Optimal Algorithm

```
function subarraysWithKDistinct(nums, k):
    return atMost(nums, k) - atMost(nums, k - 1)

function atMost(nums, goal):
    if goal == 0: return 0
    n = nums.length
    map = new HashMap()
    left = 0, count = 0

    for right = 0 to n - 1:
        map[nums[right]] = map.getOrDefault(nums[right], 0) + 1

        while map.size() > goal:
            leftVal = nums[left]
            map[leftVal] -= 1
            if map[leftVal] == 0: map.remove(leftVal)
            left++

        count += right - left + 1   // all subarrays ending at right

    return count
```

The atMost helper maintains a sliding window where distinct ≤ goal. For each right endpoint, it adds all valid subarrays ending there. The main function subtracts to get exactly k.

## Optimal Code

```java
class Solution {
    public int subarraysWithKDistinct(int[] nums, int k) {
        return atMost(nums, k) - atMost(nums, k - 1);
    }

    private int atMost(int[] nums, int goal) {
        if (goal == 0) return 0;
        int n = nums.length;
        Map<Integer, Integer> map = new HashMap<>();
        int left = 0, count = 0;

        for (int right = 0; right < n; right++) {
            map.put(nums[right], map.getOrDefault(nums[right], 0) + 1);

            while (map.size() > goal) {
                int leftVal = nums[left];
                map.put(leftVal, map.get(leftVal) - 1);
                if (map.get(leftVal) == 0) {
                    map.remove(leftVal);
                }
                left++;
            }

            count += right - left + 1; // count all valid subarrays ending at right
        }
        return count;
    }
}
```

## Optimal Complexity

**Time: O(n)** — The atMost function runs in O(n) because left and right each traverse the array at most once. We call atMost twice, so total is O(2n) = O(n). HashMap operations are O(1) amortized.

**Space: O(n)** — The HashMap can store up to n distinct values. In practice, since nums[i] ≤ nums.length, we could use an array of size n+1 instead for O(1) lookups and O(n) space.

## Optimal Hints

1. Counting "exactly k" directly with a sliding window is tricky. Can you decompose it into simpler subproblems?
2. Think: how many subarrays have at most k distinct integers? How about at most k-1?
3. exactly(k) = atMost(k) - atMost(k-1). Now you just need to solve "at most k distinct".
4. In a sliding window for "at most k distinct", when the window [left, right] is valid, how many subarrays ending at right are also valid?
5. Each valid right endpoint contributes (right - left + 1) subarrays — all those starting from left to right.
6. Write a helper function atMost(nums, goal) and call it twice.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz4-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz4-grid{grid-template-columns:1fr}}
.viz4-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz4-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz4-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz4-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz4-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz4-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">atMost(k) Sliding Window</div>
      <svg id="svg4" width="100%" viewBox="0 0 500 160"></svg>
    </div>
    <div class="viz4-state" id="state4"></div>
    <div class="viz4-code" id="code4"></div>
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
const TCS_4 = [
    { name: "[1,2,1,2,3] k=2", data: [1,2,1,2,3], k: 2 },
    { name: "[1,2,1,3,4] k=3", data: [1,2,1,3,4], k: 3 },
    { name: "[1,1,1] k=1", data: [1,1,1], k: 1 }
];

const CODE_LINES_4 = [
    "// atMost(k) pass",
    "map[nums[right]] += 1",
    "while map.size() > goal:",
    "    remove nums[left]; left++",
    "count += right - left + 1",
    "// atMost(k-1) pass",
    "// answer = atMost(k) - atMost(k-1)"
];

let steps4 = [], stepIdx4 = -1, autoInt4 = null, tcIdx4 = 0;

function runAtMost(nums, goal, label, steps, startColor) {
    const n = nums.length;
    const map = {};
    let left = 0, count = 0;
    steps.push({ msg: `--- ${label} (goal=${goal}) ---`, vars: { phase: label, left:0, right:"-", count:0, "map":"{}","map.size":0, goal }, changed: new Set(["phase"]), codeLine: goal === steps[0]?.vars?.goal ? 0 : 5, explanation: `Starting ${label} pass. We count all subarrays with at most ${goal} distinct integers.`, color: "#71717a", hl: {}, ptrs: {} });
    for (let right = 0; right < n; right++) {
        map[nums[right]] = (map[nums[right]] || 0) + 1;
        const mapStr = JSON.stringify(map);
        const hl = {}; for (let x = left; x <= right; x++) hl[x] = startColor;
        steps.push({ msg: `  R=${right}: add ${nums[right]}, map=${mapStr}`, vars: { phase:label, left, right, count, map:mapStr, "map.size":Object.keys(map).length, goal }, changed: new Set(["right","map","map.size"]), codeLine: 1, explanation: `Add nums[${right}]=${nums[right]} to window. Map now has ${Object.keys(map).length} distinct.`, color: startColor, hl, ptrs: {[left]:"L",[right]:"R"} });
        while (Object.keys(map).length > goal) {
            const lv = nums[left];
            map[lv]--;
            if (map[lv] === 0) delete map[lv];
            left++;
            const mapStr2 = JSON.stringify(map);
            const hl2 = {}; for (let x = left; x <= right; x++) hl2[x] = '#fbbf24';
            steps.push({ msg: `    shrink L=${left}, map=${mapStr2}`, vars: { phase:label, left, right, count, map:mapStr2, "map.size":Object.keys(map).length, goal }, changed: new Set(["left","map","map.size"]), codeLine: 3, explanation: `Shrink: removed ${lv}, left=${left}. ${Object.keys(map).length} distinct now.`, color: "#fbbf24", hl: hl2, ptrs: {[left]:"L",[right]:"R"} });
        }
        const add = right - left + 1;
        count += add;
        const hl3 = {}; for (let x = left; x <= right; x++) hl3[x] = '#22c55e';
        steps.push({ msg: `  count += ${add} → ${count}`, vars: { phase:label, left, right, count, map:JSON.stringify(map), "map.size":Object.keys(map).length, goal, "subarrays added": add }, changed: new Set(["count","subarrays added"]), codeLine: 4, explanation: `Window [${left},${right}] valid. ${add} subarrays end at R=${right}. Running count = ${count}.`, color: "#22c55e", hl: hl3, ptrs: {[left]:"L",[right]:"R"} });
    }
    return count;
}

function buildSteps4(tc) {
    steps4 = [];
    const nums = tc.data, k = tc.k;
    steps4.push({ msg: `exactly(${k}) = atMost(${k}) - atMost(${k-1})`, vars: { formula: `atMost(${k}) - atMost(${k-1})` }, changed: new Set(["formula"]), codeLine: 6, explanation: `We decompose "exactly ${k}" into two "at most" calls.`, color: "#71717a", hl: {}, ptrs: {} });
    const a = runAtMost(nums, k, `atMost(${k})`, steps4, '#4f8ff7');
    steps4.push({ msg: `atMost(${k}) = ${a}`, vars: { [`atMost(${k})`]: a }, changed: new Set([`atMost(${k})`]), codeLine: 0, explanation: `First pass complete. ${a} subarrays have at most ${k} distinct.`, color: "#4f8ff7", hl: {}, ptrs: {} });
    const b = runAtMost(nums, k - 1, `atMost(${k-1})`, steps4, '#a78bfa');
    steps4.push({ msg: `atMost(${k-1}) = ${b}`, vars: { [`atMost(${k-1})`]: b }, changed: new Set([`atMost(${k-1})`]), codeLine: 5, explanation: `Second pass complete. ${b} subarrays have at most ${k-1} distinct.`, color: "#a78bfa", hl: {}, ptrs: {} });
    steps4.push({ msg: `Answer = ${a} - ${b} = ${a - b}`, vars: { [`atMost(${k})`]: a, [`atMost(${k-1})`]: b, answer: a - b }, changed: new Set(["answer"]), codeLine: 6, explanation: `exactly(${k}) = ${a} - ${b} = ${a - b}. That's our answer!`, color: "#fbbf24", hl: {}, ptrs: {} });
    stepIdx4 = 0;
}

function render4() {
    const s = steps4[stepIdx4];
    if (!s) return;
    const nums = TCS_4[tcIdx4].data;
    const boxW = 48, boxH = 40, gap = 4, startX = 20, startY = 30;
    let svg = '';
    for (let i = 0; i < nums.length; i++) {
        const x = startX + i * (boxW + gap);
        svg += `<text x="${x + boxW/2}" y="${startY - 8}" text-anchor="middle" font-size="10" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color = (s.hl && s.hl[i]) || '#2a2a33';
        const tc2 = s.hl && s.hl[i] ? '#fafaf9' : '#a1a1aa';
        svg += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6" fill="${color}" stroke="${color === '#2a2a33' ? '#3f3f46' : color}" stroke-width="1.5"/>`;
        svg += `<text x="${x + boxW/2}" y="${startY + boxH/2 + 1}" text-anchor="middle" dominant-baseline="central" font-size="16" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${nums[i]}</text>`;
    }
    if (s.ptrs) {
        Object.entries(s.ptrs).forEach(([idx, label]) => {
            const x = startX + parseInt(idx) * (boxW + gap);
            const c = label === 'L' ? '#4f8ff7' : '#fbbf24';
            svg += `<text x="${x + boxW/2}" y="${startY + boxH + 16}" text-anchor="middle" font-size="10" font-weight="600" fill="${c}" font-family="JetBrains Mono,monospace">${label}</text>`;
        });
    }
    document.getElementById('svg4').innerHTML = svg;
    let html = '<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(s.vars).forEach(([name, value]) => {
        const changed = s.changed.has(name);
        const bg = changed ? 'rgba(251,191,36,0.1)' : 'transparent';
        html += `<tr style="background:${bg}"><td style="padding:4px 10px;color:${changed?'#fbbf24':'#52525b'};font-weight:600;width:40%">${name}</td><td style="padding:4px 10px;color:${changed?'#fbbf24':'#b8b8be'}">${value}${changed?' ← changed':''}</td></tr>`;
    });
    html += '</table>';
    document.getElementById('state4').innerHTML = html;
    let codeHtml = '';
    CODE_LINES_4.forEach((line, i) => {
        const isActive = i === s.codeLine;
        codeHtml += `<div style="padding:2px 8px;border-radius:4px;background:${isActive?'rgba(79,143,247,0.15)':'transparent'};color:${isActive?'#93c5fd':'#3f3f46'};font-weight:${isActive?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    document.getElementById('code4').innerHTML = codeHtml;
    let logHtml = '';
    for (let i = 0; i <= stepIdx4; i++) {
        const marker = i === stepIdx4 ? '▶ ' : '  ';
        logHtml += `<div style="color:${steps4[i].color}">${marker}${steps4[i].msg}</div>`;
    }
    document.getElementById('log4').innerHTML = logHtml;
    document.getElementById('log4').scrollTop = 99999;
    document.getElementById('expl4').innerHTML = s.explanation;
    document.getElementById('stepLabel4').textContent = `Step ${stepIdx4 + 1} / ${steps4.length}`;
    document.getElementById('prev4').disabled = stepIdx4 <= 0;
    document.getElementById('next4').disabled = stepIdx4 >= steps4.length - 1;
}

function next4() { if (stepIdx4 < steps4.length - 1) { stepIdx4++; render4(); } }
function prev4() { if (stepIdx4 > 0) { stepIdx4--; render4(); } }
function toggleAuto4() {
    if (autoInt4) { clearInterval(autoInt4); autoInt4 = null; document.getElementById('auto4').textContent = '▶ Auto'; }
    else { autoInt4 = setInterval(() => { if (stepIdx4 >= steps4.length - 1) { toggleAuto4(); return; } next4(); }, 1000); document.getElementById('auto4').textContent = '⏸ Pause'; }
}
function loadTc4(idx) {
    tcIdx4 = idx; stepIdx4 = 0;
    if (autoInt4) toggleAuto4();
    buildSteps4(TCS_4[idx]);
    document.querySelectorAll('[data-tc4]').forEach((b, i) => { b.className = i === idx ? 'viz4-btn active' : 'viz4-btn'; });
    render4();
}

const tcBar4El = document.getElementById('tcBar4');
TCS_4.forEach((tc, i) => {
    const b = document.createElement('button');
    b.textContent = tc.name;
    b.className = i === 0 ? 'viz4-btn active' : 'viz4-btn';
    b.setAttribute('data-tc4', '');
    b.onclick = () => loadTc4(i);
    tcBar4El.appendChild(b);
});
buildSteps4(TCS_4[0]); render4();
</script>
</div>
