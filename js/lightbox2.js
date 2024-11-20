const imagenes2 = document.querySelectorAll('.img-portfolio')
const imagenesLight2 = document.querySelector('.agregar-imagen')
const contenedorLight2 = document.querySelector('.imagen-light')
imagenes2.forEach(imagen =>{
    imagen.addEventListener('click', ()=>{
        aparecerImagen2(imagen.getAttribute('src'))
    })
})

const aparecerImagen2 = (imagen)=>{
    imagenesLight2.src = imagen;
    contenedorLight2.classList.toggle('show')
    imagenesLight2.classList.toggle('showImage')
    hamburger1.style.opacity = '0'
}