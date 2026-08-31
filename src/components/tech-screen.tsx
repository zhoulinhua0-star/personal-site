const rows = [
  [18, 44, 27, 56],
  [35, 18, 48, 31],
  [52, 40, 22, 38],
  [27, 61, 33, 19],
  [46, 24, 55, 29],
];

export function TechScreen() {
  return (
    <div className="tech-visual" aria-hidden="true">
      <div className="tech-visual__glow" />
      <svg className="tech-visual__screen" viewBox="0 0 980 660">
        <defs>
          <linearGradient id="screen-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d8f0ff" stopOpacity=".32" />
            <stop offset=".48" stopColor="#5eb8ff" stopOpacity=".16" />
            <stop offset="1" stopColor="#002a93" stopOpacity=".08" />
          </linearGradient>
          <linearGradient id="line-blue" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#dff7ff" />
            <stop offset="1" stopColor="#77c9ff" stopOpacity=".32" />
          </linearGradient>
          <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="screen-frame">
          <path d="M83 72 839 45l52 42-9 430-63 49-731 18-37-48 7-417Z" />
          <path className="screen-surface" d="M96 99 824 76l37 27-8 385-47 38-691 17-34-31 7-379Z" />
        </g>

        <g className="screen-grid">
          {Array.from({ length: 12 }, (_, index) => (
            <path key={`v-${index}`} d={`M${128 + index * 57} 112v392`} />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <path key={`h-${index}`} d={`M104 ${148 + index * 52}h728`} />
          ))}
        </g>

        <g className="screen-content">
          <rect x="116" y="120" width="240" height="146" rx="8" />
          <rect x="374" y="120" width="456" height="146" rx="8" />
          <rect x="116" y="284" width="350" height="218" rx="8" />
          <rect x="484" y="284" width="346" height="218" rx="8" />
        </g>

        <g className="data-lines">
          {rows.map((row, rowIndex) =>
            row.map((width, columnIndex) => (
              <rect
                key={`${rowIndex}-${columnIndex}`}
                x={136 + columnIndex * 51}
                y={142 + rowIndex * 20}
                width={width}
                height="4"
                rx="2"
              />
            )),
          )}
        </g>

        <g className="chart-lines" fill="none">
          <path d="M396 228 438 191l41 13 38-50 44 33 50-15 41-26 49 33 51-43 44 11 53-7" />
          <path d="M396 242 446 231l51 4 42-21 56 9 45-25 42 10 58-15 56 9" />
          <path d="m510 438 36-52 40 19 44-71 41 50 43-30 42 17 43-55 43 27" />
        </g>

        <g className="screen-rings" fill="none">
          <circle cx="221" cy="386" r="68" />
          <circle cx="221" cy="386" r="48" />
          <circle cx="221" cy="386" r="24" />
          <path d="M221 310v22M221 440v22M145 386h22M275 386h22" />
        </g>

        <g className="screen-status">
          <circle cx="128" cy="521" r="5" />
          <rect x="142" y="517" width="92" height="8" rx="4" />
          <rect x="724" y="517" width="96" height="8" rx="4" />
        </g>

        <g className="desk" filter="url(#soft-glow)">
          <path d="m368 576 12-29h191l18 29" />
          <path d="M316 584h324l34 29H279Z" />
          <path d="M198 598h97l21 19H176Z" />
          <path d="M660 598h95l27 19H638Z" />
        </g>
      </svg>
      <div className="tech-visual__scan" />
    </div>
  );
}
