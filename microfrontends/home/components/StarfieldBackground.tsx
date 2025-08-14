export function StarfieldBackground() {
  // Generate random positions for stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-starithm-electric-violet/40"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        />
      ))}
      
      {/* Abstract geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 border-2 border-starithm-electric-violet/30 rounded-full"></div>
      <div className="absolute top-40 right-40 w-16 h-16 bg-gradient-to-br from-starithm-veronica/30 to-transparent rounded-lg rotate-45"></div>
      <div className="absolute bottom-32 left-16 w-24 h-24 border border-starithm-selective-yellow/40 rotate-12">
        <div className="w-full h-full border border-starithm-electric-violet/30 rotate-45"></div>
      </div>
      <div className="absolute bottom-20 right-32 w-20 h-20 bg-gradient-to-tr from-starithm-veronica/20 to-starithm-electric-violet/20 rounded-full"></div>
    </div>
  );
}