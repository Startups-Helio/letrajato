import React from 'react';
import CalculoOrcamento from '../components/CalculoOrcamento';
import NavBar from '../components/NavBar';

function Orcamento() {
  return (
    <div className="orcamento-page">
      <NavBar />
      <CalculoOrcamento />
    </div>
  );
}

export default Orcamento;