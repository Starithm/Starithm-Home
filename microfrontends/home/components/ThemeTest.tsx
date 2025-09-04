import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  background-color: ${({ theme }) => theme?.background || 'red'};
  color: ${({ theme }) => theme?.foreground || 'white'};
  padding: 20px;
  margin: 20px;
  border: 2px solid ${({ theme }) => theme?.starithmElectricViolet || 'blue'};
`;

const ThemeInfo = styled.div`
  font-family: monospace;
  background: rgba(0,0,0,0.1);
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
`;

export const ThemeTest: React.FC = () => {
  return (
    <TestContainer>
      <h2>Theme Test Component</h2>
      <ThemeInfo>
        <strong>Theme Object:</strong> {JSON.stringify({ 
          background: 'theme?.background', 
          foreground: 'theme?.foreground',
          electricViolet: 'theme?.starithmElectricViolet'
        }, null, 2)}
      </ThemeInfo>
      <p>If you see this with proper colors, the theme is working!</p>
      <p>If you see red background, the theme is not being passed correctly.</p>
    </TestContainer>
  );
};
