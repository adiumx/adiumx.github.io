fetch('https://rickandmortyapi.com/api/location/3')
  .then(respuesta => respuesta.json())
  .then(data => {
    const container = document.getElementById('cards-container1');

    // Info de la location
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.type} - ${data.dimension}</p>
    `;
    container.appendChild(card);

    // Extraer solo los IDs de las URLs de residentes
    const ids = data.residents.map(url => url.split('/').pop());

    if (ids.length === 0) return; // por si no hay residentes

    // Un solo fetch para todos los personajes
    fetch(`https://rickandmortyapi.com/api/character/${ids.join(',')}`)
      .then(res => res.json())
      .then(personajes => {
        // Si es un solo residente, la API devuelve un objeto, no un array
        const lista = Array.isArray(personajes) ? personajes : [personajes];

        lista.forEach(personaje => {
          const cardResidente = document.createElement('div');
          cardResidente.classList.add('card');
          cardResidente.innerHTML = `
            <img src="${personaje.image}" alt="${personaje.name}" loading="lazy">
            <h3>${personaje.name}</h3>
          `;

          // Fallback si la imagen no carga (icono roto)
          const img = cardResidente.querySelector('img');
          img.addEventListener('error', () => {
            img.onerror = null; // evita loop infinito si el fallback también falla
            img.src = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
          }, { once: true });

          container.appendChild(cardResidente);
        });
      })
      .catch(error => console.log('Error al cargar personajes:', error));
  })
  .catch(error => console.log('Error al cargar location:', error));