async function loadCountries() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries = await response.json();
    return countries;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return [];
  }
}

function displayCountries(countries) {
  const container = document.getElementsByClassName("countries-container")[0];

  container.innerHTML = countries
    .map((country) => {
      return `
        <div class="country-box" data-country="${country.name}">
          <picture>
            <source srcset="${country.flags.png}" type="image/svg+xml">
            <img src="${country.flags.svg}" alt="${country.name} flag">
          </picture>
          <div class="info">
            <h2>${country.name}</h2>
            <p><span>Population:</span> ${country.population.toLocaleString()}</p>
            <p><span>Region:</span> ${country.region}</p>
            <p><span>Capital:</span> ${country.capital}</p>
          </div>
        </div>
      `;
    })
    .join("");
  // 点击展示
  const countryBoxes = document.querySelectorAll(".country-box");
  countryBoxes.forEach((box) => {
    box.addEventListener("click", function () {
      const countryName = box.getAttribute("data-country");
      sessionStorage.setItem("selectedCountry", countryName);
      window.location.href = "details.html";
    });
  });
}

async function init() {
  const countries = await loadCountries();
  displayCountries(countries);
}

init();

// 筛选和搜索
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
      searchAndDisplayCountries(region);

      items.classList.add("select-hide");
    });
  });

  window.addEventListener("click", function (e) {
    if (!e.target.matches(".select-selected")) {
      items.classList.add("select-hide");
    }
  });

  let searchTimeout;

  document
    .getElementById("search-box")
    .addEventListener("input", debounceSearch);
  document
    .getElementById("search-box")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        searchAndDisplayCountries(select.value);
      }
    });

  function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(
      () => searchAndDisplayCountries(select.value),
      500
    );
  }

  function searchAndDisplayCountries(region) {
    const query = document
      .getElementById("search-box")
      .value.trim()
      .toLowerCase();

    let filteredCountries = countries;

    if (region) {
      filteredCountries = filteredCountries.filter(
        (country) => country.region === region
      );
    }

    if (query) {
      filteredCountries = filteredCountries
        .filter((country) => country.name.toLowerCase().includes(query))
        .sort((a, b) => {
          const lowerNameA = a.name.toLowerCase();
          const lowerNameB = b.name.toLowerCase();

          const startsWithA = lowerNameA.startsWith(query);
          const startsWithB = lowerNameB.startsWith(query);

          if (startsWithA && !startsWithB) return -1;
          if (!startsWithA && startsWithB) return 1;
          return lowerNameA.localeCompare(lowerNameB);
        }); //首字母匹配的优先展示
    }

    displayResults(filteredCountries);
  }

  function displayResults(results) {
    const resultsContainer = document.getElementsByClassName(
      "countries-container"
    )[0];
    if (results.length === 0) {
      resultsContainer.innerHTML = "<p class='notFound'>No results found.</p>";
    } else {
      displayCountries(results);
    }
  }
});

// 黑暗模式
document.addEventListener("DOMContentLoaded", () => {
  const Mode = document.getElementById("mode");
  Mode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

// 细节页面
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function displayCountryDetails() {
  try {
    const countries = await loadCountries();
    const countryName = sessionStorage.getItem("selectedCountry");
    if (countryName) {
      const country = countries.find(
        (c) => c.name === decodeURIComponent(countryName)
      );
      if (country) {
        const info = document.querySelector(".country-info");
        info.innerHTML = `
        <div class="details">
          <picture>
            <source srcset="${country.flags.png}" type="image/svg+xml">
            <img src="${country.flags.svg}" alt="${country.name} flag">
          </picture>
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
