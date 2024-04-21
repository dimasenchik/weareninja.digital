const emojiInput = document.querySelector(".emoji-input");
const emojiPreview = document.querySelector(".emoji-input-placeholder");
const numberInput = document.querySelector(".input-number");
const dropdownContent = document.querySelector(".dropdown-content");
const countryList = document.querySelector(".country-list");
const arrowDropdown = document.querySelector(".dropdown-arrow");

const name = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const dropdown = document.querySelector("#dropdown");
const message = document.querySelector("#message");
const searchInput = document.querySelector(".search-input");
const successMessage = document.querySelector(".success-text");

const pathElement = document.querySelector("path");
const pathWrapper = document.querySelector(".dropdown-input-arrow");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultCountry = {
  flags: {
    png: "https://flagcdn.com/w320/ua.png",
    svg: "https://flagcdn.com/ua.svg",
    alt: "The flag of Ukraine is composed of two equal horizontal bands of blue and yellow.",
  },
  name: {
    common: "Ukraine",
    official: "Ukraine",
    nativeName: {
      ukr: {
        official: "Україна",
        common: "Україна",
      },
    },
  },
  idd: {
    root: "+3",
    suffixes: ["80"],
  },
};

emojiInput.value = defaultCountry.name.common;
emojiPreview.src = defaultCountry.flags.svg;

updateNumberInput(
  defaultCountry.idd.suffixes.length === 1
    ? defaultCountry.idd.root + defaultCountry.idd.suffixes[0]
    : defaultCountry.idd.root
);

let countryData;
let selectedCountry = defaultCountry;

const defaultPlaceholders = {
  name: "Name",
  email: "Email",
  phone: "(99)-999-99-99",
  dropdown: "Subject",
  message: "Message",
  phoneDropdown: "Search...",
};

fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd")
  .then((response) => response.json())
  .then((data) => {
    countryData = data;

    countryData.forEach((country) => {
      const countryItem = document.createElement("li");
      countryItem.classList.add("country-item");
      countryItem.innerHTML = `
        <span class="country-name">${country.name.common}</span>
        <span class="country-code">${
          country.idd.suffixes.length === 1
            ? country.idd.root + country.idd.suffixes[0]
            : country.idd.root
        }</span>
        <img src="${country.flags.svg}" style="width: 30px"></img>
        `;
      countryItem.addEventListener("click", () => {
        console.log(country);

        emojiInput.value = country.name.common;
        emojiPreview.src = country.flags.svg;
        selectedCountry = country;

        updateNumberInput(
          country.idd.suffixes.length === 1
            ? country.idd.root + country.idd.suffixes[0]
            : country.idd.root
        );
      });
      countryList.appendChild(countryItem);
    });
  })
  .catch((error) => {
    console.error("Error fetching the JSON data:", error);
  });

function updateNumberInput(countryCode) {
  const selectedCountryElement =
    document.getElementsByClassName("selected-country")[0];

  dropdownContent.className = "dropdown-content hidden";
  numberInput.value = "";

  selectedCountryElement.innerHTML = countryCode;
}

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredCountries = countryData.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm)
  );

  countryList.innerHTML = "";
  filteredCountries.forEach((country) => {
    const countryItem = document.createElement("li");
    countryItem.classList.add("country-item");
    countryItem.innerHTML = `
    <span class="country-name">${country.name.common}</span>
    <span class="country-code">${
      country.idd.suffixes.length === 1
        ? country.idd.root + country.idd.suffixes[0]
        : country.idd.root
    }</span>
    <img src="${country.flags.svg}" style="width: 30px"></img>
    `;

    countryItem.addEventListener("click", () => {
      console.log(country);

      emojiInput.value = country.name.common;
      emojiPreview.src = country.flags.svg;
      selectedCountry = country;

      updateNumberInput(
        country.idd.suffixes.length === 1
          ? country.idd.root + country.idd.suffixes[0]
          : country.idd.root
      );
    });
    countryList.appendChild(countryItem);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const subjectInput = document.querySelector(".subject-input");
  const dropdownContent = document.querySelector(".subject-content");

  const dropdownOptions = dropdownContent.querySelectorAll("a");
  dropdownOptions.forEach((option) => {
    option.addEventListener("click", function (event) {
      event.preventDefault();

      subjectInput.value = option.textContent;
      dropdownContent.style.display = "block";
    });
  });

  subjectInput.addEventListener("click", function () {
    pathElement.style.fill = "black";
    pathWrapper.style.rotate = "-90deg";

    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

  window.addEventListener("click", function (event) {
    if (!event.target.matches(".subject-input")) {
      if (dropdownContent.style.display === "block") {
        pathElement.style.fill = "white";
        pathWrapper.style.rotate = "0deg";

        dropdownContent.style.display = "none";
      }
    }
  });
});

function onSubmitData() {
  let isValid = true;

  if (name.value === "") {
    name.classList.add("error");
    name.placeholder = "Name is required";
    isValid = false;
  }

  if (email.value === "") {
    email.classList.add("error");
    email.placeholder = "Email is required";
    isValid = false;
  }

  if (email.value && !emailRegex.test(email.value)) {
    alert("Email is not correct");
    isValid = false;
  }

  if (phone.value === "") {
    phone.classList.add("error");
    phone.placeholder = "Phone number is required";
    isValid = false;
  }

  if (phone.value.length < 5) {
    alert("Minimum length of phone number is 5 symbols");
    isValid = false;
  }

  if (dropdown.value === "") {
    dropdown.classList.add("error");
    isValid = false;
  }

  if (message.value === "") {
    message.classList.add("error");
    message.placeholder = "Message is required";
    isValid = false;
  }

  if (isValid) {
    console.log("selectedCountry", selectedCountry);

    const payload = {
      name: name.value,
      email: email.value,
      phone_number:
        selectedCountry.idd.suffixes.length === 1
          ? selectedCountry.idd.root +
            selectedCountry.idd.suffixes[0] +
            phone.value
          : selectedCountry.idd.root + phone.value,
      subject: dropdown.value,
      message: message.value,
    };

    console.log("paylaod", payload);

    // AKfycbz3isw7E5IlFEpslFb6nN0QsN4UAMY2TUU968EjswdQuqro9xA3BzF0az8-bD8slEja

    // https://script.google.com/macros/s/AKfycbz3isw7E5IlFEpslFb6nN0QsN4UAMY2TUU968EjswdQuqro9xA3BzF0az8-bD8slEja/exec

    let formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fetch(
      "https://script.google.com/macros/s/AKfycbz3isw7E5IlFEpslFb6nN0QsN4UAMY2TUU968EjswdQuqro9xA3BzF0az8-bD8slEja/exec",
      {
        method: "POST",
        body: formData,
        // contentType: "application/json",
      }
    )
      .then((response) => response.text())
      .then((result) => {
        if (result === "Success") {
          successMessage.classList.add("active");
          resetFormToDefault();
        }
      });

    return;
  } else {
    return false;
  }
}

function resetFormToDefault() {
  name.classList.remove("error");
  email.classList.remove("error");
  phone.classList.remove("error");
  dropdown.classList.remove("error");
  message.classList.remove("error");

  name.placeholder = defaultPlaceholders.name;
  email.placeholder = defaultPlaceholders.email;
  // phone.placeholder = defaultPlaceholders.phone;
  dropdown.placeholder = defaultPlaceholders.dropdown;
  message.placeholder = defaultPlaceholders.message;
  searchInput.placeholder = defaultPlaceholders.phoneDropdown;

  name.value = "";
  email.value = "";
  phone.value = "";
  dropdown.value = "";
  message.value = "";
  searchInput.value = "";
}

function resetForm() {
  const form = document.querySelector("form");
  form.reset();
  const formElements = form.elements;
  for (let i = 0; i < formElements.length; i++) {
    formElements[i].classList.remove("error");
    formElements[i].placeholder = "";
  }

  resetFormToDefault();
  successMessage.classList.remove("active");
}

// Added event listeners to reset error styles when fields are interacted with
document.getElementById("name").addEventListener("input", function () {
  this.classList.remove("error");
  this.placeholder = "Name";
});

document.getElementById("email").addEventListener("input", function () {
  this.classList.remove("error");
  this.placeholder = "Email";
});

document.getElementById("phone").addEventListener("input", function () {
  this.classList.remove("error");
  this.placeholder = "(99)-999-99-99";
});

document.getElementById("dropdown").addEventListener("change", function () {
  this.classList.remove("error");
});

document.getElementById("message").addEventListener("input", function () {
  this.classList.remove("error");
  this.placeholder = "Message";
});

function handleShowContactModal() {
  const hiddenModal = document.getElementsByClassName("contact-form hidden")[0];
  const hiddenBG = document.getElementsByClassName(
    "background-contact hidden"
  )[0];

  const activeModal = document.getElementsByClassName("contact-form active")[0];
  const activeBG = document.getElementsByClassName(
    "background-contact active"
  )[0];

  if (hiddenModal) {
    hiddenModal.className = "contact-form active";
    hiddenBG.className = "background-contact active";
    resetFormToDefault();
  }

  if (activeModal) {
    activeModal.className = "contact-form hidden";
    activeBG.className = "background-contact hidden";
    resetFormToDefault();
  }
}

function handleShowCountryDropdown() {
  const hiddenDropdown = document.getElementsByClassName(
    "dropdown-content hidden"
  )[0];
  const activeDropdown = document.getElementsByClassName(
    "dropdown-content active"
  )[0];

  if (hiddenDropdown) {
    hiddenDropdown.className = "dropdown-content active";
  }

  if (activeDropdown) {
    activeDropdown.className = "dropdown-content hidden";
  }
}

function handleShowUpcomingModal() {
  const hiddenModal = document.getElementsByClassName(
    "upcoming-popup hidden"
  )[0];
  const hiddenBG = document.getElementsByClassName(
    "background-upcoming hidden"
  )[0];

  const activeModal = document.getElementsByClassName(
    "upcoming-popup active"
  )[0];
  const activeBG = document.getElementsByClassName(
    "background-upcoming active"
  )[0];

  if (hiddenModal) {
    hiddenModal.className = "upcoming-popup active";
    hiddenBG.className = "background-upcoming active";
  }

  if (activeModal) {
    activeModal.className = "upcoming-popup hidden";
    activeBG.className = "background-upcoming hidden";
  }
}
