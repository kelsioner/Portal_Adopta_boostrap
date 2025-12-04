document.addEventListener("DOMContentLoaded", function() {

  // Referencias DOM
  const form = document.getElementById("form-contacto");
  const miBoton = document.getElementById("submit-button");
  const nombreInput = document.getElementById("nombre-apellidos");
  const emailInput = document.getElementById("correo-electronico");
  const mensajeInput = document.getElementById("mensaje");

  // Popup Refs
  const overlay = document.getElementById("confirmacion-overlay");
  const popupTexto = document.getElementById("confirmacion-texto");
  const cerrarBoton = document.getElementById("confirmacion-cerrar");

  let formularioEnviadoExitosamente = false;

  function mostrarMensaje(mensaje, esError = false) {
    popupTexto.textContent = mensaje;
    popupTexto.style.color = esError ? "#c0392b" : "#454545";
    overlay.style.display = "flex";
  }

  function ocultarMensaje() {
    overlay.style.display = "none";
    if (formularioEnviadoExitosamente) {
      window.location.href = "../index.html";
    }
  }

  cerrarBoton.addEventListener("click", ocultarMensaje);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) ocultarMensaje(); });

  miBoton.addEventListener("click", function(event) {
    event.preventDefault(); 
    
    const nombreValue = nombreInput.value.trim();
    const emailValue = emailInput.value.trim();
    const mensajeValue = mensajeInput.value.trim();
    
    if (nombreValue === "") {
      mostrarMensaje("Por favor, rellena los campos.", true);
    } else if (emailValue === "") {
      mostrarMensaje("Por favor, introduce tu correo electrónico.", true);
    } else if (!validarEmail(emailValue)) {
      mostrarMensaje("El formato del correo no es válido.", true);
    } else if (mensajeValue === "") {
      mostrarMensaje("Por favor, escribe un mensaje.", true);
    } else {
      formularioEnviadoExitosamente = true; 
      mostrarMensaje("¡Mensaje enviado con éxito! Gracias por contactarnos.");
      form.reset(); 
    }
  });

  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});