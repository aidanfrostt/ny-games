import { useLayoutEffect, useRef, useState } from "react";

function keyOf([r, c]) {
  return `${r},${c}`;
}

/** Fallback: uniform grid (no gaps) - used before measure */
function pathToPointsFallback(path) {
  return path.map(([r, c]) => `${c + 0.5},${r + 0.5}`).join(" ");
}

export default function StrandsGrid({
  grid,
  foundCellClassMap,
  foundWordPaths = [],
  selectedPath,
  onCellDown,
  onCellEnter,
  onCellUp,
  disabled,
  pointerDownRef,
}) {
  const wrapperRef = useRef(null);
  const gridRef = useRef(null);
  const [cellCenters, setCellCenters] = useState(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const gridEl = gridRef.current;
    if (!wrapper || !gridEl) return;

    const measure = () => {
      const wr = wrapper.getBoundingClientRect();
      const cells = gridEl.querySelectorAll('[role="gridcell"]');
      const map = new Map();
      cells.forEach((cell) => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        const rect = cell.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - wr.left;
        const centerY = rect.top + rect.height / 2 - wr.top;
        const svgX = (centerX / wr.width) * 6;
        const svgY = (centerY / wr.height) * 8;
        map.set(keyOf([r, c]), `${svgX},${svgY}`);
      });
      setCellCenters(map);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [grid]);

  function pathToPoints(path) {
    if (!cellCenters) return pathToPointsFallback(path);
    const pts = path.map((p) => cellCenters.get(keyOf(p)));
    return pts.every(Boolean) ? pts.join(" ") : pathToPointsFallback(path);
  }

  const selectedSet = new Set(selectedPath.map(keyOf));
  const selectedPathPoints =
    selectedPath.length >= 2 ? pathToPoints(selectedPath) : "";

  return (
    <div ref={wrapperRef} className="strands-grid-wrapper-inner">
      <svg
        className="strands-string"
        viewBox="0 0 6 8"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Found words: connecting lines in proper order (theme=blue, spangram=yellow) */}
        {foundWordPaths.map(({ path, isSpangram }, i) =>
          path.length >= 2 ? (
            <polyline
              key={i}
              points={pathToPoints(path)}
              fill="none"
              stroke={isSpangram ? "#d4a82a" : "#5384b8"}
              strokeWidth="0.18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null
        )}
        {/* Active selection: grey line */}
        {selectedPathPoints && (
          <polyline
            points={selectedPathPoints}
            fill="none"
            stroke="#9e9e9e"
            strokeWidth="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <div
        ref={gridRef}
        className="strands-grid"
        role="grid"
        aria-label="Strands letter grid"
        onPointerDownCapture={(e) => {
          if (!disabled && e.target.closest('button[role="gridcell"]')) {
            pointerDownRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
        onPointerMove={(e) => {
          if (!pointerDownRef?.current) return;
          // On touch, e.target stays at touch start; use elementFromPoint for current position
          const el = document.elementFromPoint(e.clientX, e.clientY);
          const cell = el?.closest('button[role="gridcell"]');
          if (cell && cell.dataset.row !== undefined) {
            const r = parseInt(cell.dataset.row, 10);
            const c = parseInt(cell.dataset.col, 10);
            onCellEnter(r, c);
          }
        }}
        onPointerUp={onCellUp}
        onPointerCancel={onCellUp}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const k = `${r},${c}`;
            const foundClass = foundCellClassMap.get(k);
            const isSelected = selectedSet.has(k);
            const classes = ["cell"];
            if (foundClass) classes.push(foundClass);
            if (isSelected) classes.push("cell-selected");

            return (
              <button
                key={k}
                type="button"
                role="gridcell"
                className={classes.join(" ")}
                data-row={r}
                data-col={c}
                onPointerDown={() => onCellDown(r, c)}
                onPointerEnter={() => onCellEnter(r, c)}
                onPointerUp={onCellUp}
                disabled={disabled}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
