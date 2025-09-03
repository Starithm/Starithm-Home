import styled from "styled-components";

{/* <style>{`
    @keyframes borderFlow {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }
    .animated-border::before {
      content: "";
      position: absolute;
      inset: 0;
      padding: 2px; // border thickness
      border-radius: 0.5rem; // match rounded-lg
      background: linear-gradient(90deg, #ffc332, #8D0FF5, #6B46C1, #ffc332);
      background-size: 200% 100%;
      animation: borderFlow 3s linear infinite;
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
              mask-composite: exclude;
      z-index: 0;
    }
  `}</style> */}

export const AnimatedBorder = styled.div`
  animation: borderFlow 3s linear infinite;
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: 0;
  .animated-border::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2px; // border thickness
    border-radius: 0.5rem; // match rounded-lg
    background: linear-gradient(90deg, #ffc332, #8D0FF5, #6B46C1, #ffc332);
    background-size: 200% 100%;
    animation: borderFlow 3s linear infinite;
    -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
    z-index: 0;
    }
      keyframes borderFlow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

`;
