(() => {
  // Added here our Scroll to section script
  gsap.registerPlugin(ScrollToPlugin);

  const navlinks = document.querySelectorAll("#main-header a");
  function scrollLink(e) {
    e.preventDefault();
    let selectedLink = e.currentTarget.hash;
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: `${selectedLink}` },
    });
  }

  navlinks.forEach((link) => {
    link.addEventListener("click", scrollLink);
  });

  // Added here our API fetching scripts
  const charAvatar = document.querySelector("#char-avatar");
  const movieContainer = document.querySelector("#movie-container");
  const movieBox = document.querySelector("#movie-box");
  const previewChar = document.querySelector("#preview-char");
  let previewCharOn = false;

  let tl = gsap.timeline();

  const baseUrl = `https://swapi.dev/api/`;

  function getCharacters() {
    charAvatar.classList.add("spinner");

    // Fetch characters from page 1
    fetch(`${baseUrl}/people`)
      .then((response) => response.json())
      .then(function (response) {
        console.log("Page 1 Characters:", response.results);

        const characters = response.results;

        // Loop through the characters from page 1
        characters.forEach((character, index) => {
          const div = document.createElement("div");
          const p = document.createElement("p");
          const img = document.createElement("img");
          const a = document.createElement("a");

          p.textContent = character.name;
          img.src = `images/avatars/${index + 1}.jpg`;
          a.classList.add("character-frame");
          a.appendChild(img);
          a.appendChild(p);
          let randFilmIndex = Math.floor(
            Math.random() * character.films.length
          );
          let randFilm = character.films[randFilmIndex];
          a.dataset.movieDetails = randFilm;
          a.dataset.charNumber = index;
          div.appendChild(a);
          div.classList.add("character");
          charAvatar.appendChild(div);
        });

        // Fetch characters 11 and 44 (instead of page 2)
        return Promise.all([
          fetch(`${baseUrl}/people/11/`),
          fetch(`${baseUrl}/people/44/`),
        ]);
      })
      .then(([response11, response12]) =>
        Promise.all([response11.json(), response12.json()])
      )
      .then(function ([character11, character12]) {
        console.log("Character 11:", character11);
        console.log("Character 12:", character12);

        const div11 = document.createElement("div");
        const p11 = document.createElement("p");
        const img11 = document.createElement("img");
        const a11 = document.createElement("a");

        p11.textContent = character11.name;
        img11.src = `images/avatars/11.jpg`; // Added image for the specific character
        a11.classList.add("character-frame");
        a11.appendChild(img11);
        a11.appendChild(p11);
        let randFilmIndex11 = Math.floor(
          Math.random() * character11.films.length
        );
        let randFilm11 = character11.films[randFilmIndex11];
        a11.dataset.movieDetails = randFilm11;
        a11.dataset.charNumber = 10;
        div11.appendChild(a11);
        div11.classList.add("character");
        charAvatar.appendChild(div11);

        // Append character 12
        const div12 = document.createElement("div");
        const p12 = document.createElement("p");
        const img12 = document.createElement("img");
        const a12 = document.createElement("a");

        p12.textContent = character12.name;
        img12.src = `images/avatars/12.jpg`; // Added image for the specific character
        a12.classList.add("character-frame");
        a12.appendChild(img12);
        a12.appendChild(p12);
        let randFilmIndex12 = Math.floor(
          Math.random() * character12.films.length
        );
        let randFilm12 = character12.films[randFilmIndex12];
        a12.dataset.movieDetails = randFilm12;
        a12.dataset.charNumber = 11;
        div12.appendChild(a12);
        div12.classList.add("character");
        charAvatar.appendChild(div12);
      })
      .then(function () {
        const links = document.querySelectorAll("#char-avatar div a");
        links.forEach((link) => {
          link.addEventListener("click", getMovieInfo);
        });
      })
      .catch((err) => {
        console.log("Error fetching characters:", err);
      })
      .finally(() => {
        charAvatar.classList.remove("spinner");
      });
  }

  function getMovieInfo() {
    movieBox.innerHTML = "";
    movieBox.classList.add("spinner");

    const movieID = this.dataset.movieDetails;
    const charNumber = this.dataset.charNumber;

    const div = document.querySelector(".img-holder");
    div.classList.add("invisible");
    const img = document.createElement("img");

    if (previewCharOn) {
      tl.set(div, { autoAlpha: 0 });
      div.innerHTML = "";
    }

    img.src = `images/preview/${charNumber}.png`;
    div.appendChild(img);
    previewCharOn = true;
    previewChar.appendChild(div);

    tl.to(div, { autoAlpha: 1, duration: 2, ease: "power2.inOut" });

    fetch(movieID)
      .then((response) => response.json())
      .then(function (response) {
        movieBox.classList.remove("spinner");
        movieBox.innerHTML = "";
        const template = document.importNode(movieContainer.content, true);
        const movieBody = template.querySelector(".opening-infobody");
        const movieTitle = template.querySelector(".movie-title");
        const posterImg = template.querySelector(".poster-img");
        posterImg.src = `images/movies/${response.episode_id}.jpg`;
        movieTitle.textContent = response.title;
        movieBody.innerHTML = response.opening_crawl;

        movieBox.appendChild(template);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCharacters();

  // This is for the particle effects
  particlesJS("particles", {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#ffffff",
        },
      },
      opacity: {
        value: 0.8,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          opacity_min: 0,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "push",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  });

  // Added GSAP animation here
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".previewChar", {
    scrollTrigger: {
      trigger: ".previewChar",
      // toggleActions: "restart none restart none",
      toggleActions: "play none none none",
      once: true,
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.from(".theCharacters", {
    scrollTrigger: {
      trigger: ".theCharacters",
      // toggleActions: "restart none restart none",
      toggleActions: "play none none none",
      once: true,
    },
    opacity: 0,
    duration: 5,
    ease: "power2.out",
  });
  gsap.from(".movieDetail", {
    scrollTrigger: {
      trigger: ".movieDetail",
      // toggleActions: "restart none restart none",
      toggleActions: "play none none none",
      once: true,
    },
    x: 100,
    opacity: 0,
    duration: 2,
    ease: "power2.out",
  });

  //3D MODEL scripts for hotspot
  const hotspots = document.querySelectorAll(".Hotspot");
  const infoboxes = [
    {
      title: "Activation Lever",
      text: "A switch or mechanism that ignites and deactivates the lightsaber blade.",
      image: "images/ar-img/ar-img1.png",
    },
    {
      title: "Blade Length Adjust",
      text: "A control that modifies the length of the lightsaber blade for versatility in combat.",
      image: "images/ar-img/ar-img2.png",
    },
    {
      title: "Blade Intensity Adjust",
      text: "A dial or setting that regulates the brightness and energy output of the blade.",
      image: "images/ar-img/ar-img3.png",
    },
    {
      title: "Power Cell/Handrip",
      text: "The main power source of the lightsaber, housed within the hilt for stable energy flow.",
      image: "images/ar-img/ar-img4.png",
    },
    {
      title: "Recharge Socket",
      text: "A port that allows the lightsaber’s power cell to be recharged when depleted.",
      image: "images/ar-img/ar-img6.png",
    },
    {
      title: "Blade Emitter Shroud",
      text: "A protective covering around the emitter that helps direct and stabilize the blade's energy.",
      image: "images/ar-img/ar-img7.png",
    },
  ];

  // This function will Load the data from my array to display in the html/DOM
  function loadInfo() {
    hotspots.forEach((hotspot, index) => {
      const infobox = infoboxes[index];
      const annotation = hotspot.querySelector(".HotspotAnnotation");

      if (infobox) {
        annotation.innerHTML = "";

        const imgElement = document.createElement("img");
        imgElement.src = infobox.image;
        imgElement.alt = infobox.title;
        imgElement.style.width = "130px";
        imgElement.style.height = "auto";
        annotation.appendChild(imgElement);

        const titleElement = document.createElement("h2");
        titleElement.textContent = infobox.title;
        annotation.appendChild(titleElement);

        const textElement = document.createElement("p");
        textElement.textContent = infobox.text;
        annotation.appendChild(textElement);

        annotation.style.display = "none";
      }
    });
  }
  // This function will show and hide my hotspot
  function showInfo() {
    const annotation = this.querySelector(".HotspotAnnotation");
    annotation.style.display = "block";
    gsap.to(annotation, { autoAlpha: 1, duration: 1 });
  }

  function hideInfo() {
    const annotation = this.querySelector(".HotspotAnnotation");
    gsap.to(annotation, {
      autoAlpha: 0,
      duration: 1,
      onComplete: () => (annotation.style.display = "none"),
    });
  }

  loadInfo();

  // This is my event handler
  hotspots.forEach((hotspot) => {
    hotspot.addEventListener("mouseenter", showInfo);
    hotspot.addEventListener("mouseleave", hideInfo);
  });
})();
