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
            <img src="${personaje.image}" alt="${personaje.name}">
            <h3>${personaje.name}</h3>
          `;
          container.appendChild(cardResidente);
        });
      });
  })
  .catch(error => console.log(error));