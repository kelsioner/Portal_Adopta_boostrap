document.addEventListener("DOMContentLoaded", function () {
    // --- 1. REFERENCIAS AL DOM ---
    const form = document.getElementById("form-publicar");
    const provinciaSelect = document.getElementById("provincia");
    const localidadSelect = document.getElementById("localidad");
    const nombreInput = document.getElementById("nombre-publicador");
    const emailInput = document.getElementById("email-publicador");
    const estadoInput = document.getElementById("estado-animal");
    const fotoInput = document.getElementById("input-foto");
    const previewContainer = document.getElementById("preview-container");
    const previewIcon = document.getElementById("preview-icon");
    const btnRemovePhoto = document.getElementById("btn-remove-photo");
    const checkPrivacidad = document.getElementById("check-privacidad");
    const submitBtn = document.getElementById("submit-button");
    const tipoButtons = document.querySelectorAll(".btn-tipo");

    // Popup Refs
    const overlay = document.getElementById("confirmacion-overlay");
    const popupTexto = document.getElementById("confirmacion-texto");
    const cerrarBoton = document.getElementById("confirmacion-cerrar");

    let envioExitoso = false;
    let tipoAnimal = "Perro";

    // Variables para datos
    let provinciasData = [];
    let municipiosData = [];

    // --- 2. CARGA DE DATOS ---
    if (typeof communitiesDataRaw !== 'undefined' && typeof townsDataRaw !== 'undefined') {
        // Extraer provincias
        communitiesDataRaw.forEach(comunidad => {
            if(comunidad.provinces) {
                comunidad.provinces.forEach(prov => {
                    provinciasData.push({
                        code: String(prov.code),
                        name: prov.name
                    });
                });
            }
        });

        municipiosData = townsDataRaw;

        // Ordenar y Poblar
        provinciasData.sort((a, b) => a.name.localeCompare(b.name));
        provinciasData.forEach(prov => {
            const option = document.createElement("option");
            option.value = prov.code; 
            option.textContent = prov.name;
            provinciaSelect.appendChild(option);
        });
    }

    // --- 3. FILTRADO DE LOCALIDADES ---
    provinciaSelect.addEventListener("change", function() {
        const selectedProvCode = this.value;
        localidadSelect.innerHTML = '<option value="">-Selecciona-</option>';
        localidadSelect.disabled = true;

        if (selectedProvCode) {
            const filtrados = municipiosData.filter(m => String(m.provinceId) === selectedProvCode);
            
            if (filtrados.length > 0) {
                filtrados.sort((a, b) => a.name.localeCompare(b.name));
                filtrados.forEach(muni => {
                    const option = document.createElement("option");
                    option.value = muni.name;
                    option.textContent = muni.name;
                    localidadSelect.appendChild(option);
                });
                localidadSelect.disabled = false;
            }
        }
        validarCampo(provinciaSelect, this.value !== "", "error-provincia");
    });

    localidadSelect.addEventListener("change", function() {
        validarCampo(localidadSelect, this.value !== "", "error-municipio");
    });

    // --- 4. FUNCIÓN DE VALIDACIÓN (CRUCIAL: No modificar) ---
    const validarCampo = (input, condicion, idError, forzarError = false) => {
        const mensajeError = document.getElementById(idError);
        if (!mensajeError) return false;

        const valorVacio = input.value ? input.value.trim() === "" : true;

        if (condicion) {
            // Caso Válido
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (input === previewContainer) input.style.borderColor = "var(--brown)";
            mensajeError.style.display = "none";
            return true;
        } else {
            // Caso Inválido: Solo marcamos si el usuario escribió algo MAL o si pulsó ENVIAR (forzarError)
            if (!valorVacio || forzarError || input === previewContainer) {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                if (input === previewContainer) input.style.borderColor = "#c0392b";
                mensajeError.style.display = "block";
            }
            return false;
        }
    };

    // --- 5. EVENTOS EN TIEMPO REAL ---
    nombreInput.addEventListener('input', () => validarCampo(nombreInput, nombreInput.value.trim().length >= 3, "error-nombre"));
    
    emailInput.addEventListener('input', () => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|es)$/i;
        validarCampo(emailInput, regex.test(emailInput.value), "error-email");
    });
    
    estadoInput.addEventListener('input', () => validarCampo(estadoInput, estadoInput.value.trim().length >= 10, "error-estado"));

    // --- 6. GESTIÓN DE FOTO ---
    fotoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewContainer.style.backgroundImage = `url(${e.target.result})`;
                previewContainer.style.backgroundSize = "cover";
                previewContainer.style.backgroundPosition = "center";
                previewIcon.style.display = "none";
                btnRemovePhoto.style.display = "block";
                validarCampo(previewContainer, true, "error-foto");
            };
            reader.readAsDataURL(file);
        }
    });

    btnRemovePhoto.addEventListener("click", function (e) {
        e.stopPropagation();
        fotoInput.value = "";
        previewContainer.style.backgroundImage = "none";
        previewIcon.style.display = "block";
        btnRemovePhoto.style.display = "none";
        validarCampo(previewContainer, false, "error-foto");
    });

    // Gestión botones Perro/Gato
    tipoButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            tipoButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            tipoAnimal = this.getAttribute("data-tipo");
        });
    });

    // --- 7. ENVÍO DEL FORMULARIO (Validación Estricta) ---
    form.addEventListener("submit", function (e) {
        // Esto evita que la página se recargue
        e.preventDefault(); 

        console.log(e);

        // Validamos TODOS los campos forzando el error (true)
        const vNombre = validarCampo(nombreInput, nombreInput.value.trim().length >= 3, "error-nombre", true);
        const vEmail = validarCampo(emailInput, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|es)$/i.test(emailInput.value), "error-email", true);
        const vProv = validarCampo(provinciaSelect, provinciaSelect.value !== "", "error-provincia", true);
        const vLoc = validarCampo(localidadSelect, localidadSelect.value !== "", "error-municipio", true);
        const vEstado = validarCampo(estadoInput, estadoInput.value.trim().length >= 10, "error-estado", true);
        const vFoto = validarCampo(previewContainer, fotoInput.files.length > 0, "error-foto", true);
        const vPrivacidad = checkPrivacidad.checked;

        if (!vPrivacidad) {
            checkPrivacidad.classList.add('is-invalid');
        } else {
            checkPrivacidad.classList.remove('is-invalid');
        }

        // Si TODO es válido
        if (vNombre && vEmail && vProv && vLoc && vEstado && vFoto && vPrivacidad) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Publicando...';
            
            setTimeout(() => {
                envioExitoso = true;
                popupTexto.textContent = `¡Tu ${tipoAnimal.toLowerCase()} ha sido publicado con éxito!`;
                popupTexto.style.color = "#454545";
                overlay.style.display = "flex";
                setTimeout(() => overlay.classList.add("active"), 10);
            }, 1500);
        } else {
            // Scroll al primer error Y poner el foco
            const primerError = form.querySelector('.is-invalid');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Ponemos el cursor dentro para escribir
                setTimeout(() => {
                    primerError.focus();
                }, 500);
            }
        }
    });

    cerrarBoton.addEventListener("click", () => {
        overlay.classList.remove("active");
        setTimeout(() => {
            overlay.style.display = "none";
            if (envioExitoso) window.location.href = "../index.html";
        }, 300);
    });
});