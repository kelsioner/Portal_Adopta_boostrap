// Espera a que todo el HTML esté cargado
document.addEventListener("DOMContentLoaded", function() {

  // --- Referencias a elementos del DOM ---
  const form = document.getElementById("form-contacto");
  const miBoton = document.getElementById("submit-button");
  
  // Referencias a los campos del formulario
  const nombreInput = document.getElementById("nombre-apellidos");
  const emailInput = document.getElementById("correo-electronico");
  const mensajeInput = document.getElementById("mensaje");

  // Referencias al popup de confirmación
  const overlay = document.getElementById("confirmacion-overlay");
  const popupTexto = document.getElementById("confirmacion-texto");
  const cerrarBoton = document.getElementById("confirmacion-cerrar");

  // +++ NUEVA VARIABLE DE ESTADO +++
  // Esta variable nos ayudará a saber si debemos redirigir al cerrar el popup
  let formularioEnviadoExitosamente = false;

  // --- Función para mostrar el popup ---
  function mostrarMensaje(mensaje, esError = false) {
    popupTexto.textContent = mensaje;
    popupTexto.style.color = esError ? "#c0392b" : "#454545";
    overlay.style.display = "flex";
  }

  // --- Función para ocultar el popup (MODIFICADA) ---
  function ocultarMensaje() {
    overlay.style.display = "none";

    // +++ LÓGICA DE REDIRECCIÓN +++
    // Comprueba si el formulario se había enviado con éxito antes de cerrar
    if (formularioEnviadoExitosamente) {
      // Redirige a la página de inicio (subiendo un nivel en la carpeta)
      window.location.href = "../index.html";
    }
  }

  // --- Event Listeners para cerrar el popup ---
  cerrarBoton.addEventListener("click", ocultarMensaje);
  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
      ocultarMensaje();
    }
  });

  // --- Event Listener principal para el botón de "Enviar" (MODIFICADO) ---
  miBoton.addEventListener("click", function(event) {
    
    // 1. Previene que el formulario se envíe por defecto
    event.preventDefault(); 
    
    // 2. Obtener y limpiar los valores
    const nombreValue = nombreInput.value.trim();
    const emailValue = emailInput.value.trim();
    const mensajeValue = mensajeInput.value.trim();
    
    // 3. Validación de todos los campos
    if (nombreValue === "") {
      mostrarMensaje("Por favor, rellena los campos.", true);
    
    } else if (emailValue === "") {
      mostrarMensaje("Por favor, introduce tu correo electrónico.", true);
    
    } else if (!validarEmail(emailValue)) {
      mostrarMensaje("El formato del correo no es válido. (Ej: tu@correo.com)", true);
    
    } else if (mensajeValue === "") {
      mostrarMensaje("Por favor, escribe un mensaje.", true);
    
    } else {
      // --- ÉXITO ---
      
      // +++ MARCAMOS LA VARIABLE COMO 'TRUE' +++
      // Le decimos a nuestro script que el envío fue exitoso
      formularioEnviadoExitosamente = true; 
      
      mostrarMensaje("¡Mensaje enviado con éxito! Gracias por contactarnos.");
      
      // Limpiar el formulario
      form.reset(); 
    }
  });

  // --- Función de utilidad para validar email (regex simple) ---
  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

});