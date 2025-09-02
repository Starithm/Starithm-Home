import styled from 'styled-components';

// Helper function to safely access theme properties
const getThemeValue = (theme: any, path: string, fallback: any) => {
  if (!theme) return fallback;
  const keys = path.split('.');
  let value = theme;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  return value || fallback;
};

// Main container
export const StarfieldContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

// Individual star
export const Star = styled.div<{ 
  left: number; 
  top: number; 
  size: number; 
}>`
  position: absolute;
  border-radius: 50%;
  background-color: ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}66;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

// Abstract geometric shapes
export const GeometricCircle = styled.div`
  position: absolute;
  top: 5rem;
  right: 5rem;
  width: 8rem;
  height: 8rem;
  border: 2px solid ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}4D;
  border-radius: 50%;
`;

export const GeometricSquare = styled.div`
  position: absolute;
  top: 10rem;
  right: 10rem;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}4D,
    transparent
  );
  border-radius: 0.5rem;
  transform: rotate(45deg);
`;

export const GeometricDiamond = styled.div`
  position: absolute;
  bottom: 8rem;
  left: 4rem;
  width: 6rem;
  height: 6rem;
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'starithmSelectiveYellow', '#FFB400')}66;
  transform: rotate(12deg);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}4D;
    transform: rotate(45deg);
  }
`;

export const GeometricGradientCircle = styled.div`
  position: absolute;
  bottom: 5rem;
  right: 8rem;
  width: 5rem;
  height: 5rem;
  background: linear-gradient(45deg, 
    ${({ theme }) => getThemeValue(theme, 'starithmVeronica', '#A239CA')}33,
    ${({ theme }) => getThemeValue(theme, 'starithmElectricViolet', '#770ff5')}33
  );
  border-radius: 50%;
`;
