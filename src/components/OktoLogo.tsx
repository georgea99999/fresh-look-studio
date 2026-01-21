const OktoLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hexagonal aperture logo - camera shutter style */}
      <g>
        {/* Outer hexagon */}
        <polygon 
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" 
          strokeWidth="3"
          fill="none"
        />
        
        {/* Aperture blades forming hexagonal spiral */}
        {/* Blade 1 - Top */}
        <polygon 
          points="50,5 70,18 58,35 35,28" 
          fill="currentColor" 
          stroke="none" 
        />
        {/* Blade 2 - Top Right */}
        <polygon 
          points="93,27.5 85,50 65,45 70,18" 
          fill="currentColor" 
          stroke="none" 
        />
        {/* Blade 3 - Bottom Right */}
        <polygon 
          points="93,72.5 70,82 58,65 85,50" 
          fill="currentColor" 
          stroke="none" 
        />
        {/* Blade 4 - Bottom */}
        <polygon 
          points="50,95 30,82 42,65 65,72" 
          fill="currentColor" 
          stroke="none" 
        />
        {/* Blade 5 - Bottom Left */}
        <polygon 
          points="7,72.5 15,50 35,55 30,82" 
          fill="currentColor" 
          stroke="none" 
        />
        {/* Blade 6 - Top Left */}
        <polygon 
          points="7,27.5 30,18 42,35 15,50" 
          fill="currentColor" 
          stroke="none" 
        />
        
        {/* Center hexagonal void */}
        <polygon 
          points="50,35 65,45 65,55 50,65 35,55 35,45" 
          fill="none"
          strokeWidth="0"
          className="fill-background"
        />
      </g>
    </svg>
  );
};

export default OktoLogo;