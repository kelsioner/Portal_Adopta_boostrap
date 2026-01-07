document.addEventListener("DOMContentLoaded", function() {
    // --- REFERENCIAS AL DOM ---
    const provinciaSelect = document.getElementById("provincia");
    const localidadSelect = document.getElementById("localidad");
    const form = document.getElementById("form-publicar");
    
    // Referencias para la imagen y previsualización
    const fotoInput = document.getElementById("input-foto");
    const previewContainer = document.getElementById("preview-container");
    const previewIcon = document.getElementById("preview-icon"); // Aseguramos que esté definido
    const btnRemovePhoto = document.getElementById("btn-remove-photo");

    // Referencias UI (Botones y Popup)
    const tipoButtons = document.querySelectorAll(".btn-tipo");
    const overlay = document.getElementById("confirmacion-overlay");
    const popupTexto = document.getElementById("confirmacion-texto");
    const cerrarBoton = document.getElementById("confirmacion-cerrar");

    // Variables de estado
    let provinciasData = [];
    let municipiosData = [];
    let tipoAnimal = "Perro";
    let envioExitoso = false;

    // --- 1. CARGA DE DATOS (Provincias y Municipios) ---
    Promise.all([
        fetch('../data/communities.json').then(res => res.json()),
        fetch('../data/towns.json').then(res => res.json())
    ])
    .then(([communities, towns]) => {
        // Extraer provincias de communities.json
        communities.forEach(comunidad => {
            comunidad.provinces.forEach(prov => {
                provinciasData.push({
                    code: String(prov.code),
                    name: prov.name
                });
            });
        });

        municipiosData = towns;

        // Poblar el select de provincias (ordenado alfabéticamente)
        provinciasData.sort((a, b) => a.name.localeCompare(b.name));
        provinciasData.forEach(prov => {
            const option = document.createElement("option");
            option.value = prov.code; 
            option.textContent = prov.name;
            provinciaSelect.appendChild(option);
        });
    })
    .catch(err => console.error("Error cargando JSON:", err));

    // --- 2. FILTRADO DE LOCALIDADES (Usando provinceId) ---
    provinciaSelect.addEventListener("change", function() {
        const selectedProvCode = this.value;
        localidadSelect.innerHTML = '<option value="">-Selecciona-</option>';
        localidadSelect.disabled = true;

        if (selectedProvCode) {
            // Filtramos los municipios según el provinceId del JSON towns.json
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
    });

    // --- 3. PREVISUALIZACIÓN DE IMAGEN ---
    fotoInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Ocultamos el icono central y mostramos el botón de eliminar
                if(previewIcon) previewIcon.style.display = "none";
                if(btnRemovePhoto) btnRemovePhoto.style.display = "block";
                
                // Cambiamos el estilo del contenedor a sólido
                previewContainer.style.borderStyle = "solid";
                
                // Limpiamos imagen previa si existiera
                const existingImg = document.getElementById("img-preview-active");
                if(existingImg) existingImg.remove();

                // Creamos e insertamos la nueva imagen
                const img = document.createElement("img");
                img.src = e.target.result;
                img.id = "img-preview-active";
                img.style.cssText = "width: 100%; height: 100%; object-fit: cover; cursor: pointer;";
                
                // Permitir cambiar la foto haciendo clic en la previsualización
                img.onclick = () => fotoInput.click(); 
                
                previewContainer.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    });

    // --- 3.1 LÓGICA PARA ELIMINAR LA FOTO ---
    if (btnRemovePhoto) {
        btnRemovePhoto.addEventListener("click", function(e) {
            e.stopPropagation(); // Evita que se dispare el click del input a través de la imagen
            
            // Limpiar el input de archivo
            fotoInput.value = "";
            
            // Eliminar la imagen del preview
            const img = document.getElementById("img-preview-active");
            if(img) img.remove();
            
            // Restaurar el icono central, ocultar botón X y volver a borde dashed
            if(previewIcon) previewIcon.style.display = "block";
            btnRemovePhoto.style.display = "none";
            previewContainer.style.borderStyle = "dashed";
        });
    }

    // --- 4. LÓGICA DE INTERFAZ (Botones Perro/Gato) ---
    tipoButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            tipoButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            tipoAnimal = this.getAttribute("data-tipo");
        });
    });

    // --- 5. GESTIÓN DE MENSAJES Y ENVÍO ---
    function mostrarMensaje(mensaje, esError = false) {
        popupTexto.textContent = mensaje;
        popupTexto.style.color = esError ? "#c0392b" : "#454545";
        overlay.style.display = "flex";
    }

    cerrarBoton.addEventListener("click", () => {
        overlay.style.display = "none";
        if (envioExitoso) window.location.href = "../index.html";
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Validación de campos obligatorios
        const nombre = document.getElementById("nombre-publicador").value.trim();
        const email = document.getElementById("email-publicador").value.trim();
        const provincia = provinciaSelect.value;
        const localidad = localidadSelect.value;
        const estado = document.getElementById("estado-animal").value.trim();

        if (!nombre || !email || !provincia || !localidad || !estado) {
            mostrarMensaje("Por favor, rellena todos los campos.", true);
            return;
        }

        // Simulación de envío exitoso
        envioExitoso = true;
        mostrarMensaje(`¡Gracias! La publicación de tu ${tipoAnimal.toLowerCase()} se ha enviado correctamente.`);
    });
});