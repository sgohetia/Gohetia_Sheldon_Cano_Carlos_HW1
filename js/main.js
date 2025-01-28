(() => {
  const characterBox = document.querySelector("#character-box");
  const detailsTemplate = document.querySelector("#details-template");
  const detailsCon = document.querySelector("#details-con");
  const filmTemplate = document.querySelector("#film-template");
  const baseURL = "https://swapi.dev/api/people/?page=";
  const totalPages = 9;

  function getAllCharacters() {
    const allChar = [];

    for (let i = 1; i <= totalPages; i++) {
      allChar.push(fetch(`${baseURL}${i}`).then((response) => response.json()));
    }

    Promise.all(allChar)
      .then((responses) => {
        const allCharacters = responses.flatMap((response) => response.results);

        const ul = document.createElement("ul");
        allCharacters.forEach((character) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.textContent = character.name;
          a.dataset.url = character.url;
          li.appendChild(a);
          ul.appendChild(li);
        });
        characterBox.appendChild(ul);
      })
      .then(() => {
        const links = document.querySelectorAll("#character-box li a");
        links.forEach((link) => {
          link.addEventListener("click", getCharacterDetails);
        });
      })
      .catch((err) => {
        console.error("Failed to fetch characters:", err);
      });
  }

  function getCharacterDetails(e) {
    const characterURL = e.currentTarget.dataset.url;
    fetch(characterURL)
      .then((response) => response.json())
      .then((character) => {
        detailsCon.innerHTML = "";

        const clone = detailsTemplate.content.cloneNode(true);
        const detailsName = clone.querySelector(".details-name");
        const detailsGender = clone.querySelector(".details-gender");
        const detailsBirth = clone.querySelector(".details-birth");
        const detailsFilms = clone.querySelector(".details-films");

        detailsName.textContent = `Name: ${character.name}`;
        detailsGender.textContent = `Gender: ${character.gender}`;
        detailsBirth.textContent = `Birth Year: ${character.birth_year}`;

        const filmPromises = character.films.map((filmURL) =>
          fetch(filmURL).then((res) => res.json())
        );

        Promise.all(filmPromises)
          .then((films) => {
            films.forEach((film) => {
              const filmLi = document.createElement("li");
              const filmLink = document.createElement("a");
              filmLink.textContent = film.title;
              filmLink.href = "#";
              filmLink.dataset.url = film.url;
              filmLink.addEventListener("click", getFilmDetails);
              filmLi.appendChild(filmLink);
              detailsFilms.appendChild(filmLi);
            });
          })
          .catch((err) => {
            console.error("Failed to fetch film details:", err);
          });

        detailsCon.appendChild(clone);
      })
      .catch((err) => {
        detailsCon.innerHTML =
          "<p>Failed to fetch character details. Try again!</p>";
        console.error("Error fetching character details:", err);
      });
  }

  function getFilmDetails(e) {
    e.preventDefault();
    const filmURL = e.currentTarget.dataset.url;
    fetch(filmURL)
      .then((response) => response.json())
      .then((film) => {
        detailsCon.innerHTML = "";

        const clone = filmTemplate.content.cloneNode(true);
        const filmTitle = clone.querySelector(".film-title");
        const filmDirector = clone.querySelector(".film-director");
        const filmRelease = clone.querySelector(".film-release");

        filmTitle.textContent = `Title: ${film.title}`;
        filmDirector.textContent = `Director: ${film.director}`;
        filmRelease.textContent = `Release Date: ${film.release_date}`;

        detailsCon.appendChild(clone);
      })
      .catch((err) => {
        detailsCon.innerHTML =
          "<p>Failed to fetch film details. Try again!</p>";
        console.error("Error fetching film details:", err);
      });
  }

  getAllCharacters();
})();
