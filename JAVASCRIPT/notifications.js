document.addEventListener("DOMContentLoaded", function() {

  const form = document.getElementById("notification-form"); 
  const miBoton = document.getElementById("submit-button");
  const emailInput = document.getElementById("email-notificaciones");

  const overlay = document.getElementById("confirmacion-overlay");
  const popupTexto = document.getElementById("confirmacion-texto");
  const cerrarBoton = document.getElementById("confirmacion-cerrar");

  let suscripcionExitosa = false;

  function mostrarMensaje(mensaje, esError = false) {
    popupTexto.textContent = mensaje;
    popupTexto.style.color = esError ? "#c0392b" : "#454545";
    overlay.style.display = "flex"; 
  }

  function ocultarMensaje() {
    overlay.style.display = "none";
    if (suscripcionExitosa) {
      window.location.href = "../index.html";
    }
  }

  cerrarBoton.addEventListener("click", ocultarMensaje);
  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) ocultarMensaje();
  });

  miBoton.addEventListener("click", function(event) {
    event.preventDefault(); 
    const emailValue = emailInput.value.trim();
    
    if (emailValue === "") {
      mostrarMensaje("Por favor, introduce tu correo electrónico.", true);
    } else if (!validarEmail(emailValue)) {
      mostrarMensaje("El formato del correo no es válido.", true);
    } else {
      suscripcionExitosa = true;
      mostrarMensaje("¡Suscripción confirmada con éxito!");
      if(form) form.reset();
    }
  });

  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});