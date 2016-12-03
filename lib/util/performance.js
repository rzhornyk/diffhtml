export const marks = new Map();
export const prefix = 'diffHTML';

const wantsPerfChecks = location.search.includes('diff_perf');

export function mark(name) {
  if (!wantsPerfChecks) { return; }

  const endName = `${name}-end`;

  if (!this.marks.has(name)) {
    this.marks.set(name, performance.now());
    performance.mark(name);
  }
  else {
    const { prefix } = this;
    const totalMs = (performance.now() - this.marks.get(name)).toFixed(3);

    this.marks.delete(name);

    performance.mark(endName);
    performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
  }
}
