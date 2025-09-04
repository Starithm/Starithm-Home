import {
  StarfieldContainer,
  Star,
  GeometricCircle,
  GeometricSquare,
  GeometricDiamond,
  GeometricGradientCircle
} from "../styled_components/StarfieldBackground.styled";

export function StarfieldBackground() {
  // Generate random positions for stars
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
  }));

  return (
    <StarfieldContainer>
      {stars.map((star) => (
        <Star
          key={star.id}
          left={star.left}
          top={star.top}
          size={star.size}
        />
      ))}
      
      {/* Abstract geometric shapes */}
      <GeometricCircle />
      <GeometricSquare />
      <GeometricDiamond />
      <GeometricGradientCircle />
    </StarfieldContainer>
  );
}