document.addEventListener("DOMContentLoaded", () => {
  const orden = ["CESAR", "RUIZ", "FLORES"];
  const intervalo = 500; // 1 segundo entre cada animación

  orden.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.style.animationPlayState = "running";
      }, i * intervalo);
    } else {
      console.warn(`Elemento con id ${id} no encontrado`);
    }
  });
});
