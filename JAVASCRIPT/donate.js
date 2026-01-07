document.addEventListener("DOMContentLoaded", function() {

  // --- REFERENCIAS AL DOM ---
  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");
  
  const customAmountInput = document.getElementById("custom-amount");
  const amountButtons = document.querySelectorAll(".btn-amount");
  const freqButtons = document.querySelectorAll(".nav-tabs-donation .nav-link");
  const btnFinalizarDonacion = document.getElementById("btn-finalizar-donacion");

  // Popup Refs
  const overlay = document.getElementById("confirmacion-overlay");
  const popupTexto = document.getElementById("confirmacion-texto");
  const cerrarBoton = document.getElementById("confirmacion-cerrar");

  // Variables de estado
  let donacionFinalizada = false;
  let importeSeleccionado = "10€"; // Valor inicial por defecto
  let frecuenciaSeleccionada = "Única"; // Valor inicial por defecto
  let metodoSeleccionado = "";

  // --- 1. LÓGICA PARA PESTAÑAS DE FRECUENCIA (Única, Mensual, Anual) ---
  freqButtons.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Gestionar clases visuales
      freqButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      
      // Guardar el valor seleccionado
      frecuenciaSeleccionada = this.textContent;
    });
  });

  // --- 2. LÓGICA PARA BOTONES DE IMPORTE (5€, 10€, etc.) ---
  amountButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      amountButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      
      importeSeleccionado = this.textContent;
      customAmountInput.value = ""; // Limpiar el cuadro de texto si se pulsa un botón fijo
    });
  });

  // --- 3. LÓGICA PARA CANTIDAD PERSONALIZADA ---
  customAmountInput.addEventListener("input", function() {
    if (this.value !== "") {
      // Si el usuario escribe, desmarcamos los botones fijos
      amountButtons.forEach(b => b.classList.remove("active"));
      importeSeleccionado = this.value + "€";
    }
  });

  // --- 4. NAVEGACIÓN ENTRE PASOS ---
  window.selectMethod = function(metodo) {
    metodoSeleccionado = metodo;
    changeStep(2);
  };

  window.changeStep = function(step) {
    if (step === 1) {
      step2.style.display = "none";
      step1.style.display = "block";
    } else {
      step1.style.display = "none";
      step2.style.display = "block";
    }
    window.scrollTo(0,0);
  };

  // --- 5. GESTIÓN DEL POPUP (MENSAJES) ---
  function mostrarMensaje(mensaje, esError = false) {
    popupTexto.textContent = mensaje;
    popupTexto.style.color = esError ? "#c0392b" : "#454545";
    overlay.style.display = "flex"; 
  }

  function ocultarMensaje() {
    overlay.style.display = "none";
    if (donacionFinalizada) {
      window.location.href = "../index.html";
    }
  }

  cerrarBoton.addEventListener("click", ocultarMensaje);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) ocultarMensaje(); });

  // --- 6. FINALIZAR DONACIÓN ---
  btnFinalizarDonacion.addEventListener("click", function() {
    // Verificación final de importe
    if (importeSeleccionado === "€" || importeSeleccionado === "") {
      mostrarMensaje("Por favor, selecciona o indica una cantidad.", true);
      return;
    }

    donacionFinalizada = true;
    
    // Mensaje dinámico según la frecuencia
    let mensajeExito = "";
    if (frecuenciaSeleccionada === "Única") {
      mensajeExito = `¡Gracias! Se va a proceder a la donación única de ${importeSeleccionado} a través de ${metodoSeleccionado}.`;
    } else {
      mensajeExito = `¡Gracias! Has configurado una donación ${frecuenciaSeleccionada.toLowerCase()} de ${importeSeleccionado} a través de ${metodoSeleccionado}.`;
    }

    mostrarMensaje(mensajeExito);
  });
});