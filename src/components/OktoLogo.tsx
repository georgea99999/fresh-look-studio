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
      {/* Hexagonal aperture-style logo */}
      <g>
        {/* Outer hexagon */}
        <polygon 
          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5" 
          strokeWidth="3"
          fill="none"
        />
        
        {/* Inner triangular aperture blades creating the swirl effect */}
        <polygon points="50,20 35,45 50,38" fill="currentColor" stroke="none" />
        <polygon points="75,30 50,38 65,50" fill="currentColor" stroke="none" />
        <polygon points="75,70 65,50 50,62" fill="currentColor" stroke="none" />
        <polygon points="50,80 50,62 35,55" fill="currentColor" stroke="none" />
        <polygon points="25,70 35,55 22,50" fill="currentColor" stroke="none" />
        <polygon points="25,30 22,50 35,45" fill="currentColor" stroke="none" />
        
        {/* Center hexagonal void */}
        <polygon 
          points="50,38 65,50 50,62 35,55 22,50 35,45" 
          fill="none"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

export default OktoLogo;
