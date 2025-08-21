document.addEventListener("DOMContentLoaded", () => {
  const inscriptionForm = document.getElementById("inscriptionForm");

  if (inscriptionForm) {
    inscriptionForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Empêche l'envoi classique du formulaire

      // !! IMPORTANT !!
      // Remplacez le numéro ci-dessous par votre numéro WhatsApp au format international (sans le '+')
      const phoneNumber = "2250713604482";

      // Récupérer les valeurs des champs
      const eventSelect = document.getElementById("event");
      const eventName = eventSelect.options[eventSelect.selectedIndex].text;
      const fullName = document.getElementById("fullname").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const tickets = document.getElementById("tickets").value;
      const message = document.getElementById("message").value;

      // Construire le message pour WhatsApp
      let whatsappMessage = `*Nouvelle Inscription pour un Événement*\n\n`;
      whatsappMessage += `*Événement :* ${eventName}\n`;
      whatsappMessage += `*Nom complet :* ${fullName}\n`;
      whatsappMessage += `*Email :* ${email}\n`;
      whatsappMessage += `*Téléphone :* ${phone}\n`;
      whatsappMessage += `*Nombre de places :* ${tickets}\n`;
      if (message) {
        whatsappMessage += `*Message :* ${message}\n`;
      }

      // Encoder le message pour l'URL
      const encodedMessage = encodeURIComponent(whatsappMessage);

      // Créer l'URL WhatsApp
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(whatsappURL, "_blank");
    });
  }
});
