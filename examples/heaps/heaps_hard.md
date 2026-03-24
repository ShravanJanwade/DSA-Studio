Top K Frequent Elements
=======================

**Difficulty:** Medium

**LeetCode:** [https://leetcode.com/problems/top-k-frequent-elements/](https://leetcode.com/problems/top-k-frequent-elements/)

**GFG:** [https://www.geeksforgeeks.org/find-k-numbers-occurrences-given-array/](https://www.geeksforgeeks.org/find-k-numbers-occurrences-given-array/)

**YouTube:** [https://youtube.com/watch?v=YPTqKIgVk-k](https://www.google.com/search?q=https://youtube.com/watch?v=YPTqKIgVk-k)

Description
-----------

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

In plain English, imagine you have a bag of colored marbles. You want to figure out which k colors appear most often in the bag. If k=2, you want to find the top two most common colors. The problem asks you to write an algorithm that can take any list of numbers and efficiently return the k numbers that show up the most.

**Input/Output Format:**

*   Input: An integer array nums of length n ($1 \\le n \\le 10^5$), and an integer k ($1 \\le k \\le$ number of unique elements in the array).
    
*   Output: An integer array of length k containing the most frequent elements.
    
*   Constraint Note: It is guaranteed that the answer is unique. The algorithm's time complexity must be better than $O(n \\log n)$, where $n$ is the array's size.
    

**Examples:**

*   **Example 1: The Happy Path**
    
    *   Input: nums = \[1,1,1,2,2,3\], k = 2
        
    *   Output: \[1, 2\]
        
    *   Why: The number 1 appears 3 times. The number 2 appears 2 times. The number 3 appears 1 time. The top 2 most frequent are 1 and 2.
        
*   **Example 2: The Edge Case (Smallest Input)**
    
    *   Input: nums = \[1\], k = 1
        
    *   Output: \[1\]
        
    *   Why: There is only one number, which appears once. It is trivially the most frequent element.
        
*   **Example 3: Tricky Case (Negatives and Ties)**
    
    *   Input: nums = \[-1,-1,2,2,3\], k = 2
        
    *   Output: \[-1, 2\]
        
    *   Why: Both -1 and 2 appear twice, while 3 appears once. The top 2 frequencies belong to -1 and 2. The problem guarantees a unique set of top k frequencies, so we don't need to worry about resolving a tie for the $k$-th spot.
        

**Edge Cases Worth Noting:**

1.  k is exactly equal to the number of unique elements (return all unique elements).
    
2.  The array contains negative numbers (array indices cannot be used directly for counting).
    
3.  The array contains only one distinct element repeated $n$ times.
    

In-depth Explanation
--------------------

This problem asks us to find the "Top K" of something based on a specific attribute (frequency). Strip away the story of the array, and the core task is a two-step data transformation: First, we need to convert raw items into a summarized map of \[item -> count\]. Second, we need to sort or filter that summary to find the top k counts.

**Pattern Recognition:**

The phrase "Top K" is the loudest signal in data structures. Whenever a problem asks for the "Top K", "K-th largest", or "K-th smallest" elements, your brain should immediately scream: **Priority Queue (Heap)**.

*   Clue 1: "Top K" implies we don't need to sort the _entire_ dataset, just maintain a running list of the best k candidates.
    
*   Clue 2: The constraint explicitly demands better than $O(n \\log n)$ time, which directly rules out standard full array sorting, cementing the need for an $O(n \\log k)$ heap or an $O(n)$ bucket sort.
    
*   Clue 3: We are counting occurrences, which immediately signals the need for a Hash Map to tally frequencies before we can even begin to find the "Top K".
    

**Real-world Analogy:**

Imagine you are a bouncer at an exclusive VIP club that only has room for exactly k guests. The "VIP status" is determined by how much money someone has spent at the bar (their frequency). As guests arrive one by one, if the club isn't full (size < k), you let them in. If the club IS full, you look at the _poorest_ person currently inside. If the new arrival is richer than the poorest person inside, you kick the poorest person out and let the new VIP in. By the end of the night, your club is guaranteed to hold the k richest people. A Min-Heap of size k acts exactly like this bouncer.

**Why Naive Fails:**

The brute force approach is to count all frequencies using a Hash Map, put the map's key-value pairs into a list, and sort the entire list by frequency in descending order, finally slicing the first k elements.

Sorting the entire list takes $O(U \\log U)$ time, where $U$ is the number of unique elements. In the worst case, every element is unique, making $U = n$. Thus, the time complexity becomes $O(n \\log n)$. The problem constraints explicitly forbid this: "Your algorithm's time complexity must be better than $O(n \\log n)$." If $n = 10^5$, an $O(n \\log n)$ approach might pass, but it fails the specific requirement of the prompt and will earn you a rejection in an interview.

**Approach Roadmap:**

*   **Brute:** Map frequencies $\\rightarrow$ Sort all unique elements by frequency $\\rightarrow$ Slice top K. ($O(n \\log n)$).
    
*   **Better/Optimal (Heap):** Map frequencies $\\rightarrow$ Maintain a Min-Heap of size K to keep only the top contenders. ($O(n \\log k)$).
    
*   **Alternative Optimal (Bucket Sort):** Map frequencies $\\rightarrow$ Create an array of lists where the index is the frequency $\\rightarrow$ Read from right to left. ($O(n)$). We will focus on the Heap approach as it is the most robust and widely applicable pattern for "Top K" problems.
    

**Interview Cheat Sheet:**

*   **Keywords:** "Top K", "Most frequent", "Better than $O(n \\log n)$".
    
*   **Differences:** Unlike "Kth Largest Element in an Array", we aren't comparing the values themselves, but their _frequencies_. We must build the frequency map first.
    
*   **Aha Moment:** We don't need a Max-Heap to find the max. We use a **Min-Heap of size K**. The Min-Heap easily identifies the _smallest_ of the top candidates, making it easy to know who to kick out when a better candidate arrives.
    
*   **Memory Hook:** "Map the counts, then bounce the runts" (Use a map to count, use a Min-Heap to continuously bounce/poll the smallest frequency out).
    

Optimal Visualization
---------------------

</p><p class="slate-paragraph">.viz1-grid{display:grid;grid-template-columns:1.2fr 0.8fr;gap:12px}</p><p class="slate-paragraph">@media(max-width:700px){.viz1-grid{grid-template-columns:1fr}}</p><p class="slate-paragraph">.viz1-card{background:#0e0e12;border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px}</p><p class="slate-paragraph">.viz1-state{font-family:&#x27;JetBrains Mono&#x27;,monospace;font-size:12px;padding:12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}</p><p class="slate-paragraph">.viz1-code{font-family:&#x27;JetBrains Mono&#x27;,monospace;font-size:12px;padding:10px 12px;background:#141418;border:1px solid rgba(255,255,255,0.04);border-radius:8px;margin-top:8px}</p><p class="slate-paragraph">.viz1-log{font-family:&#x27;JetBrains Mono&#x27;,monospace;font-size:11px;line-height:1.9;max-height:250px;overflow-y:auto}</p><p class="slate-paragraph">.viz1-expl{padding:12px 16px;border-radius:10px;font-size:13px;line-height:1.7;background:#141418;border:1px solid rgba(255,255,255,0.04);margin-top:8px}</p><p class="slate-paragraph">.viz1-btn{padding:6px 16px;font-size:12px;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:#1a1a20;color:#a1a1aa;cursor:pointer;font-family:inherit}</p><p class="slate-paragraph">.viz1-btn:disabled{opacity:0.3}</p><p class="slate-paragraph">.viz1-btn.active{background:rgba(79,143,247,0.15);color:#93c5fd;border-color:rgba(79,143,247,0.3)}</p><p class="slate-paragraph">

← Prev

Next →

▶ Auto

Ready

Data Structure (Min-Heap)

Algorithm Log

</p><p class="slate-paragraph">const CODE\_LINES\_1 = \[</p><p class="slate-paragraph">"Map<Integer, Integer> count = new HashMap<>();",</p><p class="slate-paragraph">"for (int num : nums) count.put(num, count.getOrDefault(num, 0) + 1);",</p><p class="slate-paragraph">"PriorityQueue<Integer> heap = new PriorityQueue<>((n1, n2) -> count.get(n1) - count.get(n2));",</p><p class="slate-paragraph">"for (int num : count.keySet()) {",</p><p class="slate-paragraph">" heap.add(num);",</p><p class="slate-paragraph">" if (heap.size() > k) heap.poll();",</p><p class="slate-paragraph">"}",</p><p class="slate-paragraph">"int\[\] top = new int\[k\];",</p><p class="slate-paragraph">"for(int i = k - 1; i >= 0; i--) top\[i\] = heap.poll();",</p><p class="slate-paragraph">"return top;"</p><p class="slate-paragraph">\];</p><p class="slate-paragraph">const TCS\_1 = \[</p><p class="slate-paragraph">{ name: "Happy Path", data: { nums: \[1,1,1,2,2,3\], k: 2 } },</p><p class="slate-paragraph">{ name: "All Same", data: { nums: \[4,4,4,4\], k: 1 } },</p><p class="slate-paragraph">{ name: "Tricky Tie", data: { nums: \[5,5,6,6,7\], k: 2 } },</p><p class="slate-paragraph">{ name: "Complex", data: { nums: \[1,2,2,3,3,3,4,4,4,4\], k: 2 } }</p><p class="slate-paragraph">\];</p><p class="slate-paragraph">let steps1 = \[\], stepIdx1 = -1, autoInt1 = null, tcIdx1 = 0;</p><p class="slate-paragraph">function drawTree1(svgEl, treeNodes) {</p><p class="slate-paragraph">let svg = &#x27;&#x27;;</p><p class="slate-paragraph">// Draw edges first</p><p class="slate-paragraph">function drawEdges(node) {</p><p class="slate-paragraph">if(!node) return;</p><p class="slate-paragraph">(node.children || \[\]).forEach(child => {</p><p class="slate-paragraph">if(child) {</p><p class="slate-paragraph">svg += &lt;line x1=&quot;${node.x}&quot; y1=&quot;${node.y + 16}&quot; x2=&quot;${child.x}&quot; y2=&quot;${child.y - 16}&quot; stroke=&quot;#3f3f46&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot;/&gt;;</p><p class="slate-paragraph">drawEdges(child);</p><p class="slate-paragraph">}</p><p class="slate-paragraph">});</p><p class="slate-paragraph">}</p><p class="slate-paragraph">drawEdges(treeNodes);</p><pre class="slate-code\_block"><select style="float:right" contenteditable="false"><option value="">Plain text</option><option value="antlr4">ANTLR4</option><option value="bash">Bash</option><option value="c">C</option><option value="csharp">C#</option><option value="css">CSS</option><option value="coffeescript">CoffeeScript</option><option value="cmake">CMake</option><option value="dart">Dart</option><option value="django">Django</option><option value="docker">Docker</option><option value="ejs">EJS</option><option value="erlang">Erlang</option><option value="git">Git</option><option value="go">Go</option><option value="graphql">GraphQL</option><option value="groovy">Groovy</option><option value="html">HTML</option><option value="java">Java</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="kotlin">Kotlin</option><option value="latex">LaTeX</option><option value="less">Less</option><option value="lua">Lua</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="matlab">MATLAB</option><option value="markup">Markup</option><option value="objectivec">Objective-C</option><option value="perl">Perl</option><option value="php">PHP</option><option value="powershell">PowerShell</option><option value="properties">.properties</option><option value="protobuf">Protocol Buffers</option><option value="python">Python</option><option value="r">R</option><option value="ruby">Ruby</option><option value="sass">Sass (Sass)</option><option value="scss">Sass (Scss)</option><option value="scheme">Scheme</option><option value="sql">SQL</option><option value="shell">Shell</option><option value="swift">Swift</option><option value="svg">SVG</option><option value="tsx">TSX</option><option value="typescript">TypeScript</option><option value="wasm">WebAssembly</option><option value="yaml">YAML</option><option value="xml">XML</option></select><code ><div class="slate-code\_line">// Draw nodes</div><div class="slate-code\_line">function drawNodes(node) {</div><div class="slate-code\_line"> if(!node) return;</div><div class="slate-code\_line"> const hl = node.hl;</div><div class="slate-code\_line"> const fill = hl ? &#39;rgba(79,143,247,0.15)&#39; : &#39;#1a1a20&#39;;</div><div class="slate-code\_line"> const stroke = hl ? &#39;#4f8ff7&#39; : &#39;#3f3f46&#39;;</div><div class="slate-code\_line"> const textC = hl ? &#39;#93c5fd&#39; : &#39;#a1a1aa&#39;;</div><div class="slate-code\_line"> svg += \`&lt;circle cx=&quot;${node.x}&quot; cy=&quot;${node.y}&quot; r=&quot;22&quot; fill=&quot;${fill}&quot; stroke=&quot;${stroke}&quot; stroke-width=&quot;1.5&quot;/&gt;\`;</div><div class="slate-code\_line"> svg += \`&lt;text x=&quot;${node.x}&quot; y=&quot;${node.y-4}&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;central&quot; font-size=&quot;12&quot; font-weight=&quot;600&quot; fill=&quot;${textC}&quot; font-family=&quot;JetBrains Mono,monospace&quot;&gt;${node.val}&lt;/text&gt;\`;</div><div class="slate-code\_line"> svg += \`&lt;text x=&quot;${node.x}&quot; y=&quot;${node.y+10}&quot; text-anchor=&quot;middle&quot; dominant-baseline=&quot;central&quot; font-size=&quot;9&quot; fill=&quot;#52525b&quot; font-family=&quot;JetBrains Mono,monospace&quot;&gt;f:${node.freq}&lt;/text&gt;\`;</div><div class="slate-code\_line"> (node.children || \[\]).forEach(child =&gt; { if(child) drawNodes(child); });</div><div class="slate-code\_line">}</div><div class="slate-code\_line">drawNodes(treeNodes);</div><div class="slate-code\_line">svgEl.innerHTML = svg;</div><div class="slate-code\_line"></div></code></pre><p class="slate-paragraph">}</p><p class="slate-paragraph">function buildTreeNodes(heapArr, counts, hlIdx) {</p><p class="slate-paragraph">if(heapArr.length === 0) return null;</p><p class="slate-paragraph">let nodes = \[\];</p><p class="slate-paragraph">// Calculate positions for a binary tree</p><p class="slate-paragraph">const levelH = 50;</p><p class="slate-paragraph">const startY = 40;</p><p class="slate-paragraph">for(let i=0; i<heapArr.length; i++) {</p><p class="slate-paragraph">let level = Math.floor(Math.log2(i+1));</p><p class="slate-paragraph">let levelWidth = Math.pow(2, level);</p><p class="slate-paragraph">let posInLevel = i - (levelWidth - 1);</p><p class="slate-paragraph">let spacing = 450 / (levelWidth + 1);</p><p class="slate-paragraph">nodes.push({</p><p class="slate-paragraph">id: i, val: heapArr\[i\], freq: counts\[heapArr\[i\]\],</p><p class="slate-paragraph">x: spacing \* (posInLevel + 1), y: startY + level \* levelH,</p><p class="slate-paragraph">hl: i === hlIdx, children: \[\]</p><p class="slate-paragraph">});</p><p class="slate-paragraph">}</p><p class="slate-paragraph">for(let i=0; i<heapArr.length; i++) {</p><p class="slate-paragraph">let left = 2<em class="slate-italic">i + 1, right = 2</em>i + 2;</p><p class="slate-paragraph">if(left < heapArr.length) nodes\[i\].children.push(nodes\[left\]);</p><p class="slate-paragraph">if(right < heapArr.length) nodes\[i\].children.push(nodes\[right\]);</p><p class="slate-paragraph">}</p><p class="slate-paragraph">return nodes\[0\];</p><p class="slate-paragraph">}</p><p class="slate-paragraph">function buildSteps1(tc) {</p><p class="slate-paragraph">steps1 = \[\];</p><p class="slate-paragraph">const { nums, k } = tc.data;</p><pre class="slate-code\_block"><select style="float:right" contenteditable="false"><option value="">Plain text</option><option value="antlr4">ANTLR4</option><option value="bash">Bash</option><option value="c">C</option><option value="csharp">C#</option><option value="css">CSS</option><option value="coffeescript">CoffeeScript</option><option value="cmake">CMake</option><option value="dart">Dart</option><option value="django">Django</option><option value="docker">Docker</option><option value="ejs">EJS</option><option value="erlang">Erlang</option><option value="git">Git</option><option value="go">Go</option><option value="graphql">GraphQL</option><option value="groovy">Groovy</option><option value="html">HTML</option><option value="java">Java</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="kotlin">Kotlin</option><option value="latex">LaTeX</option><option value="less">Less</option><option value="lua">Lua</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="matlab">MATLAB</option><option value="markup">Markup</option><option value="objectivec">Objective-C</option><option value="perl">Perl</option><option value="php">PHP</option><option value="powershell">PowerShell</option><option value="properties">.properties</option><option value="protobuf">Protocol Buffers</option><option value="python">Python</option><option value="r">R</option><option value="ruby">Ruby</option><option value="sass">Sass (Sass)</option><option value="scss">Sass (Scss)</option><option value="scheme">Scheme</option><option value="sql">SQL</option><option value="shell">Shell</option><option value="swift">Swift</option><option value="svg">SVG</option><option value="tsx">TSX</option><option value="typescript">TypeScript</option><option value="wasm">WebAssembly</option><option value="yaml">YAML</option><option value="xml">XML</option></select><code ><div class="slate-code\_line">// Step 1: Map frequencies</div><div class="slate-code\_line">let counts = {};</div><div class="slate-code\_line">steps1.push({</div><div class="slate-code\_line"> msg: \`Initializing empty frequency map.\`,</div><div class="slate-code\_line"> svgState: null,</div><div class="slate-code\_line"> variables: { nums: nums, k: k, counts: &quot;{}&quot; },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;counts&quot;\]),</div><div class="slate-code\_line"> codeLine: 0,</div><div class="slate-code\_line"> explanation: \`We start by creating an empty HashMap. This map will store each unique number as the key, and its frequency (how many times it appears) as the value.\`</div><div class="slate-code\_line">});</div><div class="slate-code\_line"></div><div class="slate-code\_line">for (let i = 0; i &lt; nums.length; i++) {</div><div class="slate-code\_line"> counts\[nums\[i\]\] = (counts\[nums\[i\]\] || 0) + 1;</div><div class="slate-code\_line"> steps1.push({</div><div class="slate-code\_line"> msg: \`Processing nums\[${i}\] = ${nums\[i\]}. Freq is now ${counts\[nums\[i\]\]}.\`,</div><div class="slate-code\_line"> svgState: null,</div><div class="slate-code\_line"> variables: { nums: nums, k: k, counts: JSON.stringify(counts) },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;counts&quot;\]),</div><div class="slate-code\_line"> codeLine: 1,</div><div class="slate-code\_line"> explanation: \`We scan through the array. We see the number ${nums\[i\]}. We update its count in our map to ${counts\[nums\[i\]\]}. This takes O(1) time per element.\`</div><div class="slate-code\_line"> });</div><div class="slate-code\_line">}</div><div class="slate-code\_line"></div><div class="slate-code\_line">// Step 2: Min Heap</div><div class="slate-code\_line">let heap = \[\];</div><div class="slate-code\_line">steps1.push({</div><div class="slate-code\_line"> msg: \`Initializing Min-Heap of size ${k}.\`,</div><div class="slate-code\_line"> svgState: buildTreeNodes(heap, counts, -1),</div><div class="slate-code\_line"> variables: { k: k, counts: JSON.stringify(counts), heap\_size: 0, heap\_contents: &quot;\[\]&quot; },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;heap\_size&quot;\]),</div><div class="slate-code\_line"> codeLine: 2,</div><div class="slate-code\_line"> explanation: \`Now we initialize a Min-Priority Queue (Heap). We give it a custom comparator: it will order elements based on their FREQUENCY from our map, not their actual values. The smallest frequency will always be at the root.\`</div><div class="slate-code\_line">});</div><div class="slate-code\_line"></div><div class="slate-code\_line">const uniqueKeys = Object.keys(counts).map(Number);</div><div class="slate-code\_line">for (let i = 0; i &lt; uniqueKeys.length; i++) {</div><div class="slate-code\_line"> let num = uniqueKeys\[i\];</div><div class="slate-code\_line"> heap.push(num);</div><div class="slate-code\_line"> // sort heap by frequency ascending</div><div class="slate-code\_line"> heap.sort((a,b) =&gt; counts\[a\] - counts\[b\]);</div><div class="slate-code\_line"> </div><div class="slate-code\_line"> steps1.push({</div><div class="slate-code\_line"> msg: \`Added ${num} (freq: ${counts\[num\]}) to heap.\`,</div><div class="slate-code\_line"> svgState: buildTreeNodes(heap, counts, heap.indexOf(num)),</div><div class="slate-code\_line"> variables: { current\_num: num, num\_freq: counts\[num\], heap\_size: heap.length, heap\_contents: JSON.stringify(heap) },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;current\_num&quot;, &quot;num\_freq&quot;, &quot;heap\_size&quot;, &quot;heap\_contents&quot;\]),</div><div class="slate-code\_line"> codeLine: 4,</div><div class="slate-code\_line"> explanation: \`We process unique element ${num} which has a frequency of ${counts\[num\]}. We add it to the Min-Heap. The heap automatically bubbles it to the correct position based on its frequency.\`</div><div class="slate-code\_line"> });</div><div class="slate-code\_line"></div><div class="slate-code\_line"> if (heap.length &gt; k) {</div><div class="slate-code\_line"> let removed = heap.shift(); // remove smallest freq (which is at index 0 after sort)</div><div class="slate-code\_line"> steps1.push({</div><div class="slate-code\_line"> msg: \`Heap size ${heap.length+1} &gt; ${k}. Removing root: ${removed} (freq: ${counts\[removed\]}).\`,</div><div class="slate-code\_line"> svgState: buildTreeNodes(heap, counts, -1),</div><div class="slate-code\_line"> variables: { removed\_num: removed, removed\_freq: counts\[removed\], heap\_size: heap.length, heap\_contents: JSON.stringify(heap) },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;removed\_num&quot;, &quot;removed\_freq&quot;, &quot;heap\_size&quot;, &quot;heap\_contents&quot;\]),</div><div class="slate-code\_line"> codeLine: 5,</div><div class="slate-code\_line"> explanation: \`Our heap size exceeded K (${k}). This is the core logic: we only care about the top K. The root of our Min-Heap is guaranteed to be the element with the LOWEST frequency currently in the heap. We eject ${removed} (freq ${counts\[removed\]}) to maintain size K.\`</div><div class="slate-code\_line"> });</div><div class="slate-code\_line"> }</div><div class="slate-code\_line">}</div><div class="slate-code\_line"></div><div class="slate-code\_line">// Extract</div><div class="slate-code\_line">let result = \[\];</div><div class="slate-code\_line">for (let i = k - 1; i &gt;= 0; i--) {</div><div class="slate-code\_line"> let val = heap.shift();</div><div class="slate-code\_line"> result.unshift(val); // simulated extraction</div><div class="slate-code\_line"> steps1.push({</div><div class="slate-code\_line"> msg: \`Extracted ${val} from heap into result array.\`,</div><div class="slate-code\_line"> svgState: buildTreeNodes(heap, counts, -1),</div><div class="slate-code\_line"> variables: { result\_array: JSON.stringify(result), remaining\_in\_heap: heap.length },</div><div class="slate-code\_line"> changedVars: new Set(\[&quot;result\_array&quot;, &quot;remaining\_in\_heap&quot;\]),</div><div class="slate-code\_line"> codeLine: 8,</div><div class="slate-code\_line"> explanation: \`We&#39;ve processed all elements. The heap now contains EXACTLY the top ${k} frequent elements. We pop them out one by one to build our final result array.\`</div><div class="slate-code\_line"> });</div><div class="slate-code\_line">}</div><div class="slate-code\_line"></div></code></pre><p class="slate-paragraph">}</p><p class="slate-paragraph">function renderState1(stateEl, vars, changes) {</p><p class="slate-paragraph">let html = &#x27;<table style="width:100%;font-family:JetBrains Mono,monospace;font-size:12px;border-collapse:collapse">&#x27;;</p><p class="slate-paragraph">Object.entries(vars).forEach((\[name, value\]) => {</p><p class="slate-paragraph">const changed = changes.has(name);</p><p class="slate-paragraph">const bg = changed ? &#x27;rgba(251,191,36,0.1)&#x27; : &#x27;transparent&#x27;;</p><p class="slate-paragraph">const nameColor = changed ? &#x27;#fbbf24&#x27; : &#x27;#52525b&#x27;;</p><p class="slate-paragraph">const valColor = changed ? &#x27;#fbbf24&#x27; : &#x27;#b8b8be&#x27;;</p><p class="slate-paragraph">html += &lt;tr style=&quot;background:${bg}&quot;&gt;&lt;td style=&quot;padding:4px 10px;color:${nameColor};font-weight:600;width:40%&quot;&gt;${name}&lt;/td&gt;&lt;td style=&quot;padding:4px 10px;color:${valColor}&quot;&gt;${value}${changed ? &#39; ← changed&#39; : &#39;&#39;}&lt;/td&gt;&lt;/tr&gt;;</p><p class="slate-paragraph">});</p><p class="slate-paragraph">html += &#x27;</table>&#x27;;</p><p class="slate-paragraph">stateEl.innerHTML = html;</p><p class="slate-paragraph">}</p><p class="slate-paragraph">function renderCode1(codeEl, activeLine) {</p><p class="slate-paragraph">let html = &#x27;&#x27;;</p><p class="slate-paragraph">CODE\_LINES\_1.forEach((line, i) => {</p><p class="slate-paragraph">const isActive = i === activeLine;</p><p class="slate-paragraph">const bg = isActive ? &#x27;rgba(79,143,247,0.15)&#x27; : &#x27;transparent&#x27;;</p><p class="slate-paragraph">const color = isActive ? &#x27;#93c5fd&#x27; : &#x27;#3f3f46&#x27;;</p><p class="slate-paragraph">const weight = isActive ? &#x27;600&#x27; : &#x27;400&#x27;;</p><p class="slate-paragraph">html += &lt;div style=&quot;padding:2px 8px;border-radius:4px;background:${bg};color:${color};font-weight:${weight};font-size:12px;line-height:2;font-family:JetBrains Mono,monospace;white-space:pre&quot;&gt;${line}&lt;/div&gt;;</p><p class="slate-paragraph">});</p><p class="slate-paragraph">codeEl.innerHTML = html;</p><p class="slate-paragraph">}</p><p class="slate-paragraph">function render1() {</p><p class="slate-paragraph">const s = steps1\[stepIdx1\];</p><p class="slate-paragraph">if (!s) return;</p><p class="slate-paragraph">if (s.svgState !== null) drawTree1(document.getElementById(&#x27;svg1&#x27;), s.svgState);</p><p class="slate-paragraph">else document.getElementById(&#x27;svg1&#x27;).innerHTML = &#x27;<text x="225" y="100" text-anchor="middle" fill="#52525b" font-family="JetBrains Mono">Heap Not Instantiated Yet</text>&#x27;;</p><pre class="slate-code\_block"><select style="float:right" contenteditable="false"><option value="">Plain text</option><option value="antlr4">ANTLR4</option><option value="bash">Bash</option><option value="c">C</option><option value="csharp">C#</option><option value="css">CSS</option><option value="coffeescript">CoffeeScript</option><option value="cmake">CMake</option><option value="dart">Dart</option><option value="django">Django</option><option value="docker">Docker</option><option value="ejs">EJS</option><option value="erlang">Erlang</option><option value="git">Git</option><option value="go">Go</option><option value="graphql">GraphQL</option><option value="groovy">Groovy</option><option value="html">HTML</option><option value="java">Java</option><option value="javascript">JavaScript</option><option value="json">JSON</option><option value="jsx">JSX</option><option value="kotlin">Kotlin</option><option value="latex">LaTeX</option><option value="less">Less</option><option value="lua">Lua</option><option value="makefile">Makefile</option><option value="markdown">Markdown</option><option value="matlab">MATLAB</option><option value="markup">Markup</option><option value="objectivec">Objective-C</option><option value="perl">Perl</option><option value="php">PHP</option><option value="powershell">PowerShell</option><option value="properties">.properties</option><option value="protobuf">Protocol Buffers</option><option value="python">Python</option><option value="r">R</option><option value="ruby">Ruby</option><option value="sass">Sass (Sass)</option><option value="scss">Sass (Scss)</option><option value="scheme">Scheme</option><option value="sql">SQL</option><option value="shell">Shell</option><option value="swift">Swift</option><option value="svg">SVG</option><option value="tsx">TSX</option><option value="typescript">TypeScript</option><option value="wasm">WebAssembly</option><option value="yaml">YAML</option><option value="xml">XML</option></select><code ><div class="slate-code\_line">renderState1(document.getElementById(&#39;state1&#39;), s.variables, s.changedVars);</div><div class="slate-code\_line">renderCode1(document.getElementById(&#39;code1&#39;), s.codeLine);</div><div class="slate-code\_line"></div><div class="slate-code\_line">let logHtml = &#39;&#39;;</div><div class="slate-code\_line">for (let i = 0; i &lt;= stepIdx1; i++) {</div><div class="slate-code\_line"> const marker = i === stepIdx1 ? &#39;▶ &#39; : &#39; &#39;;</div><div class="slate-code\_line"> const color = i === stepIdx1 ? &#39;#fbbf24&#39; : &#39;#71717a&#39;;</div><div class="slate-code\_line"> logHtml += \`&lt;div style=&quot;color:${color}&quot;&gt;${marker}${steps1\[i\].msg}&lt;/div&gt;\`;</div><div class="slate-code\_line">}</div><div class="slate-code\_line">document.getElementById(&#39;log1&#39;).innerHTML = logHtml;</div><div class="slate-code\_line">document.getElementById(&#39;log1&#39;).scrollTop = 99999;</div><div class="slate-code\_line">document.getElementById(&#39;expl1&#39;).innerHTML = s.explanation;</div><div class="slate-code\_line">document.getElementById(&#39;stepLabel1&#39;).textContent = \`Step ${stepIdx1 + 1} / ${steps1.length}\`;</div><div class="slate-code\_line">document.getElementById(&#39;prev1&#39;).disabled = stepIdx1 &lt;= 0;</div><div class="slate-code\_line">document.getElementById(&#39;next1&#39;).disabled = stepIdx1 &gt;= steps1.length - 1;</div><div class="slate-code\_line"></div></code></pre><p class="slate-paragraph">}</p><p class="slate-paragraph">function next1() { if (stepIdx1 < steps1.length - 1) { stepIdx1++; render1(); } }</p><p class="slate-paragraph">function prev1() { if (stepIdx1 > 0) { stepIdx1--; render1(); } }</p><p class="slate-paragraph">function toggleAuto1() {</p><p class="slate-paragraph">if (autoInt1) { clearInterval(autoInt1); autoInt1 = null; document.getElementById(&#x27;auto1&#x27;).textContent = &#x27;▶ Auto&#x27;; }</p><p class="slate-paragraph">else { autoInt1 = setInterval(() => { if (stepIdx1 >= steps1.length - 1) { toggleAuto1(); return; } next1(); }, 1500); document.getElementById(&#x27;auto1&#x27;).textContent = &#x27;⏸ Pause&#x27;; }</p><p class="slate-paragraph">}</p><p class="slate-paragraph">function loadTc1(idx) {</p><p class="slate-paragraph">tcIdx1 = idx; stepIdx1 = 0;</p><p class="slate-paragraph">buildSteps1(TCS\_1\[idx\]);</p><p class="slate-paragraph">document.querySelectorAll(&#x27;\[data-tc1\]&#x27;).forEach((b, i) => { b.className = i === idx ? &#x27;viz1-btn active&#x27; : &#x27;viz1-btn&#x27;; });</p><p class="slate-paragraph">render1();</p><p class="slate-paragraph">}</p><p class="slate-paragraph">const tcBar = document.getElementById(&#x27;tcBar1&#x27;);</p><p class="slate-paragraph">TCS\_1.forEach((tc, i) => {</p><p class="slate-paragraph">const b = document.createElement(&#x27;button&#x27;);</p><p class="slate-paragraph">b.textContent = tc.name;</p><p class="slate-paragraph">b.className = i === 0 ? &#x27;viz1-btn active&#x27; : &#x27;viz1-btn&#x27;;</p><p class="slate-paragraph">b.setAttribute(&#x27;data-tc1&#x27;, &#x27;&#x27;);</p><p class="slate-paragraph">b.onclick = () => loadTc1(i);</p><p class="slate-paragraph">tcBar.appendChild(b);</p><p class="slate-paragraph">});</p><p class="slate-paragraph">buildSteps1(TCS\_1\[0\]); render1();</p><p class="slate-paragraph">

Optimal Intuition
-----------------

At a high level, the optimal approach separates the problem into two distinct phases: Counting and Filtering.

First, we MUST know the frequencies of every element. There is no mathematical shortcut to knowing how often an element appears without looking at the entire array. Thus, an $O(n)$ traversal to build a Hash Map of \[number -> frequency\] is unavoidable.

The magic happens in the second phase: Filtering. We need the k largest frequencies. We _could_ dump all our map entries into an array and sort them, but that wastes time sorting the "losers" — elements with low frequencies that will never make it into the top k.

Instead, we use a Min-Heap (Priority Queue) and artificially restrict its size to k. As we iterate through our unique elements, we add them to the heap. If the heap grows larger than k, we instantly remove the root. Why a _Min-Heap_ instead of a _Max-Heap_? Because a Min-Heap keeps the SMALLEST frequency at the top. This is exactly what we want: the root acts as the "cutoff line" or the "poorest VIP". If a new element comes along, we push it in, and the heap naturally surfaces the _new_ smallest element to the root, which we immediately kick out. By doing this, we avoid sorting the entire unique list, achieving a beautiful $O(n \\log k)$ time complexity.

Optimal Step-by-Step Solution
-----------------------------

Let's walk through this algorithm exactly as a computer processes it. You are going to trace the logic manually to understand exactly why every line exists.

**The Setup:**

*   We are testing the "Happy Path" case: Input: nums = \[1, 1, 1, 2, 2, 3\], k = 2
    
*   Target output: We want to find the top 2 most frequent numbers. From looking at it, we know 1 (frequency 3) and 2 (frequency 2) are the winners.
    
*   Initial State: countMap = {}, minHeap = \[\] (empty, capacity constraint not yet applied)
    

### Phase 1: Building the Frequency Map

**Step 1: Process index 0**

Code executing: count.put(num, count.getOrDefault(num, 0) + 1);

**Where are we?** We are looking at the very first element in our array, nums\[0\].

**What do we see right now?**

*   num = 1
    
*   **The Decision:** We check if 1 is already in our map using getOrDefault(1, 0). It's not, so it returns 0.**Why this matters:** We need a baseline to start counting. If we just tried get(1) + 1 on an empty map, our code would crash with a NullPointerException. getOrDefault safely handles the first time we see a number.**The Action:** We add 0 + 1 and store it.**State AFTER this step:** countMap = {1: 1}
    

**Steps 2-6: Fast-forwarding the count**

We repeat the exact same logic for the rest of the array. Let's look at the state after processing the whole array.

**State AFTER phase 1:**

*   countMap = {1: 3, 2: 2, 3: 1}
    

### Phase 2: Filtering with the Min-Heap

We now have our frequencies. Now we initialize our Min-Heap.

💡 KEY INSIGHT: The heap must be instructed on HOW to sort. We don't want it sorting the numbers themselves (1, 2, 3). We want it sorting based on the _values in the map_ (their frequencies). We pass a custom comparator: (n1, n2) -> count.get(n1) - count.get(n2).

**Step 7: Insert the first unique key ('1')**

Code executing: heap.add(num); if (heap.size() > k) heap.poll();

**Where are we?** We are looping through the unique keys in our map: \[1, 2, 3\]. Currently on key 1.

**What do we see right now?**

*   num = 1 (Its frequency in map is 3)
    
*   heap = \[\]
    
*   **The Action:** We add 1 to the heap. We check the condition: is 1 > 2? -> NO. So we don't kick anything out.**State AFTER this step:**
    
*   heap = \[1\] (representing frequency 3)
    

**Step 8: Insert the second unique key ('2')**

Code executing: heap.add(num); if (heap.size() > k) heap.poll();

**Where are we?** We are on the second unique key, 2.

**What do we see right now?**

*   num = 2 (Its frequency in map is 2)
    
*   **The Decision:** We add 2 to the heap. The heap must re-sort. Remember, it sorts by frequency (Min-Heap).
    
*   Frequency of 2 is 2.
    
*   Because $2 < 3$, the heap places 2 at the root!**The Action:** We check is 2 > 2? -> NO. Size is exactly k. No kick out.**State AFTER this step:**
    
*   heap = \[2, 1\] (root is 2, because its frequency 2 is smaller than 1's frequency 3)
    

**Step 9: Insert the final unique key ('3')**

Code executing: heap.add(num); if (heap.size() > k) heap.poll();

**Where are we?** We are on the last unique key, 3.

**What do we see right now?**

*   num = 3 (Its frequency in map is 1)
    
*   **The Decision:** We add 3 to the heap. The heap re-sorts.
    
*   The heap places 3 at the root.**The Action:** Now the heap has \[3, 2, 1\]. We check: is 3 > 2? -> YES. The heap size has exceeded k.**Why this matters:** We only want the TOP 2 elements. We currently have 3. Who gets voted off the island? The one with the lowest frequency. Because we built a Min-Heap, the element with the absolute lowest frequency is sitting right at the root (3).💡 KEY INSIGHT: This is why a Min-Heap is genius here. Finding the _loser_ takes O(1) time because they are perfectly positioned at the top of the heap. If we used a Max-Heap, the top element would be our _best_ candidate, and finding the loser would be difficult.**The Execution:** We run heap.poll(). The root (3) is ejected. The heap re-adjusts.**State AFTER this step:**
    
*   heap = \[2, 1\] (We successfully kicked out the lowest frequency element!)
    

### Phase 3: Extracting the Result

**Step 10: Building the array**

Code executing: top\[i\] = heap.poll();

**Where are we?** The heap now contains the correct answer. We just need to transfer it to an int\[\] to satisfy the function's return type.

**What do we see right now?**

*   heap = \[2, 1\]
    
*   **The Action:** We pop elements from the heap. Because it's a Min-Heap, it will pop the smaller frequencies first. If we want our final array to have the absolute highest frequencies at the front, we should fill the array backwards.
    
*   i = 1: top\[1\] = heap.poll(). Pops 2. Array is \[0, 2\].
    
*   i = 0: top\[0\] = heap.poll(). Pops 1. Array is \[1, 2\].
    

**Final Result:** \[1, 2\]. This correctly identifies 1 and 2 as the most frequent elements!

### After the Walkthrough

**Why does this work? (Correctness proof for beginners):**

Notice that every time we add a new unique number to our heap, we only ever kick an element out IF the heap size exceeds k. When we do kick someone out, it is strictly the element with the lowest frequency currently in the group. Because every element gets a chance to enter the heap, and only the absolute weakest get kicked out, it is mathematically guaranteed that the k elements left standing at the end are the strongest (highest frequency). Think of it like a high-jump competition where only the top 3 scores make the podium. Every athlete jumps. If someone jumps higher than the 3rd place guy, the 3rd place guy gets bumped off the podium.

**The Key Invariant:**

At the end of processing the $i$-th unique element from the map, the heap contains exactly the k most frequent elements seen _so far_.

**Beginner Mistakes:**

1.  **Using a Max-Heap instead of a Min-Heap.** Many beginners hear "Top K" or "Maximum" and write (n1, n2) -> count.get(n2) - count.get(n1) (Max-Heap). This causes the heap to keep the _largest_ frequency at the root. When size exceeds k, calling .poll() kicks out the _winner_, leaving you with the k lowest frequencies!
    
2.  **Adding to the heap incorrectly.** A common error is looping through nums to add to the heap instead of count.keySet(). If you loop through nums, you add duplicates to the heap (e.g., adding '1' three times). You must only evaluate the unique keys.
    
3.  **Forgetting to map frequencies first.** You cannot bypass the map. A heap alone cannot count frequencies on the fly while restricting size.
    

**What if the interviewer asks "Why not just sort the map entries?":**

You explain: "Sorting the entries takes $O(U \\log U)$ time where $U$ is the number of unique elements. In the worst case, $U = n$, making it $O(n \\log n)$. The Min-Heap limits the sorting overhead to a maximum size of $K$. Inserting into a heap of size $K$ takes $O(\\log k)$. Doing this $U$ times gives $O(U \\log k)$. Since $k$ is usually much smaller than $n$, $O(n \\log k)$ is strictly faster and satisfies the constraint."

**30-second interview pitch:**

"This problem asks us to find the most frequent elements. The key insight is to separate counting from filtering. We use a HashMap to count frequencies in $O(n)$ time. Then, we use a Min-Heap of size K, comparing elements by their frequencies. As we iterate through the unique keys, we push them into the heap and immediately pop the root if the size exceeds K. This ensures the smallest frequencies are constantly ejected, leaving the top K in $O(n \\log k)$ time."

Optimal In-depth Intuition
--------------------------

The previous section walked through exactly how the code executes. Now let's explore the theoretical underpinnings of _why_ this data structure is the undisputed champion for this problem.

**Why a Min-Heap of size K?**

We need the K-th most frequent elements, which practically means we need to constantly ask: "Who is the weakest link currently in our top K group?" That's literally what a Min-Heap of size K gives us in O(1) time — the root is always the smallest of whatever we've stored.

Why not a Max-Heap? A Max-Heap gives us the LARGEST element. If we put all elements into a Max-Heap, we'd have to put ALL $n$ unique elements into it, taking $O(n \\log n)$ time, and then pop k times. The Min-Heap restricts the data structure's size strictly to k, meaning every insertion operation is extremely cheap: $O(\\log k)$ instead of $O(\\log n)$.

Why not a sorted array? If we tried to maintain a sorted array of size k, every time we found a new frequency that deserved to be in the top k, inserting it would require shifting elements over. Insertion in an array is $O(k)$. For $U$ unique elements, that becomes $O(U \\times k)$ time. A heap's tree structure allows insertion in $O(\\log k)$, which is mathematically vastly superior.

**The Mathematical Proof**

Let's prove the correctness using proof by contradiction.

Suppose our algorithm finishes, but it _missed_ the true optimal answer. This means there is some element $X$ that belongs in the true top $K$, but it is not in our heap at the end.

For $X$ to not be in the heap at the end, one of two things must have happened:

1.  We never processed $X$. (Impossible, because we loop over count.keySet() which contains all unique elements).
    
2.  We processed $X$, put it in the heap, but it got kicked out later.
    

If $X$ was kicked out, it means at some point the heap size exceeded $K$, and $X$ was at the root. But the root of our Min-Heap is strictly the element with the _lowest_ frequency currently inside. If $X$ was kicked out, it means there were $K$ _other_ elements in the heap that all had frequencies greater than or equal to $X$.

If there are $K$ elements strictly equal or greater in frequency to $X$, then $X$ mathematically cannot be in the top $K$ (or it ties for the $K$-th spot, which the problem statement says is guaranteed to be unique). Thus, a contradiction is reached. Our algorithm perfectly retains the top $K$.

**What property of the input are we exploiting?**

We are exploiting the fact that we do not care about the _full sorted order_ of the array. The problem doesn't ask us to sort the frequencies from 1st to $n$-th. It only asks for a specific partition: the top $K$. This allows us to deliberately discard information. We throw away the exact relative ordering of the bottom $N-K$ elements. A bounded Heap is the perfect data structure for capturing a threshold partition without fully sorting.

**Connection to other problems:**

*   "Kth Largest Element in an Array" (LC 215) — Uses the exact same Min-Heap-of-size-K pattern, but you skip the Hash Map step and put the raw array values directly into the heap.
    
*   "Find K Pairs with Smallest Sums" (LC 373) — Uses a Max-Heap (because you want smallest, so you bounce the largest) bounded to size K.
    

**What breaks if we change constraints?**

*   What if $k$ could be up to $N$? If $K \\approx N$, the heap approach takes $O(N \\log N)$ time, making it no better than a naive sort. In that case, **Bucket Sort** (an $O(N)$ technique where array indices represent frequencies) becomes strictly superior.
    
*   What if data streams in continuously and we need to query Top K at any moment? The Hash Map + Heap approach would be inefficient because updating a frequency mid-stream requires finding that element in the heap and updating its position ($O(K)$ time in Java). We would need a more complex structure like a Doubly Linked List with a Map (similar to an LFU Cache).
    

Optimal Algorithm
-----------------

Plaintext

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML``   1. Initialize a HashMap `count` to store frequencies.  2. Iterate through `nums`:         Update the frequency of `num` in the map.  3. Initialize a Min-Heap (PriorityQueue).         Pass a custom comparator to compare elements by their values in the `count` map.  4. Iterate through unique keys in the map:         Add the key to the heap.         If the heap size exceeds `k`:             Pop the root element (this discards the lowest frequency).  5. Create an output array `top` of size `k`.  6. Loop `i` from `k-1` down to 0:         Extract the root of the heap and place it in `top[i]`.  7. Return `top`.   ``

**Initialization block:** We set up the HashMap. This is fundamentally required because raw arrays don't provide a way to tally sparse or negative numbers without extreme memory overhead.

**Main loop:** We iterate over the _keys_ of the map, not the original array. This is crucial because iterating over the array would mean processing duplicates multiple times, wrecking our heap logic. The loop invariant is that at any point, the heap holds the k largest frequencies seen _so far_.

**Key decision inside the loop:** if (heap.size() > k). If false, the heap is still filling up, so we do nothing. If true, the heap has exceeded capacity. We must evict an element. Because we initialized a Min-Heap, the eviction (heap.poll()) seamlessly removes the absolute smallest frequency in O(log k) time.

**Return value:** We return an integer array. We pop from the heap into the array backwards. Why backwards? Because the heap pops the _smallest_ of the top K first. To have the absolute most frequent item at index 0, we put the first popped item at the last index.

Optimal Code
------------

Java

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   import java.util.Map;  import java.util.HashMap;  import java.util.PriorityQueue;  class Solution {      public int[] topKFrequent(int[] nums, int k) {          // Step 1: O(N) time to build frequency map          Map count = new HashMap<>();          for (int num : nums) {              count.put(num, count.getOrDefault(num, 0) + 1);          }          // Step 2: Initialize Min-Heap based on frequency          // The comparator reads values from the map          PriorityQueue heap = new PriorityQueue<>(              (n1, n2) -> count.get(n1) - count.get(n2)          );          // Step 3: O(U log K) time to keep top K elements          for (int num : count.keySet()) {              heap.add(num);              if (heap.size() > k) {                  heap.poll(); // Evict the lowest frequency              }          }          // Step 4: Extract the top K elements          int[] top = new int[k];          for (int i = k - 1; i >= 0; i--) {              top[i] = heap.poll();          }          return top;      }  }   `

Optimal Complexity
------------------

**Time Complexity:** $O(N \\log K)$

Building the HashMap takes $O(N)$ time, as we visit each element exactly once. Iterating over the map takes $O(U)$ where $U$ is the number of unique elements. For each unique element, inserting into a heap of size $K$ takes $O(\\log K)$ time. Therefore, the heap operations take $O(U \\log K)$. In the worst case (all elements unique), $U = N$, so it becomes $O(N \\log K)$. Since $K \\le N$, $O(N \\log K)$ is strictly faster than $O(N \\log N)$.

**Space Complexity:** $O(N + K)$

The HashMap requires $O(U)$ space to store the unique elements and their counts. In the worst case, $U = N$, so the map takes $O(N)$ space. The Priority Queue stores at most $K$ elements, taking $O(K)$ space. The total auxiliary space is $O(N + K)$.

Optimal Hints
-------------

1.  **Gentle Nudge:** You need to count the elements first. You can't avoid looking at every single number to know its total frequency. What structure is best for counting occurrences?
    
2.  **Intermediate:** Once you have a map of \[number -> frequency\], how do you find the highest k frequencies without sorting the entire map?
    
3.  **Strong Hint:** Think about a Priority Queue. Should it be a Max-Heap or a Min-Heap? What happens if you use a Min-Heap and restrict its size to exactly k?
    
4.  **Near-Answer:** Create a Priority Queue and pass a custom comparator: (a, b) -> map.get(a) - map.get(b). Add keys to the heap. Whenever heap.size() > k, call .poll(). What gets kicked out? The smallest frequency!