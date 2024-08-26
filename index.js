function displayCountries(countries) {
  const container = document.getElementsByClassName("countries-container")[0];
  container.innerHTML = countries
    .map((country) => {
      const population = country.population
        ? country.population.toLocaleString()
        : "N/A";
      const area = country.area ? country.area.toLocaleString() : "N/A";

      return `
        <div class="country-box" data-country="${country.name}">
          <img src="${country.flags.svg}">
          <div class="info">
            <h2>${country.name}</h2>
            <p><span>Population:</span>${country.population}</p>
            <p><span>Region:</span>${country.region}</p>
            <p><span>Capital:</span>${country.capital}</p>
          </div>
        </div>
      `;
    })
    .join("");
  const countryBoxes = document.querySelectorAll(".country-box");
  countryBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const countryName = box.getAttribute("data-country");
      sessionStorage.setItem("selectedCountry", countryName);
      window.location.href = "details.html";
    });
  });
}

async function loadCountries() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    console.log("Error loading JSON:", error);
  }
}

loadCountries();

document.addEventListener("DOMContentLoaded", () => {
  const select = document.querySelector(".original-select");
  const selected = document.querySelector(".select-selected");
  const items = document.querySelector(".select-items");
  const countryList = document.getElementsByClassName("countries-container")[0];
  const pText = selected.querySelector("p");
  let countries = [];

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      countries = data;
    })
    .catch((error) => console.error("Error loading the JSON file:", error));

  selected.addEventListener("click", () => {
    items.classList.toggle("select-hide");
  });

  items.querySelectorAll("div").forEach((item) => {
    item.addEventListener("click", function () {
      pText.textContent = this.textContent;
      select.value = this.getAttribute("data-value");

      const region = select.value;
      countryList.innerHTML = "";

      if (region) {
        const filteredCountries = countries.filter(
          (country) => country.region === region
        );
        displayCountries(filteredCountries);
      }

      items.classList.add("select-hide");
    });
  });

  window.addEventListener("click", function (e) {
    if (!e.target.matches(".select-selected")) {
      items.classList.add("select-hide");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const Mode = document.getElementById("mode");
  const Svgs = document.getElementsByClassName("svg");
  Mode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function displayCountryDetails() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries = await response.json();
    const countryName = sessionStorage.getItem("selectedCountry");
    if (countryName) {
      const country = countries.find(
        (c) => c.name === decodeURIComponent(countryName)
      );
      if (country) {
        const info = document.querySelector(".country-info");
        info.innerHTML = `
        <div class="details">
          <img src="${country.flags.svg}" alt="${country.name} flag">
          <div class="text">
            <h2 class="info-title">${country.name}</h2>
            <div class="info-middle">
              <div class="info-left">
                <p><span>Native Name:</span> ${country.nativeName}</p>
                <p><span>Population:</span> ${country.population.toLocaleString()}</p>
                <p><span>Region:</span> ${country.region}</p>
              </div>
              <div class="info-right">
                <p><span>Subregion:</span> ${country.subregion}</p>
                <p><span>Capital:</span> ${country.capital}</p>
                <p><span>Top Level Domain:</span> ${country.topLevelDomain.join(
                  ", "
                )}</p>
                <p><span>Currencies:</span> ${country.currencies
                  .map((c) => c.name)
                  .join(", ")}</p>
                <p><span>Languages:</span> ${country.languages
                  .map((l) => l.name)
                  .join(", ")}</p>
              </div>
            </div>
            <div class="info-bottom">
              <p><span>Border Countries:</span></p>
            </div>
          </div>
        </div>
        `;
      }
    }
  } catch (error) {
    console.log("Error loading JSON:", error);
  }
}

displayCountryDetails();
