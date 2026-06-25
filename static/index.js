document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.getElementById("navList");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("open");
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      const name = contactForm.elements["name"].value.trim();
      const phone = contactForm.elements["phone"].value.trim();
      const email = contactForm.elements["email"].value.trim();
      const address = contactForm.elements["address"].value.trim();
      const desc = contactForm.elements["desc"].value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !phone || !email || !address || !desc || !emailPattern.test(email)) {
        event.preventDefault();
        alert("Please complete all fields and enter a valid email address before submitting.");
      }
    });
  }
});