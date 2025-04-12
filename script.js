const fetchBtn = document.getElementById("fetchBtn");
const countInput = document.getElementById("count");
const typeSelect = document.getElementById("typeSelect");
const cardsContainer = document.getElementById("cardsContainer");

fetchBtn.addEventListener("click", async () => {
  const count = parseInt(countInput.value);
  const type = typeSelect.value;

  if (!count || !type) {
    alert("Please enter card count and select a type.");
    return;
  }

  cardsContainer.innerHTML = "<p>Loading Pokémon...</p>";

  try {
    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const typeData = await typeRes.json();

    const pokemonList = typeData.pokemon.map(p => p.pokemon);
    const shuffled = pokemonList.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const pokemonPromises = selected.map(p => fetch(p.url).then(res => res.json()));
    const pokemonData = await Promise.all(pokemonPromises);

    cardsContainer.innerHTML = "";
    pokemonData.forEach(pokemon => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
        <h3>${pokemon.name.toUpperCase()}</h3>
        <p>Type: ${pokemon.types.map(t => t.type.name).join(", ")}</p>
      `;
      cardsContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    cardsContainer.innerHTML = "<p>Failed to load Pokémon. Try again!</p>";
  }
});
