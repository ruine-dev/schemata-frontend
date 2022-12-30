export function Markers() {
  return (
    <svg
      style={{ position: 'absolute', top: 0, left: 0 }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="many"
          viewBox="0 0 10 20"
          markerUnits="strokeWidth"
          markerHeight={20}
          markerWidth={10}
          refX={7}
          refY={10}
          orient="auto-start-reverse"
          className="text-slate-400"
        >
          <g clipPath="url(#clip0_2_2)">
            <line
              x1="0.382683"
              y1="10.2605"
              x2="22.5558"
              y2="19.4449"
              stroke="currentColor"
              strokeWidth={1}
            />
            <line
              x1="-0.0326773"
              y1="10.2605"
              x2="22.1404"
              y2="1.07612"
              stroke="currentColor"
              strokeWidth={1}
            />
            <line y1="10.1844" x2="20" y2="10.1844" stroke="currentColor" strokeWidth={1} />
          </g>
          <defs>
            <clipPath id="clip0_2_2">
              <rect width="11" height="20" fill="white" />
            </clipPath>
          </defs>
        </marker>
        <marker
          id="one"
          viewBox="0 0 10 20"
          markerUnits="strokeWidth"
          markerHeight={20}
          markerWidth={10}
          refX={7}
          refY={9.5}
          orient="auto-start-reverse"
          className="text-slate-400"
        >
          <line x1="1" y1="16" x2="1" y2="4" stroke="currentColor" strokeWidth={1} />
          <line x1="2" y1="9.5" x2="10" y2="9.5" stroke="currentColor" strokeWidth={1} />
        </marker>
      </defs>
    </svg>
  );
}
