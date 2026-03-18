# Minimum Window Substring

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/minimum-window-substring/

## Description

Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.

The answer is guaranteed to be unique.

**Input:** Two strings `s` and `t` where 1 ≤ m, n ≤ 10⁵, consisting of uppercase and lowercase English letters.

**Output:** A string — the minimum window in `s` that contains all characters of `t`, or `""` if none exists.

**Constraints:**
- 1 ≤ s.length, t.length ≤ 10⁵
- s and t consist of uppercase and lowercase English letters

**Example 1:**
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The window "BANC" (indices 9-12) contains 'A', 'B', 'C'. No shorter window contains all three.

**Example 2:**
Input: s = "a", t = "a"
Output: "a"
Explanation: The entire string is the minimum window.

**Example 3:**
Input: s = "a", t = "aa"
Output: ""
Explanation: Both 'a's from t must be present. s has only one 'a', so no valid window exists.

**Edge Cases:**
- t longer than s → always return ""
- t is a single character → find first occurrence
- s and t are identical → return s
- t has duplicate characters → window must contain each with at least that frequency

## In-depth Explanation

**Reframe:** Find the shortest contiguous window in `s` that has at least the required frequency for every character in `t`.

**Pattern recognition:** This is the **minimum-length sliding window** pattern. Unlike "longest" window problems where we expand greedily and update, here we want the SHORTEST valid window. So we expand until valid, then shrink to find the minimum, recording the best. Keywords: "minimum window", "contains all characters" — classic minimum sliding window.

**Real-world analogy:** You're reading a newspaper, looking for the shortest passage that mentions all the keywords in a search query (with the right frequencies). You'd start reading from the beginning, marking when you've found all keywords, then try to trim the start of your passage to make it shorter while still containing all keywords.

**Why naive fails:** Checking all O(m²) substrings of s and verifying each contains all characters of t (O(n)) gives O(m² × n), which is way too slow for m = 10⁵.

**Approach roadmap:**
- **Brute Force:** Check all substrings of length ≥ t.length, verify coverage — O(m² × n).
- **Optimal (Sliding Window):** Expand right until valid, shrink left to minimize — O(m + n).

**Interview cheat sheet:**
- Keywords: "minimum window", "contains all characters", "substring"
- Different from "longest substring" — here we expand to satisfy, then shrink to minimize
- The "aha moment": Track a `formed` counter that counts how many UNIQUE characters in t have met their required frequency. When formed == required, the window is valid.
- Memory hook: "Expand to satisfy, shrink to minimize, track 'formed' vs 'required'"

## Brute Force Intuition

Check every possible substring of `s` that is at least as long as `t`. For each, verify it contains all characters of `t` with proper frequencies using a frequency comparison. Track the shortest valid substring found. This is O(m²) substrings times O(m + n) per check.

## Brute Force Step-by-Step Solution

Let's trace s = "ADOBECODEBANC", t = "ABC".

**Step 1: Build target frequency map**

Code executing: `for (char c : t.toCharArray()) tMap.put(c, ...)`

We need t's frequencies: tMap = {'A':1, 'B':1, 'C':1}. We need all three characters.

State: tMap = {A:1, B:1, C:1}, minLen = ∞, result = ""

**Step 2: i = 0, try substrings starting at 'A'**

Code executing: `Map<Character, Integer> wMap = new HashMap<>();`

Start building frequency map for substrings starting at index 0.

**Step 3: i = 0, j = 4 (substring "ADOBE")**

wMap = {A:1, D:1, O:1, B:1, E:1}. Check if wMap contains all of tMap: A:1≥1 ✓, B:1≥1 ✓, C? Not present ✗. Not valid.

**Step 4: i = 0, j = 5 (substring "ADOBEC")**

wMap adds C. wMap = {A:1, D:1, O:1, B:1, E:1, C:1}. Check: A ✓, B ✓, C ✓. VALID! Length = 6. minLen = 6, result = "ADOBEC".

**Step 5: Continue for all i values**

For i = 0: shortest valid is "ADOBEC" (len 6). For i = 9: "BANC" (len 4) is valid. After checking all, result = "BANC" with len 4.

We continue checking all starting positions and find shorter windows. The substring "BANC" starting at index 9 has length 4 and contains A, B, C — it's the shortest.

State: result = "BANC", minLen = 4

**Correctness argument:** We enumerate every substring and verify character coverage. Since we check all possibilities, we must find the minimum. The frequency map comparison ensures duplicate characters in t are properly accounted for.

**Key invariant:** wMap always reflects the exact character frequencies of s[i..j].

**Common mistakes:**
1. Checking only set membership (ignoring duplicates) — t = "aa" requires two 'a's.
2. Not considering all starting positions — the minimum window might start anywhere.

**30-second interview pitch:** "For every starting index in s, I extend the substring until it contains all characters of t with proper frequencies, then track the minimum length. It's O(m²) so I'd optimize to O(m) with a sliding window that expands and shrinks."

## Brute Force In-depth Intuition

The brute force is straightforward but inefficient. For each starting position i, we could extend j and maintain a frequency map incrementally (adding s[j] at each step), then check if all requirements of t are met. The check itself can be done in O(|t|) by comparing maps, or we can optimize it with a `formed` counter. But even with these optimizations, we have O(m) starting positions and up to O(m) extension for each, giving O(m²). The key inefficiency is that when we move from starting position i to i+1, we throw away all the work and start building the window frequency map from scratch, instead of reusing the existing window.

## Brute Force Algorithm

```
function minWindow(s, t):
    if t.length > s.length: return ""
    tMap = frequency map of t
    required = tMap.size()   // unique chars needed
    minLen = infinity, result = ""

    for i = 0 to m - 1:
        wMap = new HashMap()
        formed = 0
        for j = i to m - 1:
            c = s[j]
            wMap[c] = wMap.getOrDefault(c, 0) + 1
            if tMap.containsKey(c) and wMap[c] == tMap[c]:
                formed++
            if formed == required:
                if j - i + 1 < minLen:
                    minLen = j - i + 1
                    result = s[i..j]
                break   // first valid j for this i is smallest

    return result
```

For each start i, we extend j until the window contains all of t, then record the length. We break at the first valid j because any longer window from the same start is worse.

## Brute Force Code

```java
class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";
        Map<Character, Integer> tMap = new HashMap<>();
        for (char c : t.toCharArray()) {
            tMap.put(c, tMap.getOrDefault(c, 0) + 1);
        }
        int required = tMap.size();
        int minLen = Integer.MAX_VALUE;
        int minStart = 0;

        for (int i = 0; i < s.length(); i++) {
            Map<Character, Integer> wMap = new HashMap<>();
            int formed = 0;
            for (int j = i; j < s.length(); j++) {
                char c = s.charAt(j);
                wMap.put(c, wMap.getOrDefault(c, 0) + 1);
                if (tMap.containsKey(c) && wMap.get(c).intValue() == tMap.get(c).intValue()) {
                    formed++;
                }
                if (formed == required) {
                    if (j - i + 1 < minLen) {
                        minLen = j - i + 1;
                        minStart = i;
                    }
                    break; // found shortest from this start
                }
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
```

## Brute Force Complexity

**Time: O(m² × 1) ≈ O(m²)** — The outer loop runs m times. For each, the inner loop runs up to m times. The map operations and `formed` counter are O(1). With the break optimization, some iterations are shorter, but worst case is O(m²) (e.g., when t's characters only appear at the end of s).

**Space: O(m + n)** — wMap stores at most m unique characters, tMap stores at most n unique characters. In practice, bounded by 52 (uppercase + lowercase letters).

## Brute Force Hints

1. First, build a frequency map for t — you need to know what and how many of each character you're looking for.
2. For each starting position i, extend j and maintain a running frequency map.
3. Use a `formed` counter to track how many unique characters have met their required count.
4. When `formed == required`, you've found the shortest valid window starting at i.
5. Track the global minimum across all starting positions.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz5-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz5-grid{grid-template-columns:1fr}}
.viz5-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz5-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz5-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz5-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz5-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz5-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">String & Window</div>
      <svg id="svg5" width="100%" viewBox="0 0 700 120"></svg>
    </div>
    <div class="viz5-state" id="state5"></div>
    <div class="viz5-code" id="code5"></div>
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
const TCS_5 = [
    { name: "ADOBECODEBANC, ABC", s: "ADOBECODEBANC", t: "ABC" },
    { name: "a, a", s: "a", t: "a" },
    { name: "a, aa", s: "a", t: "aa" }
];

const CODE_LINES_5 = [
    "tMap = freq(t); required = tMap.size()",
    "for i = 0 to m-1:",
    "    wMap = {}; formed = 0",
    "    for j = i to m-1:",
    "        wMap[s[j]]++",
    "        if wMap[c]==tMap[c]: formed++",
    "        if formed==required: update min, break"
];

let steps5=[], stepIdx5=-1, autoInt5=null, tcIdx5=0;

function buildSteps5(tc) {
    steps5=[];
    const s=tc.s, t=tc.t, m=s.length;
    const tMap={};
    for(const c of t) tMap[c]=(tMap[c]||0)+1;
    const required=Object.keys(tMap).length;
    let minLen=Infinity, minStart=0;

    steps5.push({msg:`tMap=${JSON.stringify(tMap)}, required=${required}`,vars:{tMap:JSON.stringify(tMap),required,minLen:"∞",result:"\"\""},changed:new Set(["tMap","required"]),codeLine:0,explanation:`Built frequency map for t="${t}". Need ${required} unique character(s) at required frequencies.`,color:"#71717a",hl:{}});

    for(let i=0;i<m;i++){
        const wMap={};
        let formed=0;
        steps5.push({msg:`i=${i}: start at '${s[i]}'`,vars:{i,j:"-",formed:0,wMap:"{}",minLen:minLen===Infinity?"∞":minLen,result:minLen===Infinity?"\"\"":s.substring(minStart,minStart+minLen)},changed:new Set(["i","wMap","formed"]),codeLine:2,explanation:`Try substrings starting at index ${i} ('${s[i]}'). Reset window map.`,color:"#4f8ff7",hl:{[i]:"#4f8ff7"}});
        for(let j=i;j<m;j++){
            const c=s[j];
            wMap[c]=(wMap[c]||0)+1;
            if(tMap[c]!==undefined && wMap[c]===tMap[c]) formed++;
            const hl={};
            for(let x=i;x<=j;x++) hl[x]=formed===required?'#22c55e':'#4f8ff7';
            if(formed===required){
                if(j-i+1<minLen){minLen=j-i+1;minStart=i;}
                steps5.push({msg:`  j=${j}: formed! window="${s.substring(i,j+1)}" len=${j-i+1}`,vars:{i,j,formed,wMap:JSON.stringify(wMap),minLen,result:s.substring(minStart,minStart+minLen)},changed:new Set(["j","formed","minLen","result"]),codeLine:6,explanation:`All required characters found! Window "${s.substring(i,j+1)}" has length ${j-i+1}. ${j-i+1<=minLen?"New best!":"Not better than current best."}`,color:"#22c55e",hl});
                break;
            }
            if(j-i<3||(j===m-1)){
                steps5.push({msg:`  j=${j}: '${c}' formed=${formed}/${required}`,vars:{i,j,formed,wMap:JSON.stringify(wMap),minLen:minLen===Infinity?"∞":minLen},changed:new Set(["j","wMap"]),codeLine:4,explanation:`Added '${c}'. ${formed} of ${required} characters satisfied so far.`,color:"#71717a",hl});
            }
        }
        if(i>3&&i<m-2) continue; // skip middle iterations for brevity in viz
    }
    steps5.push({msg:`Answer: "${minLen===Infinity?"":s.substring(minStart,minStart+minLen)}"`,vars:{minLen:minLen===Infinity?"∞":minLen,result:minLen===Infinity?"\"\"":s.substring(minStart,minStart+minLen)},changed:new Set(["result"]),codeLine:-1,explanation:`Final answer: ${minLen===Infinity?"No valid window exists.":"\""+s.substring(minStart,minStart+minLen)+"\" with length "+minLen+"."}`,color:"#fbbf24",hl:{}});
    stepIdx5=0;
}

function render5(){
    const st=steps5[stepIdx5]; if(!st)return;
    const s=TCS_5[tcIdx5].s;
    const boxW=38,boxH=36,gap=3,startX=10,startY=28;
    let svg='';
    for(let i=0;i<s.length;i++){
        const x=startX+i*(boxW+gap);
        svg+=`<text x="${x+boxW/2}" y="${startY-6}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color=st.hl[i]||'#2a2a33';
        const tc2=st.hl[i]?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${startY+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s[i]}</text>`;
    }
    document.getElementById('svg5').innerHTML=svg;
    let html='<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(st.vars).forEach(([n,v])=>{
        const ch=st.changed.has(n);
        html+=`<tr style="background:${ch?'rgba(251,191,36,0.1)':'transparent'}"><td style="padding:4px 10px;color:${ch?'#fbbf24':'#52525b'};font-weight:600;width:40%">${n}</td><td style="padding:4px 10px;color:${ch?'#fbbf24':'#b8b8be'}">${v}${ch?' ← changed':''}</td></tr>`;
    });
    html+='</table>';
    document.getElementById('state5').innerHTML=html;
    let codeHtml='';
    CODE_LINES_5.forEach((line,i)=>{
        const isA=i===st.codeLine;
        codeHtml+=`<div style="padding:2px 8px;border-radius:4px;background:${isA?'rgba(79,143,247,0.15)':'transparent'};color:${isA?'#93c5fd':'#3f3f46'};font-weight:${isA?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;
    });
    document.getElementById('code5').innerHTML=codeHtml;
    let logHtml='';
    for(let i=0;i<=stepIdx5;i++){const mk=i===stepIdx5?'▶ ':'  ';logHtml+=`<div style="color:${steps5[i].color}">${mk}${steps5[i].msg}</div>`;}
    document.getElementById('log5').innerHTML=logHtml;
    document.getElementById('log5').scrollTop=99999;
    document.getElementById('expl5').innerHTML=st.explanation;
    document.getElementById('stepLabel5').textContent=`Step ${stepIdx5+1} / ${steps5.length}`;
    document.getElementById('prev5').disabled=stepIdx5<=0;
    document.getElementById('next5').disabled=stepIdx5>=steps5.length-1;
}

function next5(){if(stepIdx5<steps5.length-1){stepIdx5++;render5();}}
function prev5(){if(stepIdx5>0){stepIdx5--;render5();}}
function toggleAuto5(){
    if(autoInt5){clearInterval(autoInt5);autoInt5=null;document.getElementById('auto5').textContent='▶ Auto';}
    else{autoInt5=setInterval(()=>{if(stepIdx5>=steps5.length-1){toggleAuto5();return;}next5();},1000);document.getElementById('auto5').textContent='⏸ Pause';}
}
function loadTc5(idx){
    tcIdx5=idx;stepIdx5=0;if(autoInt5)toggleAuto5();
    buildSteps5(TCS_5[idx]);
    document.querySelectorAll('[data-tc5]').forEach((b,i)=>{b.className=i===idx?'viz5-btn active':'viz5-btn';});
    render5();
}
const tcBar5El=document.getElementById('tcBar5');
TCS_5.forEach((tc,i)=>{
    const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz5-btn active':'viz5-btn';b.setAttribute('data-tc5','');b.onclick=()=>loadTc5(i);tcBar5El.appendChild(b);
});
buildSteps5(TCS_5[0]);render5();
</script>
</div>

## Optimal Intuition

Use a sliding window with `left` and `right` pointers. Maintain a frequency map for the window and a `formed` counter tracking how many unique characters of `t` have met their required count. Expand `right` until the window is valid (formed == required). Then shrink `left` to minimize the window while staying valid. Record the best. This is O(m + n) because each pointer traverses s at most once.

## Optimal Step-by-Step Solution

Let's trace s = "ADOBECODEBANC", t = "ABC".

**Step 1: Build tMap**

Code executing: `for (char c : t.toCharArray()) tMap.put(c, ...)`

tMap = {'A':1, 'B':1, 'C':1}. required = 3 (need 3 unique characters at their frequencies).

State: tMap = {A:1, B:1, C:1}, required = 3, left = 0, formed = 0

**Step 2: right = 0, char 'A'**

Code executing: `wMap[c]++; if tMap contains c and wMap[c] == tMap[c]: formed++`

wMap = {'A':1}. 'A' is in tMap and wMap['A'] (1) == tMap['A'] (1), so formed = 1.

State: left = 0, right = 0, wMap = {A:1}, formed = 1/3

**Step 3: right = 1 through 4 ('D', 'O', 'B', 'E')**

right=1: wMap = {A:1, D:1}, 'D' not in tMap, formed stays 1.
right=2: wMap = {A:1, D:1, O:1}, formed = 1.
right=3: wMap = {A:1, D:1, O:1, B:1}, 'B' in tMap, wMap['B']==tMap['B'], formed = 2.
right=4: wMap = {A:1, D:1, O:1, B:1, E:1}, formed = 2.

**Step 4: right = 5, char 'C'**

wMap = {A:1, D:1, O:1, B:1, E:1, C:1}. 'C' in tMap, wMap['C']==tMap['C'], formed = 3 = required!

Window "ADOBEC" [0,5] is VALID. Length = 6. Record: minLen = 6, minStart = 0.

Now SHRINK from left:

**Shrink 1:** left = 0 ('A'). wMap['A'] = 0. Since wMap['A'] < tMap['A'], formed drops to 2. left = 1. Window no longer valid. Stop shrinking.

State: left = 1, right = 5, formed = 2, best = "ADOBEC" (6)

**Step 5: right = 6 through 8 ('O', 'D', 'E')**

None are in tMap, formed stays 2.

**Step 6: right = 9, char 'B'**

Already have B:1 (from index 3 was removed during shrink? Let me re-trace more carefully).

Actually, let me re-trace: after shrink in step 4, left=1, wMap = {D:1, O:1, B:1, E:1, C:1}. formed=2 (B and C satisfied, A not).

right=6 'O': wMap = {D:1, O:2, B:1, E:1, C:1}. formed=2.
right=7 'D': wMap = {D:2, O:2, B:1, E:1, C:1}. formed=2.
right=8 'E': wMap = {D:2, O:2, B:1, E:2, C:1}. formed=2.
right=9 'B': wMap = {D:2, O:2, B:2, E:2, C:1}. formed=2 (B was already satisfied).
right=10 'A': wMap = {D:2, O:2, B:2, E:2, C:1, A:1}. 'A' in tMap, wMap['A']==tMap['A']=1, formed=3=required!

Window [1, 10] = "DOBECODEБА" length 10. Current best is 6, so not better. But now SHRINK:

**Shrink:** left=1 'D', not in tMap → left=2. left=2 'O' → left=3. left=3 'B', in tMap, wMap['B']=2→1, still ≥ 1 → left=4. left=4 'E' → left=5. left=5 'C', in tMap, wMap['C']=1→0 < 1, formed drops to 2. Stop. left=6.

Best window during this shrink was [5,10]="CODEBA" len=6. Not better.

**Step 7: right = 11, char 'N'**

Not in tMap. formed=2.

**Step 8: right = 12, char 'C'**

wMap['C']=0→1. wMap['C']==tMap['C']=1, formed=3=required!

Window [6,12]. Shrink: left=6 'O' → left=7. 'D' → left=8. 'E' → left=9. 'B', wMap['B']=2→1≥1 → left=10. 'A', wMap['A']=1→0<1, formed=2. Stop. left=10 was the last valid left.

Wait, we need to record before incrementing past valid. Window [9,12]="BANC" len=4 < 6 = new best! minLen=4, result="BANC".

**Correctness argument:** The right pointer ensures we consider every possible right boundary. The left pointer ensures we find the tightest (leftmost valid left) for each right boundary. Together, they explore all minimal windows.

**Key invariant:** After shrinking, left is the leftmost position where the window is NO LONGER valid. So the last valid window was [left-1, right] during the shrink.

**Common mistakes:**
1. Not decrementing `formed` when shrinking causes a character count to drop BELOW the required amount (only decrement when it transitions from exactly meeting to no longer meeting).
2. Using `wMap[c] >= tMap[c]` instead of `==` for incrementing formed — you should only increment when the count first reaches the required amount.

**30-second interview pitch:** "Build a frequency map for t. Use two pointers on s: expand right until the window contains all of t (tracked via a 'formed' counter vs 'required'). Then shrink left to minimize, recording the shortest valid window. Each character enters and leaves once, so it's O(m + n)."

## Optimal In-depth Intuition

The algorithm exploits two observations: (1) If [left, right] doesn't contain all characters of t, then [left+1, right] also doesn't, so we must expand right. (2) If [left, right] does contain all of t, then [left, right+1] also does, so we should try shrinking left. This means left and right both move monotonically forward, giving linear time.

The `formed` counter is the efficiency key. Instead of comparing full frequency maps every step (O(52)), we maintain a running count of how many unique characters have met their requirement. We increment `formed` only at the exact moment a character count reaches its target, and decrement only when it drops below. This gives O(1) validity checking.

A subtle point: when shrinking, we must update the answer BEFORE checking if the window becomes invalid, because the current window (before removing the left character) is the one we want to record.

## Optimal Algorithm

```
function minWindow(s, t):
    tMap = frequency map of t
    required = tMap.size()
    wMap = new HashMap()
    formed = 0
    left = 0
    minLen = infinity, minStart = 0

    for right = 0 to m - 1:
        c = s[right]
        wMap[c] = wMap.getOrDefault(c, 0) + 1
        if tMap.containsKey(c) and wMap[c] == tMap[c]:
            formed++

        while formed == required:
            // current window is valid — try to record and shrink
            if right - left + 1 < minLen:
                minLen = right - left + 1
                minStart = left
            leftChar = s[left]
            wMap[leftChar] -= 1
            if tMap.containsKey(leftChar) and wMap[leftChar] < tMap[leftChar]:
                formed--
            left++

    return minLen == infinity ? "" : s[minStart .. minStart+minLen-1]
```

The for loop expands right. The while loop shrinks left as long as the window is valid, recording the minimum each time. The formed counter provides O(1) validity checking.

## Optimal Code

```java
class Solution {
    public String minWindow(String s, String t) {
        if (t.length() > s.length()) return "";

        Map<Character, Integer> tMap = new HashMap<>();
        for (char c : t.toCharArray()) {
            tMap.put(c, tMap.getOrDefault(c, 0) + 1);
        }
        int required = tMap.size(); // unique chars needed

        Map<Character, Integer> wMap = new HashMap<>();
        int formed = 0; // chars meeting required frequency
        int left = 0;
        int minLen = Integer.MAX_VALUE, minStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            wMap.put(c, wMap.getOrDefault(c, 0) + 1);

            // Check if this character's count now meets the requirement
            if (tMap.containsKey(c) && wMap.get(c).intValue() == tMap.get(c).intValue()) {
                formed++;
            }

            // Shrink window while valid
            while (formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }

                char leftChar = s.charAt(left);
                wMap.put(leftChar, wMap.get(leftChar) - 1);
                if (tMap.containsKey(leftChar) && wMap.get(leftChar) < tMap.get(leftChar)) {
                    formed--;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
```

## Optimal Complexity

**Time: O(m + n)** — Building tMap is O(n). The main loop: right traverses s once (m steps). Left also traverses at most m steps total (each character removed at most once). So total is O(m + n). All map operations are O(1) since the alphabet is bounded.

**Space: O(m + n)** — tMap stores up to n unique characters, wMap stores up to m unique characters. With a bounded alphabet (52 chars), both are effectively O(1).

## Optimal Hints

1. You need two frequency maps: one for t (target) and one for the current window.
2. Instead of comparing maps fully each time, use a `formed` counter for O(1) validity checking.
3. Expand right until the window is valid (formed == required).
4. Then shrink from left while still valid, recording the minimum window each time.
5. Only increment `formed` when a character count first reaches its target — not when it exceeds it.
6. Only decrement `formed` when a character count drops below its target during shrinking.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz6-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz6-grid{grid-template-columns:1fr}}
.viz6-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz6-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz6-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz6-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz6-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz6-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Sliding Window on s</div>
      <svg id="svg6" width="100%" viewBox="0 0 700 130"></svg>
    </div>
    <div class="viz6-state" id="state6"></div>
    <div class="viz6-code" id="code6"></div>
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
const TCS_6=[
    {name:"ADOBECODEBANC,ABC",s:"ADOBECODEBANC",t:"ABC"},
    {name:"a, a",s:"a",t:"a"},
    {name:"a, aa",s:"a",t:"aa"}
];
const CODE_LINES_6=[
    "wMap[s[right]]++",
    "if wMap[c]==tMap[c]: formed++",
    "while formed==required:",
    "    update min window",
    "    wMap[s[left]]--",
    "    if wMap[c]<tMap[c]: formed--",
    "    left++"
];
let steps6=[],stepIdx6=-1,autoInt6=null,tcIdx6=0;

function buildSteps6(tc){
    steps6=[];
    const s=tc.s,t=tc.t,m=s.length;
    const tMap={};
    for(const c of t) tMap[c]=(tMap[c]||0)+1;
    const required=Object.keys(tMap).length;
    const wMap={};
    let formed=0,left=0,minLen=Infinity,minStart=0;

    steps6.push({msg:`tMap=${JSON.stringify(tMap)}, req=${required}`,vars:{left:0,right:"-",formed:"0/"+required,minLen:"∞",best:"\"\"",wMap:"{}"},changed:new Set(["formed"]),codeLine:-1,explanation:`Target: need ${required} unique character(s) from t="${t}" at required frequencies.`,color:"#71717a",hl:{},ptrs:{}});

    for(let right=0;right<m;right++){
        const c=s[right];
        wMap[c]=(wMap[c]||0)+1;
        let formedNow=false;
        if(tMap[c]!==undefined&&wMap[c]===tMap[c]){formed++;formedNow=true;}

        const hl={};for(let x=left;x<=right;x++)hl[x]=formed===required?'#22c55e':'#4f8ff7';
        steps6.push({msg:`R=${right} '${c}' ${formedNow?'→ formed='+formed:''}`,vars:{left,right,formed:formed+"/"+required,minLen:minLen===Infinity?"∞":minLen,best:minLen===Infinity?"\"\"":s.substring(minStart,minStart+minLen),wMap:JSON.stringify(wMap)},changed:new Set(["right","wMap",formedNow?"formed":""]),codeLine:formedNow?1:0,explanation:`Added '${c}'. ${formedNow?`This character now meets its target! formed=${formed}.`:`formed unchanged at ${formed}.`}`,color:formedNow?"#22c55e":"#4f8ff7",hl,ptrs:{[left]:"L",[right]:"R"}});

        while(formed===required){
            if(right-left+1<minLen){minLen=right-left+1;minStart=left;}
            const hl2={};for(let x=left;x<=right;x++)hl2[x]='#22c55e';
            steps6.push({msg:`  VALID [${left},${right}]="${s.substring(left,right+1)}" len=${right-left+1}`,vars:{left,right,formed:formed+"/"+required,minLen,best:s.substring(minStart,minStart+minLen),wMap:JSON.stringify(wMap)},changed:new Set(["minLen","best"]),codeLine:3,explanation:`Window [${left},${right}]="${s.substring(left,right+1)}" is valid! Length ${right-left+1}. Best so far: "${s.substring(minStart,minStart+minLen)}" (${minLen}).`,color:"#22c55e",hl:hl2,ptrs:{[left]:"L",[right]:"R"}});

            const lc=s[left];
            wMap[lc]--;
            if(wMap[lc]===0) delete wMap[lc];
            let lostFormed=false;
            if(tMap[lc]!==undefined&&(wMap[lc]||0)<tMap[lc]){formed--;lostFormed=true;}
            left++;
            const hl3={};for(let x=left;x<=right;x++)hl3[x]='#fbbf24';
            steps6.push({msg:`  shrink: drop '${lc}', L=${left} ${lostFormed?'formed='+formed:''}`,vars:{left,right,formed:formed+"/"+required,minLen,best:s.substring(minStart,minStart+minLen),wMap:JSON.stringify(wMap)},changed:new Set(["left","wMap",lostFormed?"formed":""]),codeLine:lostFormed?5:4,explanation:`Removed '${lc}' from left. ${lostFormed?`Lost required character! formed dropped to ${formed}. Window invalid.`:"Still valid, keep shrinking."}`,color:lostFormed?"#ef4444":"#fbbf24",hl:hl3,ptrs:{[left]:"L",[right]:"R"}});
        }
    }
    const ans=minLen===Infinity?"":s.substring(minStart,minStart+minLen);
    steps6.push({msg:`Answer: "${ans}"`,vars:{minLen:minLen===Infinity?"∞":minLen,answer:`"${ans}"`},changed:new Set(["answer"]),codeLine:-1,explanation:minLen===Infinity?"No valid window found.":"Minimum window: \""+ans+"\" with length "+minLen+".",color:"#fbbf24",hl:{},ptrs:{}});
    stepIdx6=0;
}

function render6(){
    const st=steps6[stepIdx6];if(!st)return;
    const s=TCS_6[tcIdx6].s;
    const boxW=38,boxH=36,gap=3,startX=10,startY=28;
    let svg='';
    for(let i=0;i<s.length;i++){
        const x=startX+i*(boxW+gap);
        svg+=`<text x="${x+boxW/2}" y="${startY-6}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color=st.hl[i]||'#2a2a33';
        const tc2=st.hl[i]?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${startY+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s[i]}</text>`;
    }
    if(st.ptrs){Object.entries(st.ptrs).forEach(([idx,label])=>{
        const x=startX+parseInt(idx)*(boxW+gap);
        svg+=`<text x="${x+boxW/2}" y="${startY+boxH+14}" text-anchor="middle" font-size="9" font-weight="600" fill="${label==='L'?'#4f8ff7':'#fbbf24'}" font-family="JetBrains Mono,monospace">${label}</text>`;
    });}
    document.getElementById('svg6').innerHTML=svg;
    let html='<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(st.vars).forEach(([n,v])=>{const ch=st.changed.has(n);html+=`<tr style="background:${ch?'rgba(251,191,36,0.1)':'transparent'}"><td style="padding:4px 10px;color:${ch?'#fbbf24':'#52525b'};font-weight:600;width:40%">${n}</td><td style="padding:4px 10px;color:${ch?'#fbbf24':'#b8b8be'}">${v}${ch?' ← changed':''}</td></tr>`;});
    html+='</table>';document.getElementById('state6').innerHTML=html;
    let codeHtml='';CODE_LINES_6.forEach((line,i)=>{const isA=i===st.codeLine;codeHtml+=`<div style="padding:2px 8px;border-radius:4px;background:${isA?'rgba(79,143,247,0.15)':'transparent'};color:${isA?'#93c5fd':'#3f3f46'};font-weight:${isA?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;});
    document.getElementById('code6').innerHTML=codeHtml;
    let logHtml='';for(let i=0;i<=stepIdx6;i++){logHtml+=`<div style="color:${steps6[i].color}">${i===stepIdx6?'▶ ':'  '}${steps6[i].msg}</div>`;}
    document.getElementById('log6').innerHTML=logHtml;document.getElementById('log6').scrollTop=99999;
    document.getElementById('expl6').innerHTML=st.explanation;
    document.getElementById('stepLabel6').textContent=`Step ${stepIdx6+1} / ${steps6.length}`;
    document.getElementById('prev6').disabled=stepIdx6<=0;document.getElementById('next6').disabled=stepIdx6>=steps6.length-1;
}
function next6(){if(stepIdx6<steps6.length-1){stepIdx6++;render6();}}
function prev6(){if(stepIdx6>0){stepIdx6--;render6();}}
function toggleAuto6(){if(autoInt6){clearInterval(autoInt6);autoInt6=null;document.getElementById('auto6').textContent='▶ Auto';}else{autoInt6=setInterval(()=>{if(stepIdx6>=steps6.length-1){toggleAuto6();return;}next6();},1000);document.getElementById('auto6').textContent='⏸ Pause';}}
function loadTc6(idx){tcIdx6=idx;stepIdx6=0;if(autoInt6)toggleAuto6();buildSteps6(TCS_6[idx]);document.querySelectorAll('[data-tc6]').forEach((b,i)=>{b.className=i===idx?'viz6-btn active':'viz6-btn';});render6();}
const tcBar6El=document.getElementById('tcBar6');
TCS_6.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz6-btn active':'viz6-btn';b.setAttribute('data-tc6','');b.onclick=()=>loadTc6(i);tcBar6El.appendChild(b);});
buildSteps6(TCS_6[0]);render6();
</script>
</div>

---

# Minimum Window Subsequence

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/minimum-window-subsequence/

## Description

Given strings `s1` and `s2`, return the minimum contiguous substring part of `s1`, such that `s2` is a subsequence of the part. If there is no such window in `s1` that covers all characters in `s2`, return the empty string `""`. If there are multiple such minimum-length windows, return the one with the left-most starting index.

**Input:** Two strings `s1` and `s2` where 1 ≤ s1.length ≤ 2 × 10⁴ and 1 ≤ s2.length ≤ 100.

**Output:** A string — the minimum window in s1 that contains s2 as a subsequence.

**Constraints:**
- 1 ≤ s1.length ≤ 2 × 10⁴
- 1 ≤ s2.length ≤ 100
- s1 and s2 consist of lowercase English letters

**Example 1:**
Input: s1 = "abcdebdde", s2 = "bde"
Output: "bcde"
Explanation: "bcde" (indices 1-4) is the shortest substring of s1 where "bde" is a subsequence: b→d→e all appear in order. Another valid window is "bdde" (indices 5-8) but "bcde" is shorter and starts earlier.

**Example 2:**
Input: s1 = "jmeqksfrsdcmsiwvaovztaqenprpvnbstl", s2 = "u"
Output: ""
Explanation: 'u' does not exist in s1.

**Edge Cases:**
- s2 is a single character → find first occurrence in s1
- s2 doesn't exist as subsequence in s1 → return ""
- s1 == s2 → return s1
- Multiple windows of same length → return leftmost

## In-depth Explanation

**Reframe:** Find the shortest contiguous substring of s1 such that we can select characters from it (in order, not necessarily contiguous) to form s2.

**Pattern recognition:** This is a **two-pointer / sliding window with subsequence matching** problem. It combines the idea of subsequence checking (normally O(n)) with finding the optimal window. The sliding window approach here has a twist: after finding a valid window by scanning forward, we scan backward to tighten the left boundary.

**Real-world analogy:** Imagine you're watching a long movie (s1) and you have a checklist of scenes you need to see in order (s2). You start watching from the beginning, checking off scenes as they appear. Once you've seen all scenes, you rewind from the end backward to find the earliest possible start — this gives you the shortest clip containing all the scenes in order.

**Why naive fails:** Checking all O(m²) substrings and verifying each as a supersequence of s2 is O(m² × (m + n)), far too slow.

**Approach roadmap:**
- **Brute Force:** For each start, try to match s2 as subsequence — O(m × (m + n)).
- **Optimal (Forward-Backward Sliding Window):** Scan forward to find end, then backward to tighten start — O(m × n) worst case.

**Interview cheat sheet:**
- Keywords: "minimum window", "subsequence" (not substring — order matters but not contiguity)
- Different from Minimum Window Substring (which just checks character frequencies, not order)
- The "aha moment": After finding the end of a valid window, scan backward from end to tighten the start. This gives the shortest window ending at that position.
- Memory hook: "Forward to find, backward to tighten, track the shortest"

## Brute Force Intuition

For each starting position i in s1, try to match all of s2 as a subsequence by scanning forward. If we successfully match all characters of s2, we've found a valid window [i, j]. Track the shortest such window. This is O(m²) in the worst case since each starting position might scan to the end of s1.

## Brute Force Step-by-Step Solution

Let's trace s1 = "abcdebdde", s2 = "bde".

**Step 1: i = 0, starting at 'a'**

Code executing: `int j = i, t = 0;` then scan forward.

Start at i=0. We need to match s2[0]='b', s2[1]='d', s2[2]='e' in order.
- j=0: 'a' ≠ 'b'. Move j.
- j=1: 'b' = 'b' ✓. t becomes 1. Now look for 'd'.
- j=2: 'c' ≠ 'd'. Move j.
- j=3: 'd' = 'd' ✓. t becomes 2. Now look for 'e'.
- j=4: 'e' = 'e' ✓. t becomes 3. All matched!

Window [0, 4] = "abcde", length 5. Record minLen = 5, minStart = 0.

State: minLen = 5, result = "abcde"

**Step 2: i = 1, starting at 'b'**

- j=1: 'b' = 'b' ✓. t=1.
- j=2: 'c' ≠ 'd'. Move.
- j=3: 'd' = 'd' ✓. t=2.
- j=4: 'e' = 'e' ✓. t=3. All matched!

Window [1, 4] = "bcde", length 4 < 5. New best! minLen = 4, minStart = 1.

State: minLen = 4, result = "bcde"

**Step 3: i = 2, starting at 'c'**

- j=2: 'c' ≠ 'b'. j=3: 'd' ≠ 'b'. j=4: 'e' ≠ 'b'. j=5: 'b' = 'b' ✓. t=1.
- j=6: 'd' = 'd' ✓. t=2.
- j=7: 'd' ≠ 'e'. j=8: 'e' = 'e' ✓. t=3.

Window [2, 8] = "cdebdde", length 7 > 4. Not better.

**Steps 4-8: i = 3 through 8**

i=3: first 'b' is at j=5, then d at 6, e at 8. Window length 6. Not better.
i=4: 'e' ≠ 'b'. First 'b' at j=5, d at 6, e at 8. Window length 5. Not better.
i=5: 'b'=b, j=6 'd'=d, j=7 'd'≠'e', j=8 'e'=e. Window [5,8]="bdde" length 4. Equal to best, but starts later, so keep "bcde".
i=6,7,8: Can't complete s2. No valid window.

Final answer: "bcde".

**Correctness argument:** We try every starting position and for each find the earliest ending position that completes s2 as a subsequence. The shortest across all starting positions is the answer.

**Key invariant:** For each starting i, the forward scan finds the EARLIEST possible end j. Combined with trying all i's, we're guaranteed to find the optimal window.

**Common mistakes:**
1. Not trying all starting positions — the optimal window might start at any index.
2. Returning the first valid window found instead of the shortest — must track the minimum.

**30-second interview pitch:** "For each starting index i in s1, I scan forward to find the earliest j where s2 is a subsequence of s1[i..j]. I track the shortest valid window. This is O(m²) worst case but correct. The optimal approach adds a backward scan to tighten the start."

## Brute Force In-depth Intuition

The key insight for the brute force is that subsequence matching is greedy: to check if s2 is a subsequence of some string, we match characters from left to right, always taking the earliest match. This greedy strategy is optimal because taking an earlier match for s2[i] can only help (not hurt) matching s2[i+1] later. So for each starting position i in s1, the forward scan finds the tightest possible ending position. The inefficiency is that adjacent starting positions share a lot of overlapping work — the optimal approach addresses this.

## Brute Force Algorithm

```
function minWindowSubsequence(s1, s2):
    m = s1.length, n = s2.length
    minLen = infinity, minStart = -1

    for i = 0 to m - 1:
        t = 0     // pointer into s2
        for j = i to m - 1:
            if s1[j] == s2[t]:
                t++
            if t == n:   // all of s2 matched
                if j - i + 1 < minLen:
                    minLen = j - i + 1
                    minStart = i
                break

    return minStart == -1 ? "" : s1[minStart .. minStart+minLen-1]
```

The outer loop tries every starting position. The inner loop scans forward greedily matching characters of s2. When all characters matched, we record the window if it's the shortest.

## Brute Force Code

```java
class Solution {
    public String minWindow(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int minLen = Integer.MAX_VALUE, minStart = -1;

        for (int i = 0; i < m; i++) {
            int t = 0; // pointer into s2
            for (int j = i; j < m; j++) {
                if (s1.charAt(j) == s2.charAt(t)) {
                    t++;
                }
                if (t == n) { // all of s2 matched
                    if (j - i + 1 < minLen) {
                        minLen = j - i + 1;
                        minStart = i;
                    }
                    break;
                }
            }
        }
        return minStart == -1 ? "" : s1.substring(minStart, minStart + minLen);
    }
}
```

## Brute Force Complexity

**Time: O(m × m)** — For each of m starting positions, the inner loop scans up to m characters. In the worst case (e.g., s1 = "aaaa...a", s2 = "aa"), nearly every starting position scans to the end. With n being small (≤ 100), the subsequence matching is fast, but we repeat it m times.

**Space: O(1)** — Only constant extra space for pointers and tracking variables.

## Brute Force Hints

1. Subsequence matching is greedy — always match the next character of s2 as early as possible.
2. For each starting index i in s1, find the earliest j where s2 is a subsequence of s1[i..j].
3. The shortest window across all starting positions is the answer.
4. You can break out of the inner loop as soon as all of s2 is matched.
5. If s2[0] doesn't appear after position i, skip that starting position.

## Brute Force Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz7-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz7-grid{grid-template-columns:1fr}}
.viz7-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz7-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz7-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz7-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz7-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz7-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
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
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">s1 array + s2 matching</div>
      <svg id="svg7" width="100%" viewBox="0 0 550 150"></svg>
    </div>
    <div class="viz7-state" id="state7"></div>
    <div class="viz7-code" id="code7"></div>
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
    {name:"abcdebdde, bde",s1:"abcdebdde",s2:"bde"},
    {name:"abcde, ace",s1:"abcde",s2:"ace"},
    {name:"xyz, a",s1:"xyz",s2:"a"}
];
const CODE_LINES_7=["for i = 0 to m-1:","    t = 0","    for j = i to m-1:","        if s1[j]==s2[t]: t++","        if t==n: record, break"];
let steps7=[],stepIdx7=-1,autoInt7=null,tcIdx7=0;

function buildSteps7(tc){
    steps7=[];
    const s1=tc.s1,s2=tc.s2,m=s1.length,n=s2.length;
    let minLen=Infinity,minStart=-1;
    steps7.push({msg:`Find shortest window in "${s1}" containing "${s2}" as subsequence`,vars:{minLen:"∞",result:"\"\""},changed:new Set([]),codeLine:-1,explanation:`We try each starting position in s1 and greedily match s2 forward.`,color:"#71717a",hl:{},s2hl:[]});

    for(let i=0;i<m;i++){
        let t=0;
        const hl={};hl[i]='#4f8ff7';
        steps7.push({msg:`i=${i}: start at '${s1[i]}', looking for s2[0]='${s2[0]}'`,vars:{i,j:i,t:0,"s2[t]":s2[0],minLen:minLen===Infinity?"∞":minLen},changed:new Set(["i","t"]),codeLine:1,explanation:`Try starting at index ${i}. Need to match '${s2[0]}' first.`,color:"#4f8ff7",hl,s2hl:[]});
        let found=false;
        for(let j=i;j<m;j++){
            const matched=s1[j]===s2[t];
            if(matched) t++;
            const hl2={};for(let x=i;x<=j;x++)hl2[x]='#4f8ff7';
            if(matched)hl2[j]='#22c55e';
            const s2hlArr=[];for(let x=0;x<t;x++)s2hlArr.push(x);

            if(t===n){
                found=true;
                if(j-i+1<minLen){minLen=j-i+1;minStart=i;}
                steps7.push({msg:`  j=${j}: '${s1[j]}' matched! ALL DONE. Window="${s1.substring(i,j+1)}" len=${j-i+1}`,vars:{i,j,t,minLen,result:s1.substring(minStart,minStart+minLen)},changed:new Set(["t","minLen","result"]),codeLine:4,explanation:`All of s2 matched! Window [${i},${j}]="${s1.substring(i,j+1)}" length ${j-i+1}. Best: "${s1.substring(minStart,minStart+minLen)}" (${minLen}).`,color:"#22c55e",hl:hl2,s2hl:s2hlArr});
                break;
            }
            if(matched||j===i||j===m-1){
                steps7.push({msg:`  j=${j}: '${s1[j]}' ${matched?'= s2['+(t-1)+"]='" +s2[t-1]+"' ✓":'≠ s2['+t+"]='" +s2[t]+"'"}`,vars:{i,j,t,"s2[t]":t<n?s2[t]:"-",minLen:minLen===Infinity?"∞":minLen},changed:new Set(matched?["t","s2[t]"]:["j"]),codeLine:3,explanation:matched?`Matched '${s1[j]}' with s2[${t-1}]. Now need s2[${t}]${t<n?"='"+s2[t]+"'":""}.`:`'${s1[j]}' doesn't match s2[${t}]='${s2[t]}'. Keep scanning.`,color:matched?"#22c55e":"#71717a",hl:hl2,s2hl:s2hlArr});
            }
        }
        if(!found&&(i<3||i>=m-2)){
            steps7.push({msg:`  i=${i}: couldn't complete s2`,vars:{i,minLen:minLen===Infinity?"∞":minLen},changed:new Set([]),codeLine:0,explanation:`Starting from index ${i}, couldn't match all of s2 before end of s1.`,color:"#ef4444",hl:{},s2hl:[]});
        }
    }
    const ans=minStart===-1?"":s1.substring(minStart,minStart+minLen);
    steps7.push({msg:`Answer: "${ans}"`,vars:{minLen:minLen===Infinity?"∞":minLen,answer:`"${ans}"`},changed:new Set(["answer"]),codeLine:-1,explanation:minStart===-1?"No valid window found — s2 is not a subsequence of any part of s1.":"Minimum window subsequence: \""+ans+"\" with length "+minLen+".",color:"#fbbf24",hl:{},s2hl:[]});
    stepIdx7=0;
}

function render7(){
    const st=steps7[stepIdx7];if(!st)return;
    const s1=TCS_7[tcIdx7].s1,s2=TCS_7[tcIdx7].s2;
    const boxW=44,boxH=36,gap=3,startX=15,startY=25;
    let svg='';
    // s1 row
    for(let i=0;i<s1.length;i++){
        const x=startX+i*(boxW+gap);
        svg+=`<text x="${x+boxW/2}" y="${startY-6}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color=st.hl[i]||'#2a2a33';
        const tc2=st.hl[i]?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${startY+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s1[i]}</text>`;
    }
    // s2 row below
    const s2Y=startY+boxH+30;
    svg+=`<text x="${startX}" y="${s2Y-8}" font-size="10" fill="#71717a" font-family="JetBrains Mono,monospace">s2:</text>`;
    for(let i=0;i<s2.length;i++){
        const x=startX+40+i*(boxW+gap);
        const isHl=st.s2hl&&st.s2hl.includes(i);
        const color=isHl?'#22c55e':'#2a2a33';
        const tc2=isHl?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${s2Y}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${s2Y+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s2[i]}</text>`;
    }
    document.getElementById('svg7').innerHTML=svg;
    let html='<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(st.vars).forEach(([n,v])=>{const ch=st.changed.has(n);html+=`<tr style="background:${ch?'rgba(251,191,36,0.1)':'transparent'}"><td style="padding:4px 10px;color:${ch?'#fbbf24':'#52525b'};font-weight:600;width:40%">${n}</td><td style="padding:4px 10px;color:${ch?'#fbbf24':'#b8b8be'}">${v}${ch?' ← changed':''}</td></tr>`;});
    html+='</table>';document.getElementById('state7').innerHTML=html;
    let codeHtml='';CODE_LINES_7.forEach((line,i)=>{const isA=i===st.codeLine;codeHtml+=`<div style="padding:2px 8px;border-radius:4px;background:${isA?'rgba(79,143,247,0.15)':'transparent'};color:${isA?'#93c5fd':'#3f3f46'};font-weight:${isA?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;});
    document.getElementById('code7').innerHTML=codeHtml;
    let logHtml='';for(let i=0;i<=stepIdx7;i++){logHtml+=`<div style="color:${steps7[i].color}">${i===stepIdx7?'▶ ':'  '}${steps7[i].msg}</div>`;}
    document.getElementById('log7').innerHTML=logHtml;document.getElementById('log7').scrollTop=99999;
    document.getElementById('expl7').innerHTML=st.explanation;
    document.getElementById('stepLabel7').textContent=`Step ${stepIdx7+1} / ${steps7.length}`;
    document.getElementById('prev7').disabled=stepIdx7<=0;document.getElementById('next7').disabled=stepIdx7>=steps7.length-1;
}
function next7(){if(stepIdx7<steps7.length-1){stepIdx7++;render7();}}
function prev7(){if(stepIdx7>0){stepIdx7--;render7();}}
function toggleAuto7(){if(autoInt7){clearInterval(autoInt7);autoInt7=null;document.getElementById('auto7').textContent='▶ Auto';}else{autoInt7=setInterval(()=>{if(stepIdx7>=steps7.length-1){toggleAuto7();return;}next7();},1000);document.getElementById('auto7').textContent='⏸ Pause';}}
function loadTc7(idx){tcIdx7=idx;stepIdx7=0;if(autoInt7)toggleAuto7();buildSteps7(TCS_7[idx]);document.querySelectorAll('[data-tc7]').forEach((b,i)=>{b.className=i===idx?'viz7-btn active':'viz7-btn';});render7();}
const tcBar7El=document.getElementById('tcBar7');
TCS_7.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz7-btn active':'viz7-btn';b.setAttribute('data-tc7','');b.onclick=()=>loadTc7(i);tcBar7El.appendChild(b);});
buildSteps7(TCS_7[0]);render7();
</script>
</div>

## Optimal Intuition

Instead of trying every starting position, use a **forward-backward** approach: scan forward through s1 to find the end of a valid window, then scan backward from that end to find the tightest possible start. This gives the shortest window ending at each position. Then advance the start and repeat to find the next window.

## Optimal Step-by-Step Solution

Let's trace s1 = "abcdebdde", s2 = "bde".

**Step 1: Forward scan from i = 0**

Code executing: `while (i < m) { if (s1[i] == s2[j]) j++; if (j == n) break; i++; }`

We scan s1 forward, matching s2 characters greedily:
- i=0 'a' ≠ s2[0]='b'. i++.
- i=1 'b' = 'b' ✓. j=1. i++.
- i=2 'c' ≠ 'd'. i++.
- i=3 'd' = 'd' ✓. j=2. i++.
- i=4 'e' = 'e' ✓. j=3 = n. STOP! End of window found at i=4.

State: end = 4, all of s2 matched

**Step 2: Backward scan from end = 4**

Code executing: `j = n - 1; while (j >= 0) { if (s1[i] == s2[j]) j--; i--; }`

Now scan backward from i=4 to tighten the start:
- i=4 'e' = s2[2]='e' ✓. j=1.
- i=3 'd' = s2[1]='d' ✓. j=0.
- i=2 'c' ≠ s2[0]='b'. i--.
- i=1 'b' = s2[0]='b' ✓. j=-1. Done!

Start = 1. Window [1, 4] = "bcde", length 4. Record as best.

State: start = 1, end = 4, window = "bcde", minLen = 4

**Step 3: Next forward scan from start + 1 = 2**

Reset: i = 2, j = 0. Scan forward:
- i=2 'c' ≠ 'b'. i++.
- i=3 'd' ≠ 'b'. i++.
- i=4 'e' ≠ 'b'. i++.
- i=5 'b' = 'b' ✓. j=1. i++.
- i=6 'd' = 'd' ✓. j=2. i++.
- i=7 'd' ≠ 'e'. i++.
- i=8 'e' = 'e' ✓. j=3 = n. End = 8.

**Step 4: Backward scan from end = 8**

- i=8 'e'='e' ✓. j=1.
- i=7 'd'='d' ✓. j=0.
- i=6 'd' ≠ 'b'. i--.
- i=5 'b'='b' ✓. j=-1. Done!

Start = 5. Window [5, 8] = "bdde", length 4. Same length as best, but starts later so we keep "bcde".

**Step 5: Next forward scan from 6**

Scan forward from i=6: d,d,e — can't find 'b' after position 6 in remaining string (only d, d, e left). Actually i=6 'd', i=7 'd', i=8 'e' — no 'b'. Loop ends without matching all of s2.

Final answer: "bcde".

**Correctness argument:** The forward scan finds the earliest end for a valid window starting at or after position i. The backward scan from that end finds the latest start that still makes s2 a subsequence — which gives the shortest window ending at that end. By advancing start+1 and repeating, we cover all possible optimal windows.

**Key invariant:** After the backward scan, [start, end] is the shortest window ending at `end` where s2 is a subsequence.

**Common mistakes:**
1. Not scanning backward — the forward scan alone gives the end, but the start can be tightened.
2. After backward scan, starting the next forward scan from the wrong position (should be start + 1, not end + 1).
3. Off-by-one in the backward scan — need to include the endpoint.

**30-second interview pitch:** "Scan s1 forward to find where a complete subsequence match of s2 ends. Then scan backward from that end to tighten the start. Record the window if it's the best. Advance to start+1 and repeat. Each character is visited a constant number of times per s2 character, giving O(m × n) overall."

## Optimal In-depth Intuition

The forward-backward technique works because subsequence matching has an optimal substructure: the last character of the match determines the end, and from that end, scanning backward greedily finds the tightest start. Why backward? Because at each position going backward, we must match s2's characters from right to left. Taking the latest possible match for each s2 character (which is what backward greedy does) gives the rightmost — hence closest to end — start position. This minimizes the window length.

This approach is more efficient than brute force because instead of trying every starting position independently, we jump from one optimal window to the next. After finding window [start, end], the next possible shorter window must start after `start`, so we jump to `start + 1`.

An alternative optimal approach uses DP: let dp[i][j] = the largest index l such that s2[0..j] is a subsequence of s1[l..i]. This is O(m × n) time and space.

## Optimal Algorithm

```
function minWindow(s1, s2):
    m = s1.length, n = s2.length
    i = 0, minLen = infinity, minStart = -1

    while i < m:
        // Forward scan: find end of window
        j = 0
        while i < m:
            if s1[i] == s2[j]: j++
            if j == n: break
            i++
        if j < n: break  // no more matches possible

        end = i

        // Backward scan: tighten start
        j = n - 1
        while j >= 0:
            if s1[i] == s2[j]: j--
            i--
        i++  // i now points to start
        start = i

        if end - start + 1 < minLen:
            minLen = end - start + 1
            minStart = start

        i = start + 1  // next search starts after this start

    return minStart == -1 ? "" : s1[minStart .. minStart+minLen-1]
```

Forward scan matches s2 left-to-right in s1. When all matched, backward scan matches s2 right-to-left to find the tightest start. Record the window and advance.

## Optimal Code

```java
class Solution {
    public String minWindow(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int minLen = Integer.MAX_VALUE, minStart = -1;
        int i = 0;

        while (i < m) {
            // Forward scan: match s2 left to right
            int j = 0;
            while (i < m) {
                if (s1.charAt(i) == s2.charAt(j)) {
                    j++;
                }
                if (j == n) break; // all matched
                i++;
            }
            if (j < n) break; // couldn't match all of s2

            int end = i;

            // Backward scan: tighten start
            j = n - 1;
            while (j >= 0) {
                if (s1.charAt(i) == s2.charAt(j)) {
                    j--;
                }
                i--;
            }
            i++; // start of window
            int start = i;

            if (end - start + 1 < minLen) {
                minLen = end - start + 1;
                minStart = start;
            }

            i = start + 1; // advance for next search
        }

        return minStart == -1 ? "" : s1.substring(minStart, minStart + minLen);
    }
}
```

## Optimal Complexity

**Time: O(m × n)** — In the worst case, each character in s1 can be involved in multiple forward and backward scans. Each forward+backward pass takes O(m) in total, and we might do O(m/n) such passes. However, in pathological cases (like s1 = "aaaa...a", s2 = "aa"), each pass covers O(n) forward and O(n) backward, and there are O(m) passes, giving O(m × n). For most practical inputs, it's much faster.

**Space: O(1)** — Only constant extra space for pointers and tracking variables.

## Optimal Hints

1. After matching s2 greedily forward, can you improve the starting position?
2. Think backwards: from the end of a valid window, scan left matching s2's characters in reverse order.
3. The backward scan gives the tightest possible start for a given end.
4. After finding a window [start, end], the next search should start at start + 1, not end + 1.
5. The forward-backward approach finds all locally optimal windows.
6. Each forward pass finds the end, each backward pass finds the start — together they give the shortest window.

## Optimal Visualization

<div style="font-family:system-ui,sans-serif;color:#e4e4e7;max-width:100%">
<style>
.viz8-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}
@media(max-width:700px){.viz8-grid{grid-template-columns:1fr}}
.viz8-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}
.viz8-state{font-family:'JetBrains Mono',monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz8-code{font-family:'JetBrains Mono',monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}
.viz8-log{font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}
.viz8-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}
.viz8-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}
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
<div class="viz8-grid">
  <div>
    <div class="viz8-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Forward-Backward Scan</div>
      <svg id="svg8" width="100%" viewBox="0 0 550 150"></svg>
    </div>
    <div class="viz8-state" id="state8"></div>
    <div class="viz8-code" id="code8"></div>
  </div>
  <div>
    <div class="viz8-card">
      <div style="font-size:10px;color:#52525b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Algorithm Log</div>
      <div class="viz8-log" id="log8"></div>
    </div>
    <div class="viz8-expl" id="expl8"></div>
  </div>
</div>

<script>
const TCS_8=[
    {name:"abcdebdde, bde",s1:"abcdebdde",s2:"bde"},
    {name:"abcde, ace",s1:"abcde",s2:"ace"},
    {name:"xyz, a",s1:"xyz",s2:"a"}
];
const CODE_LINES_8=["// Forward: match s2 left→right","if s1[i]==s2[j]: j++","if j==n: end found!","// Backward: match s2 right→left","if s1[i]==s2[j]: j--","start = i+1; record window","i = start + 1 // next round"];
let steps8=[],stepIdx8=-1,autoInt8=null,tcIdx8=0;

function buildSteps8(tc){
    steps8=[];
    const s1=tc.s1,s2=tc.s2,m=s1.length,n=s2.length;
    let ii=0,minLen=Infinity,minStart=-1;

    steps8.push({msg:`Forward-backward on s1="${s1}", s2="${s2}"`,vars:{phase:"init",minLen:"∞",best:"\"\""},changed:new Set([]),codeLine:-1,explanation:`We will scan forward to find where s2 ends as a subsequence, then backward to tighten the start.`,color:"#71717a",hl:{},s2hl:[],dir:""});

    while(ii<m){
        let j=0,i=ii;
        // Forward
        steps8.push({msg:`FORWARD from i=${i}`,vars:{i,j:0,phase:"forward","looking for":s2[0]},changed:new Set(["phase","i"]),codeLine:0,explanation:`Start forward scan at position ${i}. Looking for s2[0]='${s2[0]}'.`,color:"#4f8ff7",hl:{[i]:"#4f8ff7"},s2hl:[],dir:"→"});

        while(i<m){
            const matched=s1[i]===s2[j];
            if(matched)j++;
            const hl={};hl[i]=matched?'#22c55e':'#71717a';
            const s2hlArr=[];for(let x=0;x<j;x++)s2hlArr.push(x);
            if(j===n){
                steps8.push({msg:`  i=${i}: '${s1[i]}'='${s2[j-1]}' ✓ ALL MATCHED! end=${i}`,vars:{i,j,phase:"forward",end:i},changed:new Set(["j","end"]),codeLine:2,explanation:`Matched last character of s2! End of window at index ${i}. Now scan backward to tighten start.`,color:"#22c55e",hl,s2hl:s2hlArr,dir:"→"});
                break;
            }
            if(matched){
                steps8.push({msg:`  i=${i}: '${s1[i]}'='${s2[j-1]}' ✓ next='${s2[j]}'`,vars:{i,j,phase:"forward","looking for":s2[j]},changed:new Set(["j","looking for"]),codeLine:1,explanation:`Matched s2[${j-1}]='${s2[j-1]}'. Now looking for s2[${j}]='${s2[j]}'.`,color:"#22c55e",hl,s2hl:s2hlArr,dir:"→"});
            }
            i++;
        }
        if(j<n){
            steps8.push({msg:`No more matches possible. Done.`,vars:{minLen:minLen===Infinity?"∞":minLen},changed:new Set([]),codeLine:-1,explanation:`Couldn't match all of s2 from position ${ii}. No more valid windows.`,color:"#ef4444",hl:{},s2hl:[],dir:""});
            break;
        }

        const end=i;
        // Backward
        j=n-1;
        steps8.push({msg:`BACKWARD from end=${end}`,vars:{i:end,j:n-1,phase:"backward","matching":s2[n-1]},changed:new Set(["phase"]),codeLine:3,explanation:`Scan backward from index ${end} to find tightest start. Match s2 right to left.`,color:"#a78bfa",hl:{[end]:"#a78bfa"},s2hl:[n-1],dir:"←"});

        while(j>=0){
            const matched=s1[i]===s2[j];
            if(matched)j--;
            const hl={};for(let x=i;x<=end;x++)hl[x]='#a78bfa';
            hl[i]=matched?'#22c55e':'#a78bfa';
            const s2hlArr=[];for(let x=j+1;x<n;x++)s2hlArr.push(x);
            if(matched&&j>=0){
                steps8.push({msg:`  i=${i}: '${s1[i]}'='${s2[j+1]}' ✓ next='${s2[j]}'`,vars:{i,j:j,phase:"backward","matching":j>=0?s2[j]:"-"},changed:new Set(["j","matching"]),codeLine:4,explanation:`Matched s2[${j+1}] backward. Now looking for s2[${j}]='${s2[j]}'.`,color:"#22c55e",hl,s2hl:s2hlArr,dir:"←"});
            } else if(matched&&j<0){
                steps8.push({msg:`  i=${i}: '${s1[i]}'='${s2[0]}' ✓ START FOUND!`,vars:{i,j:-1,phase:"backward",start:i},changed:new Set(["j","start"]),codeLine:4,explanation:`Matched s2[0]! Start of tightened window at index ${i}.`,color:"#22c55e",hl,s2hl:s2hlArr,dir:"←"});
            }
            i--;
        }
        i++;
        const start=i;
        if(end-start+1<minLen){minLen=end-start+1;minStart=start;}
        const hlW={};for(let x=start;x<=end;x++)hlW[x]='#22c55e';
        const allS2=[];for(let x=0;x<n;x++)allS2.push(x);

        steps8.push({msg:`Window [${start},${end}]="${s1.substring(start,end+1)}" len=${end-start+1}. Best=${minLen}`,vars:{start,end,window:s1.substring(start,end+1),len:end-start+1,minLen,best:s1.substring(minStart,minStart+minLen)},changed:new Set(["window","len","minLen","best"]),codeLine:5,explanation:`Tightened window: [${start},${end}]="${s1.substring(start,end+1)}" length ${end-start+1}. Best so far: "${s1.substring(minStart,minStart+minLen)}" (${minLen}).`,color:"#fbbf24",hl:hlW,s2hl:allS2,dir:""});

        ii=start+1;
        steps8.push({msg:`Next round from i=${ii}`,vars:{nextStart:ii},changed:new Set(["nextStart"]),codeLine:6,explanation:`Advance to start+1=${ii} for next forward scan.`,color:"#71717a",hl:{},s2hl:[],dir:""});
    }

    const ans=minStart===-1?"":s1.substring(minStart,minStart+minLen);
    steps8.push({msg:`ANSWER: "${ans}"`,vars:{answer:`"${ans}"`,minLen:minLen===Infinity?"∞":minLen},changed:new Set(["answer"]),codeLine:-1,explanation:minStart===-1?"No valid window exists.":"Final answer: \""+ans+"\" with length "+minLen+".",color:"#fbbf24",hl:{},s2hl:[],dir:""});
    stepIdx8=0;
}

function render8(){
    const st=steps8[stepIdx8];if(!st)return;
    const s1=TCS_8[tcIdx8].s1,s2=TCS_8[tcIdx8].s2;
    const boxW=44,boxH=36,gap=3,startX=15,startY=25;
    let svg='';
    if(st.dir){svg+=`<text x="${startX+s1.length*(boxW+gap)+10}" y="${startY+boxH/2}" font-size="16" fill="${st.dir==='→'?'#4f8ff7':'#a78bfa'}" font-family="JetBrains Mono,monospace">${st.dir}</text>`;}
    for(let i=0;i<s1.length;i++){
        const x=startX+i*(boxW+gap);
        svg+=`<text x="${x+boxW/2}" y="${startY-6}" text-anchor="middle" font-size="9" fill="#52525b" font-family="JetBrains Mono,monospace">${i}</text>`;
        const color=st.hl[i]||'#2a2a33';
        const tc2=st.hl[i]?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${startY+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s1[i]}</text>`;
    }
    const s2Y=startY+boxH+30;
    svg+=`<text x="${startX}" y="${s2Y-8}" font-size="10" fill="#71717a" font-family="JetBrains Mono,monospace">s2:</text>`;
    for(let i=0;i<s2.length;i++){
        const x=startX+40+i*(boxW+gap);
        const isHl=st.s2hl&&st.s2hl.includes(i);
        const color=isHl?'#22c55e':'#2a2a33';
        const tc2=isHl?'#fafaf9':'#a1a1aa';
        svg+=`<rect x="${x}" y="${s2Y}" width="${boxW}" height="${boxH}" rx="5" fill="${color}" stroke="${color==='#2a2a33'?'#3f3f46':color}" stroke-width="1.5"/>`;
        svg+=`<text x="${x+boxW/2}" y="${s2Y+boxH/2+1}" text-anchor="middle" dominant-baseline="central" font-size="13" font-weight="600" fill="${tc2}" font-family="JetBrains Mono,monospace">${s2[i]}</text>`;
    }
    document.getElementById('svg8').innerHTML=svg;
    let html='<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">';
    Object.entries(st.vars).forEach(([n,v])=>{const ch=st.changed.has(n);html+=`<tr style="background:${ch?'rgba(251,191,36,0.1)':'transparent'}"><td style="padding:4px 10px;color:${ch?'#fbbf24':'#52525b'};font-weight:600;width:40%">${n}</td><td style="padding:4px 10px;color:${ch?'#fbbf24':'#b8b8be'}">${v}${ch?' ← changed':''}</td></tr>`;});
    html+='</table>';document.getElementById('state8').innerHTML=html;
    let codeHtml='';CODE_LINES_8.forEach((line,i)=>{const isA=i===st.codeLine;codeHtml+=`<div style="padding:2px 8px;border-radius:4px;background:${isA?'rgba(79,143,247,0.15)':'transparent'};color:${isA?'#93c5fd':'#3f3f46'};font-weight:${isA?'600':'400'};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre">${line}</div>`;});
    document.getElementById('code8').innerHTML=codeHtml;
    let logHtml='';for(let i=0;i<=stepIdx8;i++){logHtml+=`<div style="color:${steps8[i].color}">${i===stepIdx8?'▶ ':'  '}${steps8[i].msg}</div>`;}
    document.getElementById('log8').innerHTML=logHtml;document.getElementById('log8').scrollTop=99999;
    document.getElementById('expl8').innerHTML=st.explanation;
    document.getElementById('stepLabel8').textContent=`Step ${stepIdx8+1} / ${steps8.length}`;
    document.getElementById('prev8').disabled=stepIdx8<=0;document.getElementById('next8').disabled=stepIdx8>=steps8.length-1;
}
function next8(){if(stepIdx8<steps8.length-1){stepIdx8++;render8();}}
function prev8(){if(stepIdx8>0){stepIdx8--;render8();}}
function toggleAuto8(){if(autoInt8){clearInterval(autoInt8);autoInt8=null;document.getElementById('auto8').textContent='▶ Auto';}else{autoInt8=setInterval(()=>{if(stepIdx8>=steps8.length-1){toggleAuto8();return;}next8();},1000);document.getElementById('auto8').textContent='⏸ Pause';}}
function loadTc8(idx){tcIdx8=idx;stepIdx8=0;if(autoInt8)toggleAuto8();buildSteps8(TCS_8[idx]);document.querySelectorAll('[data-tc8]').forEach((b,i)=>{b.className=i===idx?'viz8-btn active':'viz8-btn';});render8();}
const tcBar8El=document.getElementById('tcBar8');
TCS_8.forEach((tc,i)=>{const b=document.createElement('button');b.textContent=tc.name;b.className=i===0?'viz8-btn active':'viz8-btn';b.setAttribute('data-tc8','');b.onclick=()=>loadTc8(i);tcBar8El.appendChild(b);});
buildSteps8(TCS_8[0]);render8();
</script>
</div>
