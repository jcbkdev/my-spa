let pageUrls = {
  about: "/index.html?about",
  contact: "/index.html?contact",
  gallery: "/index.html?gallery",
};
function OnStartUp() {
  popStateHandler();
}
OnStartUp();
document.querySelector("#about-link").addEventListener("click", (event) => {
  let stateObj = { page: "about" };
  document.title = "About";
  history.pushState(stateObj, "about", "?about");
  RenderAboutPage();
});
document.querySelector("#contact-link").addEventListener("click", (event) => {
  let stateObj = { page: "contact" };
  document.title = "Contact";
  history.pushState(stateObj, "contact", "?contact");
  RenderContactPage();
});
document.querySelector("#gallery-link").addEventListener("click", (event) => {
  let stateObj = { page: "gallery" };
  document.title = "Gallery";
  history.pushState(stateObj, "gallery", "?gallery");
  RenderGalleryPage();
});
function RenderAboutPage() {
  document.querySelector("main").innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max + 1);
}

function generateCaptcha() {
  const num1 = getRandomInt(10);
  const num2 = getRandomInt(10);
  const operations = ["+", "-", "*"];
  const operation = operations[getRandomInt(operations.length)];

  let correctAnswer;
  switch (operation) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
  }

  return { question: `${num1} ${operation} ${num2}`, answer: correctAnswer };
}

function RenderContactPage() {
  const captchaData = generateCaptcha();

  document.querySelector("main").innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <label for="message">Message:</label>
          <textarea id="message" name="message" required></textarea>
          
          <!-- Math CAPTCHA -->
          <div id="captcha-container">
            <p id="captcha-question">Solve: ${captchaData.question}</p>
            <input type="number" id="captcha-answer" required>
            <input type="hidden" id="captcha-correct-answer" value="${captchaData.answer}">
          </div>
  
          <!-- Google reCAPTCHA widget -->
          <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
          
          <button type="submit">Send</button>
        </form>`;

  document
    .getElementById("contact-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const captchaAnswer = parseInt(
        document.getElementById("captcha-answer").value,
        10
      );
      const correctCaptchaAnswer = parseInt(
        document.getElementById("captcha-correct-answer").value,
        10
      );

      if (!name || !email || !message) {
        alert("Please fill out all fields.");
        return;
      }

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (captchaAnswer !== correctCaptchaAnswer) {
        alert("Incorrect CAPTCHA. Please try again.");
        return;
      }

      alert("Form submitted!");
    });
}

function lazyload() {
  const lazyLoadImages = document.querySelectorAll(".lazy");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImage.classList.remove("lazy");
        imageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyLoadImages.forEach((lazyImage) => {
    imageObserver.observe(lazyImage);
  });
}

document.addEventListener("DOMContentLoaded", lazyload);

async function loadImages() {
  let images = [];
  for (let i = 1; i <= 9; i++) {
    const response = await fetch(`/gallery/${i}.jpg`);
    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      const imgElement = document.createElement("img");
      imgElement.src = imageUrl;
      imgElement.setAttribute("loading", "lazy");
      imgElement.classList.add("lazy");
      imgElement.classList.add("gallery-image");
      imgElement.addEventListener("click", previewImage);
      images.push(imgElement);
    }
  }
  return images;
}

function previewImage(e) {
  // Create a dialog element
  const dialog = document.createElement("dialog");
  dialog.id = "modal";

  const img = document.createElement("img");
  img.src = e.target.src;

  dialog.innerHTML = `
        <button id="close-btn">X</button>
    `;

  dialog.appendChild(img);

  // Append the dialog to the body
  document.body.appendChild(dialog);

  dialog.showModal();
  // Add event listener to close button
  document.getElementById("close-btn").addEventListener("click", () => {
    dialog.close();
    document.body.removeChild(dialog); // Remove dialog after closing
  });
}

function RenderGalleryPage() {
  loadImages().then((data) => {
    console.log("data", data);
    const galleryElement = document.querySelector("#gallery");
    data.forEach((img) => {
      galleryElement.appendChild(img);
    });
    return;
  });

  document.querySelector("main").innerHTML = `
        <h1 class="title">Gallery</h1>
        <div id="gallery">
            
        </div>
    `;
}

function popStateHandler() {
  let loc = window.location.href.toString().split(window.location.host)[1];
  if (loc === pageUrls.contact) {
    RenderContactPage();
  }
  if (loc === pageUrls.about) {
    RenderAboutPage();
  }
  if (loc === pageUrls.gallery) {
    RenderAboutPage();
  }
}
window.onpopstate = popStateHandler;

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
