// Contact form functionality

document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    console.log("Contact form not found");
    return;
  }

  // Enhanced form validation for contact form
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Additional validation
    let isValid = true;
    const errors = [];

    // Validate name
    if (data.name.length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Veuillez entrer une adresse email valide");
      isValid = false;
    }

    // Validate subject
    if (data.subject.length < 3) {
      errors.push("Le sujet doit contenir au moins 3 caractères");
      isValid = false;
    }

    // Validate message
    if (data.message.length < 10) {
      errors.push("Le message doit contenir au moins 10 caractères");
      isValid = false;
    }

    if (isValid) {
      // !! IMPORTANT !!
      // Remplacez le numéro ci-dessous par votre numéro WhatsApp au format international (sans le '+')
      const phoneNumber = "2250102030405";

      // Construire le message pour WhatsApp
      let whatsappMessage = `*Nouveau Message depuis le Site Web*\n\n`;
      whatsappMessage += `*Nom :* ${data.name}\n`;
      whatsappMessage += `*Email :* ${data.email}\n`;
      whatsappMessage += `*Sujet :* ${data.subject}\n\n`;
      whatsappMessage += `*Message :*\n${data.message}\n`;

      // Encoder le message pour l'URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Créer l'URL WhatsApp
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappURL, "_blank");

      // Afficher un message de succès et réinitialiser le formulaire
      showSuccessMessage();
      contactForm.reset();
    } else {
      showErrorMessage(errors[0]);
    }
  });

  function showLoadingState() {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    }
  }

  function hideLoadingState() {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Envoyer le message";
    }
  }

  function showSuccessMessage() {
    const message = document.createElement("div");
    message.className = "alert alert-success";
    message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Message envoyé avec succès !</strong>
            <br>Nous vous répondrons dans les plus brefs délais.
        `;

    contactForm.parentNode.insertBefore(message, contactForm);

    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 5000);
  }

  function showErrorMessage(error) {
    const message = document.createElement("div");
    message.className = "alert alert-error";
    message.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <strong>Erreur :</strong> ${error}
        `;

    contactForm.parentNode.insertBefore(message, contactForm);

    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 5000);
  }

  // Add CSS for alerts
  const style = document.createElement("style");
  style.textContent = `
        .alert {
            padding: 1rem;
            margin-bottom: 2rem;
            border-radius: 5px;
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .alert i {
            margin-top: 2px;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
  document.head.appendChild(style);

  console.log("Contact form functionality loaded");
});
