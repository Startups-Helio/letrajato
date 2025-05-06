import React from "react";
import NavBar from "../components/NavBar";
import "../styles/Form.css";

function VerificationPending() {
  return (
    <>
      <NavBar />
      <div className="form-container">
        <h1>Verificação Pendente</h1>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Sua conta ainda não foi verificada pelo administrador.</p>
          <p>Por favor, aguarde até que sua conta seja aprovada.</p>
          <p>Caso tenha dúvidas, entre em contato conosco:</p>
          <p><a href="mailto:letrajato.suporte@gmail.com">letrajato.suporte@gmail.com</a></p>
        </div>
      </div>
    </>
  );
}

export default VerificationPending;