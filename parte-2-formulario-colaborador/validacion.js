"use strict";

// ─── Paso 3: Funciones de retroalimentación visual ───────────────────────
function mostrarError(campoId, mensaje) {
  const campo = document.querySelector(`#${campoId}`);
  const span  = document.querySelector(`#error-${campoId}`);

  campo.classList.add("invalido");
  campo.classList.remove("valido");
  span.textContent = mensaje;
  span.classList.add("visible");
}

function limpiarError(campoId) {
  const campo = document.querySelector(`#${campoId}`);
  const span  = document.querySelector(`#error-${campoId}`);

  campo.classList.remove("invalido");
  campo.classList.add("valido");
  span.textContent = "";
  span.classList.remove("visible");
}

function limpiarTodo() {
  ["nombre", "email", "username", "password", "confirmar", "rol", "equipo", "horas", "terminos"]
    .forEach(id => limpiarError(id));
}

// ─── Paso 4: Validación de Nombre, Correo, Usuario y Contraseña ──────────
function validarNombre() {
  const campo = document.querySelector("#nombre");
  if (campo.validity.valueMissing) {
    mostrarError("nombre", "El nombre es obligatorio.");
    return false;
  }
  if (campo.validity.tooShort) {
    mostrarError("nombre", `El nombre debe tener al menos ${campo.minLength} caracteres.`);
    return false;
  }
  limpiarError("nombre");
  return true;
}

function validarEmail() {
  const campo = document.querySelector("#email");
  if (campo.validity.valueMissing) {
    mostrarError("email", "El correo es obligatorio.");
    return false;
  }
  if (campo.validity.typeMismatch) {
    mostrarError("email", "El formato del correo no es válido.");
    return false;
  }
  limpiarError("email");
  return true;
}

// Justificación de pattern nativo: aprovechamos la propiedad validity.patternMismatch
// sobre el atributo pattern ya definido en el HTML en lugar de duplicar la expresión
// regular en JavaScript, manteniendo una única fuente de verdad para el formato.
function validarUsername() {
  const campo = document.querySelector("#username");
  if (campo.validity.valueMissing) {
    mostrarError("username", "El nombre de usuario es obligatorio.");
    return false;
  }
  if (campo.validity.patternMismatch) {
    mostrarError("username", "Use 4 a 20 caracteres: letras, números o guion bajo, sin espacios.");
    return false;
  }
  limpiarError("username");
  return true;
}

// Decisión de diseño #3 — Estrategia B: validaciones independientes encadenadas
function validarPassword() {
  const campo = document.querySelector("#password");
  const valor = campo.value;

  if (campo.validity.valueMissing) {
    mostrarError("password", "La contraseña es obligatoria.");
    return false;
  }
  if (campo.validity.tooShort) {
    mostrarError("password", "La contraseña debe tener al menos 8 caracteres.");
    return false;
  }
  if (!/[A-Z]/.test(valor)) {
    mostrarError("password", "Falta al menos una letra mayúscula.");
    return false;
  }
  if (!/[0-9]/.test(valor)) {
    mostrarError("password", "Falta al menos un número.");
    return false;
  }
  if (!/[^A-Za-z0-9]/.test(valor)) {
    mostrarError("password", "Falta al menos un carácter especial (por ejemplo: # ! % &).");
    return false;
  }

  limpiarError("password");
  return true;
}

// ─── Paso 5: Confirmación y Campo Condicional "Equipo a Cargo" ───────────
function validarConfirmar() {
  const password  = document.querySelector("#password").value;
  const confirmar = document.querySelector("#confirmar").value;
  if (!confirmar) {
    mostrarError("confirmar", "La confirmación es obligatoria.");
    return false;
  }
  if (password !== confirmar) {
    mostrarError("confirmar", "Las contraseñas no coinciden.");
    return false;
  }
  limpiarError("confirmar");
  return true;
}

const selectRol   = document.querySelector("#rol");
const grupoEquipo = document.querySelector("#grupo-equipo");

selectRol.addEventListener("change", () => {
  const esLider = selectRol.value === "lider";
  grupoEquipo.classList.toggle("oculto", !esLider);

  // Decisión de diseño #4 — Estrategia A: alternar el atributo required nativo
  document.querySelector("#equipo").required = esLider;

  if (!esLider) limpiarError("equipo");
});

function validarEquipo() {
  const campo = document.querySelector("#equipo");
  if (!campo.required) return true;

  if (campo.validity.valueMissing) {
    mostrarError("equipo", "Indique el equipo a cargo para el rol de Líder.");
    return false;
  }
  limpiarError("equipo");
  return true;
}

// ─── Paso 6 y 7: Validación de Rol, Horas y Checkbox de Términos ─────────
function validarRol() {
  const campo = document.querySelector("#rol");
  if (campo.validity.valueMissing) {
    mostrarError("rol", "Seleccione un rol.");
    return false;
  }
  limpiarError("rol");
  return true;
}

function validarHoras() {
  const campo = document.querySelector("#horas");
  if (campo.validity.valueMissing) {
    mostrarError("horas", "Indique las horas disponibles por semana.");
    return false;
  }
  if (campo.validity.rangeUnderflow) {
    mostrarError("horas", `Debe disponer al menos de ${campo.min} horas semanales.`);
    return false;
  }
  if (campo.validity.rangeOverflow) {
    mostrarError("horas", `No puede superar las ${campo.max} horas semanales.`);
    return false;
  }
  limpiarError("horas");
  return true;
}

function validarTerminos() {
  const campo = document.querySelector("#terminos");
  if (!campo.checked) {
    mostrarError("terminos", "Debe aceptar los términos para continuar.");
    return false;
  }
  limpiarError("terminos");
  return true;
}

// ─── Paso 8: Validación en tiempo real por campo ─────────────────────────
document.querySelector("#nombre")   .addEventListener("blur", validarNombre);
document.querySelector("#email")    .addEventListener("blur", validarEmail);
document.querySelector("#username") .addEventListener("blur", validarUsername);
document.querySelector("#password") .addEventListener("blur", validarPassword);
document.querySelector("#confirmar").addEventListener("blur", validarConfirmar);
document.querySelector("#rol")      .addEventListener("change", validarRol);
document.querySelector("#equipo")   .addEventListener("blur", validarEquipo);
document.querySelector("#horas")    .addEventListener("blur", validarHoras);
document.querySelector("#terminos") .addEventListener("change", validarTerminos);

document.querySelector("#confirmar").addEventListener("input", () => {
  if (document.querySelector("#confirmar").value) limpiarError("confirmar");
});

// ─── Paso 9: Control del evento submit ───────────────────────────────────
const form = document.querySelector("#form-registro");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const resultados = [
    validarNombre(),
    validarEmail(),
    validarUsername(),
    validarPassword(),
    validarConfirmar(),
    validarRol(),
    validarEquipo(),
    validarHoras(),
    validarTerminos(),
  ];

  const todoValido = resultados.every(r => r === true);

  if (todoValido) {
    const mensajeExito = document.querySelector("#mensaje-exito");
    mensajeExito.classList.remove("oculto");
    mensajeExito.classList.add("visible");

    setTimeout(() => {
      form.reset();
      limpiarTodo();
      document.querySelector("#equipo").required = false;
      grupoEquipo.classList.add("oculto");
      mensajeExito.classList.remove("visible");
      mensajeExito.classList.add("oculto");
      const indicador = document.querySelector("#fortaleza");
      if (indicador) indicador.textContent = "";
    }, 2000);
  } else {
    const primerInvalido = form.querySelector(".invalido");
    if (primerInvalido) primerInvalido.focus();
  }
});

// ─── Paso 10: Indicador visual de fortaleza de contraseña ────────────────
function evaluarFortaleza(valor) {
  let puntos = 0;
  if (valor.length >= 8)          puntos++;
  if (/[A-Z]/.test(valor))        puntos++;
  if (/[0-9]/.test(valor))        puntos++;
  if (/[^A-Za-z0-9]/.test(valor)) puntos++;

  const niveles = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const colores = ["", "#C62828", "#F57F17", "#1565C0", "#2E7D32"];

  return { nivel: niveles[puntos], color: colores[puntos], puntos };
}

const campoPassword = document.querySelector("#password");
campoPassword.addEventListener("input", () => {
  const { nivel, color, puntos } = evaluarFortaleza(campoPassword.value);
  let indicador = document.querySelector("#fortaleza");

  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "fortaleza";
    campoPassword.insertAdjacentElement("afterend", indicador);
  }

  indicador.textContent = puntos > 0 ? `Contraseña: ${nivel}` : "";
  indicador.style.color = color;
});