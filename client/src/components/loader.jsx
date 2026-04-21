import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader" />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
  position: absolute;
  top: 50%;   
  left: 50%;  
  transform: translate(-50%, -50%);
  width: 30px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side, #000 90%, #0000) 0 /
      calc(100% / 3) 100% space;
    clip-path: inset(0 100% 0 0);
    animation: l1 1s steps(4) infinite;
  }
  @keyframes l1 {
    to {
      clip-path: inset(0 -34% 0 0);
    }
  }`;

export default Loader;
