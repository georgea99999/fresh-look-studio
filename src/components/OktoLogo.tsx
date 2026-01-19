const OktoLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Octagonal flower pattern - 8 petals */}
      <g>
        {/* Center circle */}
        <circle cx="50" cy="50" r="14" />
        
        {/* 8 petal shapes radiating outward */}
        {/* Top */}
        <ellipse cx="50" cy="22" rx="10" ry="16" />
        {/* Bottom */}
        <ellipse cx="50" cy="78" rx="10" ry="16" />
        {/* Left */}
        <ellipse cx="22" cy="50" rx="16" ry="10" />
        {/* Right */}
        <ellipse cx="78" cy="50" rx="16" ry="10" />
        {/* Top-right */}
        <ellipse cx="70" cy="30" rx="10" ry="16" transform="rotate(45 70 30)" />
        {/* Top-left */}
        <ellipse cx="30" cy="30" rx="10" ry="16" transform="rotate(-45 30 30)" />
        {/* Bottom-right */}
        <ellipse cx="70" cy="70" rx="10" ry="16" transform="rotate(-45 70 70)" />
        {/* Bottom-left */}
        <ellipse cx="30" cy="70" rx="10" ry="16" transform="rotate(45 30 70)" />
      </g>
    </svg>
  );
};

export default OktoLogo;
