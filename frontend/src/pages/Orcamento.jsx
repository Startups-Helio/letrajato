import React from 'react';
import CalculoOrcamento from '../components/CalculoOrcamento';
import NavBar from '../components/NewNavBar';

function Orcamento() {
  return (
    <div className="orcamento-page">
      <NavBar />
      <CalculoOrcamento />
    </div>
  );
}

export default Orcamento;