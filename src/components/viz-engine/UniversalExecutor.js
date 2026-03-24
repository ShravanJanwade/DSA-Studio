/**
 * UniversalExecutor v2 — Execute ANY code and produce visualization steps.
 *
 * Architecture:
 *   1.  Detect language (Java / C++ / Python / JS)
 *   2.  Transpile to JavaScript via targeted transpilers
 *   3.  Auto-detect data-structure variables from code + input
 *   4.  Instrument the JS: inject recording calls after every statement
 *   5.  Run the instrumented JS inside a controlled sandbox
 *   6.  Return StepRecorder-compatible steps[]
 *
 * v2 fixes:
 *   - Real code instrumentation (variables captured after every statement)
 *   - Python transpiler: range(len(x)), `in` for dicts, `let` declarations,
 *     `not in`, `elif` brace logic
 *   - C++ transpiler: .back(), make_pair, auto
 *   - findMainFunction: prefer class Solution methods, fewer skip names
 *   - Better error recovery and limits
 */

import { transpileJavaToJS } from './JavaTranspiler';
import { StepRecorder, C, circleLayout } from './StepRecorder';

// ────────────────────────────────────────────
// 1. Language detection (unchanged)
// ────────────────────────────────────────────
export function detectLanguage(code) {
  if (!code) return 'unknown';
  const c = code.trim();
  if (/\b(public\s+class|static\s+void\s+main|System\.out|import\s+java\.|void\s+\w+\s*\(|int\s+\w+\s*\(|ListNode|TreeNode|String\s+\w+\s*=)/.test(c)) return 'java';
  if (/#include|using\s+namespace\s+std|cout|cin|vector\s*<|unordered_map|::/.test(c)) return 'cpp';
  if (/\bdef\s+\w+\s*\(|class\s+\w+\s*:|import\s+\w+|from\s+\w+\s+import|print\s*\(|self\.|:\s*$|if\s+.*:\s*$/m.test(c)) return 'python';
  if (/\bfunction\s+\w+|const\s+|let\s+|var\s+|=>\s*{|module\.exports/.test(c)) return 'js';
  return 'java';
}

// ────────────────────────────────────────────
// 2. C++ → JS transpiler (fixed)
// ────────────────────────────────────────────
function transpileCppToJS(code) {
  let c = code;

  // Includes & namespace
  c = c.replace(/^\s*#include\s*<[^>]*>\s*$/gm, '');
  c = c.replace(/^\s*using\s+namespace\s+\w+\s*;\s*$/gm, '');

  // Container types → JS equivalents
  c = c.replace(/\bvector\s*<[^>]*(?:<[^>]*>)?>\s+(\w+)/g, 'let $1 = []');
  c = c.replace(/\bunordered_map\s*<[^>]*>\s+(\w+)/g, 'let $1 = new Map()');
  c = c.replace(/\bunordered_set\s*<[^>]*>\s+(\w+)/g, 'let $1 = new Set()');
  c = c.replace(/\bmap\s*<[^>]*>\s+(\w+)/g, 'let $1 = new Map()');
  c = c.replace(/\bset\s*<[^>]*>\s+(\w+)/g, 'let $1 = new Set()');
  c = c.replace(/\bstack\s*<[^>]*>\s+(\w+)/g, 'let $1 = []');
  c = c.replace(/\bqueue\s*<[^>]*>\s+(\w+)/g, 'let $1 = []');
  c = c.replace(/\bpriority_queue\s*<[^>]*>\s+(\w+)/g, 'let $1 = []');
  c = c.replace(/\bpair\s*<[^>]*>\s+(\w+)/g, 'let $1');
  c = c.replace(/\bstring\s+(\w+)/g, 'let $1');
  c = c.replace(/\bauto\s+(\w+)\s*=/g, 'let $1 =');

  // Primitive types
  c = c.replace(/\b(int|long|long long|float|double|char|bool|size_t|unsigned)\s+(\w+)\s*=/g, 'let $2 =');
  c = c.replace(/\b(int|long|long long|float|double|char|bool|size_t|unsigned)\s+(\w+)\s*;/g, 'let $2 = 0;');
  c = c.replace(/\b(int|long|long long|float|double|char|bool|size_t|unsigned)\s+(\w+)/g, 'let $2');

  // for-each: for (auto x : arr) → for (const x of arr)
  c = c.replace(/for\s*\(\s*(?:auto|const\s+auto\s*&?|int|char|string)\s+(\w+)\s*:\s*(\w+)\s*\)/g, 'for (const $1 of $2)');
  c = c.replace(/for\s*\(\s*(?:auto|int|long|size_t)\s+/g, 'for (let ');

  // Method signatures
  c = c.replace(/^(\s*)(?:void|int|bool|float|double|long|char|string|vector\s*<[^>]*>|ListNode\s*\*|TreeNode\s*\*)\s+(\w+)\s*\(([^)]*)\)\s*\{/gm,
    (_, indent, name, params) => {
      const clean = params.split(',').map(p => {
        const parts = p.replace(/[*&]/g, '').replace(/<[^>]*>/g, '').replace(/vector|string|int|bool|long|char|float|double|auto|const/g, '').trim().split(/\s+/);
        return parts[parts.length - 1] || '';
      }).filter(Boolean).join(', ');
      return `${indent}function ${name}(${clean}) {`;
    });

  // STL method conversions
  c = c.replace(/\.push_back\(/g, '.push(');
  c = c.replace(/\.emplace_back\(/g, '.push(');
  c = c.replace(/\.pop_back\(\)/g, '.pop()');
  c = c.replace(/\.front\(\)/g, '[0]');
  // Fix .back() — must use named capture to get the variable name
  c = c.replace(/(\w+)\.back\(\)/g, '$1[$1.length-1]');
  c = c.replace(/\.size\(\)/g, '.length');
  c = c.replace(/\.empty\(\)/g, '.length === 0');
  c = c.replace(/\.begin\(\)/g, '');
  c = c.replace(/\.end\(\)/g, '');
  c = c.replace(/(\w+)\.find\(([^)]+)\)\s*!=\s*\w+\.end\(\)/g, '$1.includes($2)');
  c = c.replace(/\.insert\(/g, '.add(');
  c = c.replace(/\.erase\(/g, '.delete(');
  c = c.replace(/\.count\(/g, '.has(');

  // make_pair(a, b) → [a, b]
  c = c.replace(/make_pair\s*\(([^,]+),\s*([^)]+)\)/g, '[$1, $2]');
  c = c.replace(/\.first\b/g, '[0]');
  c = c.replace(/\.second\b/g, '[1]');

  // Math & constants
  c = c.replace(/\bmin\(/g, 'Math.min(');
  c = c.replace(/\bmax\(/g, 'Math.max(');
  c = c.replace(/\babs\(/g, 'Math.abs(');
  c = c.replace(/\bsqrt\(/g, 'Math.sqrt(');
  c = c.replace(/\bINT_MAX\b/g, 'Infinity');
  c = c.replace(/\bINT_MIN\b/g, '-Infinity');
  c = c.replace(/\bLLONG_MAX\b/g, 'Infinity');
  c = c.replace(/\bsort\s*\(\s*(\w+)\.begin\(\)\s*,\s*\1\.end\(\)\s*\)/g, '$1.sort((a,b)=>a-b)');

  // cout, nullptr
  c = c.replace(/cout\s*<<\s*/g, 'console.log(');
  c = c.replace(/\s*<<\s*endl\s*/g, ')');
  c = c.replace(/\bnullptr\b/g, 'null');

  return c;
}

// ────────────────────────────────────────────
// 3. Python → JS transpiler (fixed)
// ────────────────────────────────────────────
function transpilePythonToJS(code) {
  let c = code;
  // Remove imports
  c = c.replace(/^\s*(from\s+\w+\s+)?import\s+.+$/gm, '');
  // Remove type hints  (: int, : List[int], : Optional[str], etc.)
  c = c.replace(/:\s*(int|str|float|bool|List|Dict|Set|Optional|Tuple)\b(\[[^\]]*\])?(?=\s*[=,)\n])/g, '');

  const lines = c.split('\n');
  const output = [];
  const indentStack = [0];
  const declaredVars = new Set();  // Track declared variables for `let` injection

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      output.push(trimmed.startsWith('#') ? line.replace('#', '//') : line);
      continue;
    }

    const indent = line.search(/\S/);

    // Close braces for dedent — but NOT if current line is elif/else (they attach to previous block)
    const isElif = /^\s*(elif|else)\b/.test(line);
    if (!isElif) {
      while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
        indentStack.pop();
        output.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
      }
    } else {
      // For elif/else, close exactly one level
      if (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
        indentStack.pop();
        // Don't emit '}' — it will be prepended to the elif/else line below
      }
    }

    // ── def → function ──
    line = line.replace(/\bdef\s+(\w+)\s*\(([^)]*)\)\s*(->\s*\w+(\[.*?\])?\s*)?:/, (_, name, params) => {
      // Remove `self` from params, strip type annotations
      const cleanParams = params.split(',')
        .map(p => p.replace(/:\s*\S+/g, '').trim())
        .filter(p => p && p !== 'self')
        .join(', ');
      return `function ${name}(${cleanParams}) {`;
    });

    // class
    line = line.replace(/\bclass\s+(\w+)\s*(\([^)]*\))?\s*:/, 'class $1 {');
    // self.x → this.x
    line = line.replace(/\bself\./g, 'this.');

    // ── range() patterns — use ([^)]+) to match expressions like len(nums) ──
    line = line.replace(/for\s+(\w+)\s+in\s+range\(([^,)]+)\)\s*:/g, 'for (let $1 = 0; $1 < $2; $1++) {');
    line = line.replace(/for\s+(\w+)\s+in\s+range\(([^,)]+)\s*,\s*([^,)]+)\)\s*:/g, 'for (let $1 = $2; $1 < $3; $1++) {');
    line = line.replace(/for\s+(\w+)\s+in\s+range\(([^,)]+)\s*,\s*([^,)]+)\s*,\s*([^,)]+)\)\s*:/g,
      (_, v, s, e, step) => {
        const stepTrimmed = step.trim();
        // If step starts with '-', use > comparison
        if (stepTrimmed.startsWith('-')) {
          return `for (let ${v} = ${s}; ${v} > ${e}; ${v} += ${stepTrimmed}) {`;
        }
        return `for (let ${v} = ${s}; ${v} < ${e}; ${v} += ${stepTrimmed}) {`;
      });

    // enumerate
    line = line.replace(/for\s+(\w+)\s*,\s*(\w+)\s+in\s+enumerate\((\w+)\)\s*:/g,
      'for (let $1 = 0; $1 < $3.length; $1++) { const $2 = $3[$1];');

    // for x in arr (plain iteration)
    line = line.replace(/for\s+(\w+)\s+in\s+(\w+)\s*:/g, 'for (const $1 of $2) {');

    // while ... : → while (...) {
    line = line.replace(/^(\s*)while\s+(.+)\s*:$/m, '$1while ($2) {');

    // elif → } else if
    line = line.replace(/^(\s*)elif\s+(.+)\s*:$/m, '$1} else if ($2) {');
    // if ... : → if (...) {
    line = line.replace(/^(\s*)if\s+(.+)\s*:$/m, '$1if ($2) {');
    // else: → } else {
    line = line.replace(/^(\s*)else\s*:$/m, '$1} else {');

    // return (unchanged in most cases, just ensure no trailing colon)
    // pass → (empty)
    line = line.replace(/^\s*pass\s*$/m, '');

    // ── Boolean / None ──
    line = line.replace(/\bTrue\b/g, 'true');
    line = line.replace(/\bFalse\b/g, 'false');
    line = line.replace(/\bNone\b/g, 'null');

    // ── `not in` must come before `in` and before `not` ──
    line = line.replace(/\b(\w+)\s+not\s+in\s+(\w+)\b/g, '!$2.includes($1)');
    // ── `x in y` — only convert to .includes() for non-dict contexts ──
    // Heuristic: if the line has a `for` or `if` and the right-hand side looks like
    // an array variable, convert. For dict-key checks, `in` is valid JS for objects.
    // We convert `x in y` to `y.includes(x)` only when NOT preceded by `for` (for-in is different)
    // and not already handled by for-of conversion above.
    line = line.replace(/(?<!\.)\b(\w+)\s+in\s+(\w+)\b(?!\s*[:\(])/g, (match, left, right) => {
      // If the variable name suggests a dict/map/set, keep as `in` (for plain objects) or use .has()
      // For arrays: use .includes(). Since we can't always tell, use .includes() as default
      // because most Python `in` usage on lists should be .includes()
      return `${right}.includes(${left})`;
    });

    // ── Logical operators — must come after `not in` handling ──
    line = line.replace(/\band\b/g, '&&');
    line = line.replace(/\bor\b/g, '||');
    // `not` → `!` — be careful not to break `not` in string literals or already-handled `not in`
    line = line.replace(/\bnot\s+/g, '!');

    // ── Built-in functions ──
    // len(x) → x.length — handle expressions like len(nums), len(s)
    line = line.replace(/\blen\((\w+)\)/g, '$1.length');
    // len(expression) for more complex args
    line = line.replace(/\blen\(([^)]+)\)/g, '($1).length');
    // print → console.log
    line = line.replace(/\bprint\s*\(/g, 'console.log(');
    // append → push
    line = line.replace(/\.append\(/g, '.push(');
    // extend → push(...arr)
    line = line.replace(/\.extend\(([^)]+)\)/g, '.push(...$1)');
    // pop() is the same in both
    // sorted
    line = line.replace(/\bsorted\((\w+)\)/g, '[...$1].sort((a,b)=>a-b)');
    // abs, min, max
    line = line.replace(/\babs\(([^)]+)\)/g, 'Math.abs($1)');
    // ** → Math.pow
    line = line.replace(/(\w+)\s*\*\*\s*(\w+)/g, 'Math.pow($1, $2)');
    // // division → Math.floor
    line = line.replace(/(\w[\w[\]().]*)\s*\/\/\s*(\w[\w[\]().]*)/g, 'Math.floor($1 / $2)');
    // float('inf') / float('-inf')
    line = line.replace(/float\s*\(\s*['"]inf['"]\s*\)/g, 'Infinity');
    line = line.replace(/float\s*\(\s*['"]-inf['"]\s*\)/g, '-Infinity');

    // ── collections ──
    // defaultdict → Map or plain object
    line = line.replace(/\bcollections\.defaultdict\s*\(\s*\w+\s*\)/g, 'new Map()');
    line = line.replace(/\bdefaultdict\s*\(\s*\w+\s*\)/g, 'new Map()');
    // deque → array
    line = line.replace(/\bcollections\.deque\s*\(\s*\)/g, '[]');
    line = line.replace(/\bdeque\s*\(\s*\)/g, '[]');
    line = line.replace(/\.popleft\(\)/g, '.shift()');
    line = line.replace(/\.appendleft\(/g, '.unshift(');

    // ── Add `let` for first assignment to undeclared variables ──
    const assignMatch = line.match(/^(\s*)(\w+)\s*=[^=]/);
    if (assignMatch && !line.includes('function ') && !line.includes('for ') &&
        !line.includes('class ') && !line.includes('if ') && !line.includes('while ') &&
        !line.includes('} else')) {
      const varName = assignMatch[2];
      // Skip keywords and already-declared
      const skipKeywords = new Set(['return', 'let', 'const', 'var', 'this', 'true', 'false', 'null']);
      if (!skipKeywords.has(varName) && !declaredVars.has(varName) && !varName.startsWith('__')) {
        declaredVars.add(varName);
        line = line.replace(/^(\s*)(\w+)\s*=/, '$1let $2 =');
      }
    }

    // Track indent for blocks — check the ORIGINAL trimmed line ending with ':'
    // but only if we converted it to a block (contains '{' now)
    if (line.includes(') {') || line.includes('else {')) {
      const currentIndent = line.search(/\S/);
      if (currentIndent >= 0) {
        indentStack.push(currentIndent + 2);
      }
    }

    output.push(line);
  }

  // Close remaining braces
  while (indentStack.length > 1) { indentStack.pop(); output.push('}'); }

  return output.join('\n');
}

// ────────────────────────────────────────────
// 4. Transpile dispatcher (unchanged)
// ────────────────────────────────────────────
export function transpileToJS(code, lang) {
  const language = lang || detectLanguage(code);
  switch (language) {
    case 'java': return transpileJavaToJS(code);
    case 'cpp': return transpileCppToJS(code);
    case 'python': return transpilePythonToJS(code);
    case 'js': return code;
    default: return transpileJavaToJS(code);
  }
}

// ────────────────────────────────────────────
// 5. Structure detection (unchanged)
// ────────────────────────────────────────────
export function detectStructures(code, parsedInput) {
  const structures = [];
  const lc = (code || '').toLowerCase();

  if (parsedInput) {
    for (const [key, val] of Object.entries(parsedInput)) {
      if (Array.isArray(val)) {
        if (val.length > 0 && Array.isArray(val[0])) {
          structures.push({ type: 'matrix', id: key, values: val, label: key });
        } else {
          structures.push({ type: 'array', id: key, values: val, label: key });
        }
      }
    }
  }

  if (parsedInput?.edges && parsedInput?.n) {
    structures.push({ type: 'graph', id: 'graph', n: parsedInput.n, edges: parsedInput.edges });
  }

  if (/stack/i.test(lc) && !structures.find(s => s.type === 'stack')) {
    structures.push({ type: 'stack', id: 'stack', label: 'Stack' });
  }
  if (/queue/i.test(lc) && !structures.find(s => s.type === 'queue')) {
    structures.push({ type: 'queue', id: 'queue', label: 'Queue' });
  }
  if (/map|hash|dict/i.test(lc) && !structures.find(s => s.type === 'hashmap')) {
    structures.push({ type: 'hashmap', id: 'map', label: 'HashMap' });
  }

  return structures;
}

// ────────────────────────────────────────────
// 6. Core execution
// ────────────────────────────────────────────
const MAX_STEPS = 5000;
const MAX_TIME_MS = 4000;

/**
 * Execute user code with auto-instrumentation.
 *
 * @param {string} rawCode  — The user's solution code (Java/C++/Python/JS)
 * @param {Object} parsedInput — Parsed input from InputParser
 * @param {string} language — Optional override
 * @param {Object} hints — Optional { intuition, steps, algorithmName }
 * @returns {{ steps: Step[], error: string|null }}
 */
export function executeCode(rawCode, parsedInput, language, hints) {
  if (!rawCode || !parsedInput) return { steps: [], error: 'No code or input provided.' };

  try {
    const lang = language || detectLanguage(rawCode);
    let jsCode;
    try {
      jsCode = transpileToJS(rawCode, lang);
    } catch (transpileErr) {
      return { steps: [], error: `Transpilation failed (${lang}): ${transpileErr.message}. Try submitting JavaScript directly.` };
    }

    // Clean up the transpiled code
    jsCode = cleanTranspiled(jsCode);

    // Find the main function name
    const mainFunc = findMainFunction(jsCode, rawCode);
    if (!mainFunc) {
      return {
        steps: [],
        error: 'Could not find the main function in the code. Make sure there is a function like `twoSum(...)`, `solve(...)`, etc.'
      };
    }

    // Build the instrumented execution wrapper
    const { wrappedCode } = buildExecutionWrapper(jsCode, mainFunc, parsedInput, rawCode);

    // Run it
    return runInSandbox(wrappedCode);
  } catch (err) {
    return { steps: [], error: `Execution failed: ${err.message}` };
  }
}

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function cleanTranspiled(code) {
  let c = code;
  // Remove `class Solution { ... }` wrapper
  c = c.replace(/^\s*class\s+\w+\s*\{\s*$/gm, '');
  // Remove trailing orphan `}`
  const lines = c.split('\n');
  let depth = 0;
  const result = [];
  for (const line of lines) {
    const trimmed = line.trim();
    const opens = (trimmed.match(/\{/g) || []).length;
    const closes = (trimmed.match(/\}/g) || []).length;
    if (trimmed === '}' && depth + opens - closes < 0) continue;
    depth += opens - closes;
    result.push(line);
  }
  return result.join('\n');
}

/**
 * Find the main function to execute.
 * Strategy: prefer class Solution methods, then first non-utility function.
 */
function findMainFunction(jsCode, originalCode) {
  const funcMatches = [...jsCode.matchAll(/function\s+(\w+)\s*\(([^)]*)\)\s*\{/g)];
  if (funcMatches.length === 0) return null;

  // Only skip true utility/entry names — NOT solve/dfs/bfs which are often THE function
  const skipNames = new Set(['main', 'helper', 'swap', 'compare', 'toString', 'hashCode']);
  const allNames = funcMatches.map(m => ({ name: m[1], params: m[2], index: m.index }));

  // Priority 1: Java class Solution public method
  const solutionMethod = originalCode.match(/public\s+\w+(?:<[^>]*>)?\s*(?:\[\])?\s+(\w+)\s*\(/);
  if (solutionMethod) {
    const found = allNames.find(f => f.name === solutionMethod[1]);
    if (found) return found;
  }

  // Priority 2: Python class Solution method
  const pyMethod = originalCode.match(/class\s+Solution[\s\S]*?def\s+(\w+)\s*\(\s*self/);
  if (pyMethod) {
    const found = allNames.find(f => f.name === pyMethod[1]);
    if (found) return found;
  }

  // Priority 3: C++ class Solution method
  const cppMethod = originalCode.match(/class\s+Solution\s*\{[\s\S]*?(?:public:\s*)?(?:\w+\s+)+(\w+)\s*\(/);
  if (cppMethod) {
    const found = allNames.find(f => f.name === cppMethod[1]);
    if (found) return found;
  }

  // Priority 4: first function that's not in skipNames
  let main = allNames.find(f => !skipNames.has(f.name));
  if (!main) main = allNames[0];

  return main;
}

// ────────────────────────────────────────────
// Variable extraction from transpiled JS
// ────────────────────────────────────────────

/**
 * Extract all variable names from transpiled JS code.
 * Looks at let/const/var declarations, function params, and for-loop vars.
 */
function extractVariableNames(jsCode, paramNames) {
  const vars = new Set(paramNames);

  // let/const/var declarations
  const declMatches = jsCode.matchAll(/\b(?:let|const|var)\s+(\w+)/g);
  for (const m of declMatches) vars.add(m[1]);

  // for-loop variables: for (let i = ...) or for (const x of ...)
  const forMatches = jsCode.matchAll(/for\s*\(\s*(?:let|const|var)\s+(\w+)/g);
  for (const m of forMatches) vars.add(m[1]);

  // Destructuring: const [a, b] = ... or let {x, y} = ...
  const destructArr = jsCode.matchAll(/\b(?:let|const|var)\s+\[([^\]]+)\]/g);
  for (const m of destructArr) {
    m[1].split(',').forEach(v => { const t = v.trim(); if (t && /^\w+$/.test(t)) vars.add(t); });
  }

  // Remove common non-variable names
  vars.delete('function');
  vars.delete('return');
  vars.delete('true');
  vars.delete('false');
  vars.delete('null');
  vars.delete('undefined');

  return [...vars];
}

/**
 * Pointer variable names — integer vars that typically index into arrays.
 * We auto-attach these as pointers on array structures.
 */
const POINTER_NAMES = new Set([
  'i', 'j', 'k', 'l', 'left', 'right', 'lo', 'hi', 'low', 'high',
  'mid', 'start', 'end', 'begin', 'slow', 'fast', 'top', 'bottom',
  'front', 'rear', 'head', 'tail', 'p', 'q', 'idx', 'index',
  'windowStart', 'windowEnd', 'l1', 'l2', 'r1', 'r2',
]);

// ────────────────────────────────────────────
// Instrumentation: inject recording after statements
// ────────────────────────────────────────────

/**
 * Instrument transpiled JS code by inserting __rec() calls after
 * each semicolon-terminated statement. This captures variable state
 * at every step for visualization.
 */
function instrumentCode(jsCode, varNames) {
  // Build the recording call string. Each variable access is wrapped in
  // individual try-catch for safety (handles scope / not-yet-declared issues).
  const varCaptures = varNames.map(v =>
    `try{__v['${v}']=__c(${v})}catch(e){}`
  ).join(';');
  const recCall = `{${varCaptures};__rec(__v);}`;

  const lines = jsCode.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Always push the original line
    result.push(line);

    // Skip empty, comments, braces-only, function/class declarations, block openers
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;
    if (trimmed === '{' || trimmed === '}' || trimmed === '} else {' || trimmed === '});') continue;
    if (/^\s*(?:function|class)\s/.test(trimmed)) continue;
    if (/^\s*(?:if|else|while|for|switch|try|catch|finally)\s*[\({]/.test(trimmed) && !trimmed.endsWith(';')) continue;
    if (trimmed.startsWith('} else if') || trimmed.startsWith('} else')) continue;
    if (trimmed === 'break;' || trimmed === 'continue;') continue;
    if (trimmed.startsWith('return ') || trimmed === 'return;') {
      // Don't instrument after return — won't execute. Instead, instrument before.
      // Remove the line we just pushed and add instrumented version.
      result.pop();
      const indent = line.match(/^(\s*)/)?.[1] || '';
      result.push(`${indent}${recCall}`);
      result.push(line);
      continue;
    }

    // Instrument after semicolon-terminated statements
    if (trimmed.endsWith(';') || trimmed.endsWith(';}')){
      const indent = line.match(/^(\s*)/)?.[1] || '';
      result.push(`${indent}${recCall}`);
    }
  }

  return result.join('\n');
}

// ────────────────────────────────────────────
// Build the execution wrapper with full instrumentation
// ────────────────────────────────────────────

function buildExecutionWrapper(jsCode, mainFunc, parsedInput, originalCode) {
  const paramNames = mainFunc.params.split(',').map(p => p.trim().split(/\s+/).pop()).filter(Boolean);
  const args = mapInputToParams(paramNames, parsedInput, originalCode);
  const structureHints = detectStructures(originalCode, parsedInput);
  const argStr = args.map(a => JSON.stringify(a)).join(', ');

  // Extract variable names for instrumentation
  const varNames = extractVariableNames(jsCode, paramNames);

  // Instrument the transpiled code
  const instrumented = instrumentCode(jsCode, varNames);

  // Build initial structures for first step
  const initStructuresCode = structureHints.map(s => {
    if (s.type === 'array' && s.values) {
      return `__initS['${s.id}'] = { type: 'array', values: ${JSON.stringify(s.values)}, label: '${s.label}' };`;
    }
    if (s.type === 'matrix' && s.values) {
      return `__initS['${s.id}'] = { type: 'matrix', grid: ${JSON.stringify(s.values)}, label: '${s.label}' };`;
    }
    if (s.type === 'graph') {
      const n = s.n || 0;
      const edges = s.edges || [];
      const pos = circleLayout(n, 220, 140, Math.min(110, n * 15));
      const nodes = pos.map((p, idx) => ({ id: idx, x: p.x, y: p.y }));
      const edgeList = edges.map(e => ({ from: e[0], to: e[1], weight: e.length > 2 ? e[2] : undefined }));
      return `__initS['graph'] = { type: 'graph', nodes: ${JSON.stringify(nodes)}, edges: ${JSON.stringify(edgeList)} };`;
    }
    return '';
  }).filter(Boolean).join('\n    ');

  const wrappedCode = `
(function() {
  var __steps = [];
  var __stepCount = 0;
  var __MAX = ${MAX_STEPS};
  var __startTime = Date.now();
  var __error = null;
  var __prev = {};  // Previous variable snapshot for change detection
  var __v = {};     // Current variable capture object

  // ── Deep clone helper ──
  function __c(val) {
    if (val === null || val === undefined) return val;
    if (typeof val !== 'object') return val;
    // Array
    if (Array.isArray(val)) {
      return val.map(function(item) {
        if (Array.isArray(item)) return item.slice();
        if (item && typeof item === 'object') {
          try { return JSON.parse(JSON.stringify(item)); } catch(e) { return item; }
        }
        return item;
      });
    }
    // Map → plain object
    if (val instanceof Map) {
      var obj = {};
      val.forEach(function(v, k) { obj[String(k)] = __c(v); });
      return obj;
    }
    // Set → array
    if (val instanceof Set) { return Array.from(val); }
    // Linked list node (val + next)
    if ('val' in val && 'next' in val && !('left' in val)) {
      var arr = []; var node = val; var seen = 0;
      while (node && seen < 200) { arr.push(node.val); node = node.next; seen++; }
      return arr;
    }
    // Tree node (val + left + right) → level-order array
    if ('val' in val && 'left' in val && 'right' in val) {
      var res = []; var queue = [val];
      while (queue.length > 0 && res.length < 200) {
        var n = queue.shift();
        if (n === null) { res.push(null); continue; }
        res.push(n.val);
        queue.push(n.left);
        queue.push(n.right);
      }
      // Trim trailing nulls
      while (res.length > 0 && res[res.length - 1] === null) res.pop();
      return res;
    }
    // General object
    try { return JSON.parse(JSON.stringify(val)); } catch(e) { return String(val); }
  }

  // ── Build structures from current variables ──
  function __buildStructures(vars) {
    var structs = {};
    var arrayIds = [];  // Track which struct IDs are arrays (for pointer attachment)

    for (var name in vars) {
      var val = vars[name];
      if (val === undefined || val === null) continue;

      // 2D array → matrix
      if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) {
        structs[name] = { type: 'matrix', grid: val, label: name };
        continue;
      }
      // 1D array → array structure
      if (Array.isArray(val) && val.length > 0) {
        structs[name] = { type: 'array', values: val, label: name };
        arrayIds.push(name);
        continue;
      }
      // Map (converted to object by __c) or plain object with non-trivial keys → hashmap
      if (typeof val === 'object' && !Array.isArray(val)) {
        var keys = Object.keys(val);
        if (keys.length > 0 && keys.length <= 50) {
          structs[name] = { type: 'hashmap', entries: keys.map(function(k) { return { key: k, value: val[k] }; }), label: name };
        }
      }
    }

    // Auto-attach integer pointer variables to the first array
    if (arrayIds.length > 0) {
      var primaryArr = arrayIds[0];
      var pointers = [];
      for (var pName in vars) {
        if (typeof vars[pName] === 'number' && Number.isInteger(vars[pName]) && vars[pName] >= 0) {
          // Check if this is a known pointer name or a single-letter variable
          if (POINTER_SET.has(pName) || (pName.length <= 2 && /^[a-z]/.test(pName))) {
            var pVal = vars[pName];
            var arrLen = structs[primaryArr] && structs[primaryArr].values ? structs[primaryArr].values.length : Infinity;
            if (pVal < arrLen) {
              pointers.push({ index: pVal, label: pName, color: POINTER_COLORS[pointers.length % POINTER_COLORS.length] });
            }
          }
        }
      }
      if (pointers.length > 0 && structs[primaryArr]) {
        structs[primaryArr].pointers = pointers;
      }
    }

    return structs;
  }

  // Pointer name set and colors (injected as data)
  var POINTER_SET = new Set(${JSON.stringify([...POINTER_NAMES])});
  var POINTER_COLORS = ['#4f8ff7', '#f87171', '#34d399', '#fbbf24', '#a78bfa', '#fb923c'];

  // ── Record a step ──
  function __rec(vars) {
    if (__stepCount >= __MAX) throw new Error('__MAX_STEPS');
    if (Date.now() - __startTime > ${MAX_TIME_MS}) throw new Error('__TIMEOUT');

    // Find changed variables
    var changed = [];
    var hasChange = false;
    for (var name in vars) {
      var cur = JSON.stringify(vars[name]);
      var prev = JSON.stringify(__prev[name]);
      if (cur !== prev) {
        changed.push(name);
        hasChange = true;
      }
    }
    // Also check for new variables in prev not in vars
    for (var name in __prev) {
      if (!(name in vars) && __prev[name] !== undefined) {
        hasChange = true;
      }
    }

    // Skip duplicate steps (nothing changed)
    if (!hasChange && __stepCount > 0) return;

    __stepCount++;

    // Build message from changed variables
    var msg = '';
    if (changed.length === 0) {
      msg = 'Initialize';
    } else if (changed.length <= 3) {
      msg = changed.map(function(n) {
        var v = vars[n];
        var display = (typeof v === 'object') ? JSON.stringify(v) : String(v);
        if (display.length > 40) display = display.substring(0, 37) + '...';
        return n + ' = ' + display;
      }).join(', ');
    } else {
      msg = 'Updated ' + changed.length + ' variables: ' + changed.slice(0, 3).join(', ') + '...';
    }

    // Build structures from variable values
    var structs = __buildStructures(vars);

    // Build highlights for changed array cells
    var highlights = {};
    for (var ci = 0; ci < changed.length; ci++) {
      var cname = changed[ci];
      if (structs[cname] && structs[cname].type === 'array' && __prev[cname]) {
        var prevArr = __prev[cname];
        var curArr = vars[cname];
        if (Array.isArray(prevArr) && Array.isArray(curArr)) {
          var changedCells = [];
          var maxLen = Math.max(prevArr.length, curArr.length);
          for (var ci2 = 0; ci2 < maxLen; ci2++) {
            if (ci2 >= prevArr.length || ci2 >= curArr.length || prevArr[ci2] !== curArr[ci2]) {
              changedCells.push({ index: ci2, color: '#fbbf24' });
            }
          }
          if (changedCells.length > 0) highlights[cname] = { cells: changedCells };
        }
      }
    }

    // Determine step color
    var color = changed.length > 0 ? '#4f8ff7' : '#34d399';

    // Save snapshot for next comparison
    __prev = {};
    for (var pn in vars) { __prev[pn] = vars[pn]; }

    __steps.push({
      message: msg,
      color: color,
      variables: JSON.parse(JSON.stringify(vars)),
      changedVars: new Set(changed),
      structures: structs,
      highlights: highlights,
      codeLines: [],
      codeLine: -1,
    });
  }

  try {
    // Initial structures
    var __initS = {};
    ${initStructuresCode}

    // Record initial state
    __steps.push({
      message: 'Initialize with input: ${paramNames.join(', ')}',
      color: '#4f8ff7',
      variables: ${JSON.stringify(parsedInput)},
      changedVars: new Set(),
      structures: __initS,
      highlights: {},
      codeLines: [],
      codeLine: -1,
    });
    __stepCount++;

    // ── User code (transpiled & instrumented) ──
    ${instrumented}

    // ── Execute the main function ──
    var __result = ${mainFunc.name}(${argStr});

    // Record final result
    var __finalVars = {};
    __finalVars['result'] = __c(__result);
    ${paramNames.map(p => `try{__finalVars['${p}']=__c(${p})}catch(e){}`).join(';')};
    var __finalStructs = __buildStructures(__finalVars);
    __steps.push({
      message: 'Result: ' + JSON.stringify(__c(__result)),
      color: '#34d399',
      variables: __finalVars,
      changedVars: new Set(['result']),
      structures: __finalStructs,
      highlights: {},
      codeLines: [],
      codeLine: -1,
    });

  } catch(e) {
    if (e.message === '__MAX_STEPS') {
      __error = 'Reached maximum step limit (' + __MAX + '). The algorithm may have too many iterations for visualization.';
    } else if (e.message === '__TIMEOUT') {
      __error = 'Execution timed out (' + ${MAX_TIME_MS} + 'ms). The algorithm may be too slow for the given input.';
    } else {
      __error = 'Runtime error: ' + e.message + (e.stack ? ' | ' + e.stack.split('\\n').slice(0,2).join(' ') : '');
    }
  }

  return { steps: __steps, error: __error };
})()`;

  return { wrappedCode, argList: args };
}

// ────────────────────────────────────────────
// Input → parameter mapping (unchanged)
// ────────────────────────────────────────────

function mapInputToParams(paramNames, parsedInput, originalCode) {
  const args = [];
  const inputKeys = Object.keys(parsedInput);

  for (const param of paramNames) {
    const pLower = param.toLowerCase();
    // Direct match
    if (parsedInput[param] !== undefined) {
      args.push(parsedInput[param]);
      continue;
    }
    // Common mappings
    if ((pLower === 'nums' || pLower === 'arr' || pLower === 'numbers' || pLower === 'array') && (parsedInput.nums || parsedInput.arr)) {
      args.push(parsedInput.nums || parsedInput.arr);
      continue;
    }
    if (pLower === 'target' && parsedInput.target !== undefined) { args.push(parsedInput.target); continue; }
    if (pLower === 'n' && parsedInput.n !== undefined) { args.push(parsedInput.n); continue; }
    if (pLower === 'k' && parsedInput.k !== undefined) { args.push(parsedInput.k); continue; }
    if ((pLower === 's' || pLower === 'str' || pLower === 'word' || pLower === 'text') && parsedInput.s !== undefined) {
      args.push(parsedInput.s);
      continue;
    }
    if (pLower === 't' && parsedInput.t !== undefined) { args.push(parsedInput.t); continue; }
    if ((pLower === 'grid' || pLower === 'matrix' || pLower === 'board') && parsedInput.grid !== undefined) {
      args.push(parsedInput.grid);
      continue;
    }
    if ((pLower === 'head' || pLower === 'list') && (parsedInput.list || parsedInput.arr || parsedInput.nums)) {
      const vals = parsedInput.list || parsedInput.arr || parsedInput.nums;
      args.push(buildLinkedList(vals));
      continue;
    }
    if ((pLower === 'root' || pLower === 'tree') && (parsedInput.tree || parsedInput.arr || parsedInput.nums)) {
      const vals = parsedInput.tree || parsedInput.arr || parsedInput.nums;
      args.push(buildTree(vals));
      continue;
    }
    if ((pLower === 'edges' || pLower === 'connections') && parsedInput.edges !== undefined) {
      args.push(parsedInput.edges);
      continue;
    }
    if ((pLower === 'words' || pLower === 'strs' || pLower === 'wordlist') && parsedInput.words !== undefined) {
      args.push(parsedInput.words);
      continue;
    }
    if ((pLower === 'intervals' || pLower === 'meetings') && parsedInput.intervals !== undefined) {
      args.push(parsedInput.intervals);
      continue;
    }
    // Positional fallback
    const idx = paramNames.indexOf(param);
    if (idx < inputKeys.length) {
      args.push(parsedInput[inputKeys[idx]]);
      continue;
    }
    args.push(null);
  }
  return args;
}

// ────────────────────────────────────────────
// Data structure builders (unchanged)
// ────────────────────────────────────────────

function buildLinkedList(arr) {
  if (!arr || arr.length === 0) return null;
  const head = { val: arr[0], next: null };
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = { val: arr[i], next: null };
    curr = curr.next;
  }
  return head;
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const nodes = arr.map(v => v === null ? null : { val: v, left: null, right: null });
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i] === null) continue;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < nodes.length) nodes[i].left = nodes[left];
    if (right < nodes.length) nodes[i].right = nodes[right];
  }
  return nodes[0];
}

// ────────────────────────────────────────────
// Sandbox executor
// ────────────────────────────────────────────

function runInSandbox(wrappedCode) {
  try {
    const fn = new Function(wrappedCode.replace(/\breturn\s*\{/, 'return {'));
    const start = Date.now();
    const result = fn();
    const elapsed = Date.now() - start;

    if (elapsed > MAX_TIME_MS + 500) {
      return { steps: result?.steps || [], error: `Execution took ${elapsed}ms (limit: ${MAX_TIME_MS}ms)` };
    }

    return {
      steps: result?.steps || [],
      error: result?.error || null,
    };
  } catch (err) {
    // Provide more helpful error messages
    let msg = err.message || String(err);
    if (msg.includes('is not defined')) {
      msg += '. This may be a transpilation issue — try simplifying the code or using JavaScript directly.';
    } else if (msg.includes('is not a function')) {
      msg += '. A method call could not be converted properly — check for unsupported library functions.';
    }
    return { steps: [], error: `Runtime error: ${msg}` };
  }
}

// ────────────────────────────────────────────
// Enhanced detection (unchanged)
// ────────────────────────────────────────────
export function enhancedDetect(code, hints) {
  if (!code) return null;

  const lower = code.toLowerCase();
  const hintText = [hints?.intuition, hints?.steps, hints?.algorithmName, hints?.approach].filter(Boolean).join(' ').toLowerCase();
  const combined = lower + ' ' + hintText;

  const HINT_PATTERNS = [
    { id: 'binary_search', kw: ['binary search', 'bisect', 'left right mid'] },
    { id: 'two_pointer', kw: ['two pointer', 'two-pointer', '2 pointer'] },
    { id: 'sliding_window', kw: ['sliding window', 'window size'] },
    { id: 'bfs', kw: ['breadth first', 'bfs', 'level order'] },
    { id: 'dfs', kw: ['depth first', 'dfs'] },
    { id: 'dp_1d', kw: ['dynamic programming', 'dp', 'memoization', 'tabulation'] },
    { id: 'dp_2d', kw: ['2d dp', 'lcs', 'longest common', 'knapsack', 'edit distance'] },
    { id: 'backtracking', kw: ['backtracking', 'backtrack', 'permutation', 'combination', 'subset'] },
    { id: 'topological', kw: ['topological sort', 'topo sort', 'kahn'] },
    { id: 'dijkstra', kw: ['dijkstra', 'shortest path'] },
    { id: 'sort', kw: ['sorting', 'merge sort', 'quick sort', 'bubble sort'] },
    { id: 'linked_list', kw: ['linked list', 'listnode'] },
    { id: 'bst', kw: ['binary tree', 'bst', 'treenode', 'inorder', 'preorder'] },
    { id: 'heap', kw: ['heap', 'priority queue', 'kth largest', 'kth smallest'] },
    { id: 'monotonic_stack', kw: ['monotonic stack', 'next greater', 'next smaller'] },
    { id: 'union_find', kw: ['union find', 'disjoint set', 'connected component'] },
    { id: 'trie', kw: ['trie', 'prefix tree'] },
    { id: 'matrix_traversal', kw: ['grid', 'matrix', 'island', 'flood fill'] },
    { id: 'tarjan', kw: ['tarjan', 'bridge', 'articulation'] },
    { id: 'kruskal', kw: ['kruskal', 'minimum spanning tree', 'mst'] },
    { id: 'string_window', kw: ['substring', 'anagram', 'character frequency'] },
  ];

  for (const p of HINT_PATTERNS) {
    for (const kw of p.kw) {
      if (combined.includes(kw)) return p.id;
    }
  }

  return null;
}
