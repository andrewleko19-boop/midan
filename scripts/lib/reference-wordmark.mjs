/**
 * Loads the approved wordmark geometry by RUNNING the reference file's own code
 * (docs/reference/wordmark-exploration-F1-F6.html) in a sandbox with stubbed DOM calls.
 * Nothing is redrawn or re-implemented: the SVG comes from the reference's wm() function.
 */
import fs from 'node:fs';
import vm from 'node:vm';

export function loadReference(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const match = /<script>([\s\S]*?)<\/script>/.exec(html);
  if (!match) throw new Error(`No <script> found in ${htmlPath}`);

  const noop = () => {};
  const sandbox = {
    document: { addEventListener: noop, querySelector: () => ({ innerHTML: '' }) },
    window: { scrollTo: noop },
    scrollTo: noop,
    scrollY: 0,
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(`${match[1]}\n;globalThis.__ref = { wm, FP, W };`, sandbox, { filename: 'wordmark-reference.html' });

  const ref = sandbox.__ref;
  if (!ref?.wm || !ref?.FP || !ref?.W?.fin) throw new Error('Reference file does not expose wm / FP / W.fin (final F1–F6 composition).');
  return ref;
}
