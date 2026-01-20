const OktoLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular gear/cog-like logo matching reference */}
      <g>
        {/* Center circle with cutout */}
        <circle cx="50" cy="50" r="18" />
        
        {/* 8 rounded petals/spokes radiating outward */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="18"
            rx="12"
            ry="18"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </g>
    </svg>
  );
};

export default OktoLogo;
