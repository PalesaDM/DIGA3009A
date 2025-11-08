document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  // ✅ Replace these with your EmailJS credentials
  const SERVICE_ID = "service_4fhy71h";
  const TEMPLATE_ID = "template_98axtic";
  const PUBLIC_KEY = "WSEg5CQ8iNKyxc0pb";

  // Initialize EmailJS
  emailjs.init(PUBLIC_KEY);

  // Animate in
  if (typeof gsap !== "undefined") {
    gsap.from(".contact-section h1", { opacity: 0, y: -30, duration: 0.7 });
    gsap.from(".contact-intro", { opacity: 0, y: -15, duration: 0.6, delay: 0.2 });
    gsap.from(".form-group", {
      opacity: 0,
      x: -20,
      duration: 0.4,
      stagger: 0.15,
      delay: 0.4,
    });
    gsap.from(".submit-btn", { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out"});
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "⚠️ Please fill out all fields.";
      status.style.color = "#b85124";
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      status.textContent = "⚠️ Please enter a valid email address.";
      status.style.color = "#b85124";
      return;
    }

    // Show sending message
    status.textContent = "📨 Sending your message...";
    status.style.color = "#5b3a29";
    const submitButton = form.querySelector(".submit-btn");
    submitButton.classList.add("loading");


    // Send via EmailJS
    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        message: message,
      })
      .then(() => {
        status.textContent = "✅ Message sent successfully! We'll be in touch soon.";
        status.style.color = "#2b5b2e";
        form.reset();
        submitButton.classList.remove("loading")
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        status.textContent = "❌ Failed to send. Please try again later.";
        status.style.color = "#b85124";
        submitButton.classList.remove("loading");

        // ✅ Show Thank You popup
     const popup = document.getElementById("thankYouPopup");
     popup.classList.remove("hidden");
    popup.classList.add("show");

// Auto-hide after 3 seconds
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.classList.add("hidden"), 400);
},  3000);
});
  });
});
