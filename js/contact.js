document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const msg = document.getElementById('message');
  const status = document.getElementById('status');

  if (!name.value || !email.value || !msg.value) {
    status.textContent = "Please fill in all fields.";
    status.style.color = "red";
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    status.textContent = "Invalid email format.";
    status.style.color = "red";
  } else {
    status.textContent = "Message sent successfully!";
    status.style.color = "green";
  }
});
