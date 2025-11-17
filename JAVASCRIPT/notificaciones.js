// Espera a que todo el HTML esté cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function() {

  // --- Referencias a elementos del DOM ---
  
  // +++ CAMBIO DE SELECTOR +++
  // Tu HTML no tenía un id="form-notificaciones" en el <form>.
  // He cambiado el selector para que apunte al <form> dentro de .notificaciones-box
  const form = document.querySelector(".notificaciones-box form"); 
  
  const miBoton = document.getElementById("submit-button");
  const emailInput = document.getElementById("email-notificaciones");

  // Referencias al popup de confirmación (que está en el HTML)
  const overlay = document.getElementById("confirmacion-overlay");
  const popupTexto = document.getElementById("confirmacion-texto");
  const cerrarBoton = document.getElementById("confirmacion-cerrar");

  // +++ NUEVA VARIABLE DE ESTADO +++
  // Nos dirá si debemos redirigir al cerrar el popup
  let suscripcionExitosa = false;

  // --- Función para mostrar el popup ---
  function mostrarMensaje(mensaje, esError = false) {
    popupTexto.textContent = mensaje;
    
    // Cambia el color del texto si es un mensaje de error
    if (esError) {
      popupTexto.style.color = "#c0392b"; // Un tono rojo
    } else {
      popupTexto.style.color = "#454545"; // Color de texto normal
    }
    
    overlay.style.display = "flex"; // Muestra el overlay y el popup
  }

  // --- Función para ocultar el popup (MODIFICADA) ---
  function ocultarMensaje() {
    overlay.style.display = "none";

    // +++ LÓGICA DE REDIRECCIÓN +++
    // Si la suscripción fue exitosa, redirige al index
    if (suscripcionExitosa) {
      window.location.href = "../index.html";
    }
  }

  // --- Event Listeners para cerrar el popup ---
  // 1. Al hacer clic en el botón "Cerrar"
  cerrarBoton.addEventListener("click", ocultarMensaje);
  
  // 2. Al hacer clic fuera del popup (en el overlay)
  overlay.addEventListener("click", function(event) {
    if (event.target === overlay) {
      ocultarMensaje();
    }
  });


  // --- Event Listener principal para el botón de "Enviar" (MODIFICADO) ---
  miBoton.addEventListener("click", function(event) {
    
    // 1. Previene que el formulario se envíe por defecto
    event.preventDefault(); 
    
    // 2. Obtener y limpiar el valor del email
    const emailValue = emailInput.value.trim(); // .trim() quita espacios
    
    // 3. Validación
    if (emailValue === "") {
      // --- CAMPO VACÍO ---
      mostrarMensaje("Por favor, introduce tu correo electrónico.", true);
    
    } else if (!validarEmail(emailValue)) {
      // --- FORMATO INCORRECTO ---
      mostrarMensaje("El formato del correo no es válido. (Ej: tu@correo.com)", true);
    
    } else {
      // --- ÉXITO ---
      
      // +++ MARCAMOS LA VARIABLE COMO 'TRUE' +++
      suscripcionExitosa = true;
      
      mostrarMensaje("¡Suscripción confirmada con éxito!");
      
      // Opcional: Limpiar el campo después del éxito
      // (Ahora debería funcionar gracias al cambio de selector de arriba)
      if(form) { // Comprobamos que el form se encontró
         form.reset();
      }
    }
  });

  // --- Función de utilidad para validar email (regex simple) ---
  function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

});