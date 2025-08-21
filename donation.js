document.addEventListener("DOMContentLoaded", () => {
  const donationForm = document.getElementById("donation-form");
  const amountInput = document.getElementById("amount");
  const amountButtons = document.querySelectorAll(".amount-btn");

  // S'assurer que les éléments existent avant d'ajouter des écouteurs
  if (!donationForm || !amountInput || amountButtons.length === 0) {
    console.error(
      "Un ou plusieurs éléments du formulaire de don sont manquants."
    );
    return;
  }

  // Logique pour gérer les boutons de montant
  amountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      amountButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const amount = button.dataset.amount;
      if (amount) {
        amountInput.value = amount;
      } else {
        // Si le bouton "Autre" est cliqué, on vide le champ et on le focus
        amountInput.value = "";
        amountInput.focus();
      }
    });
  });

  // Si l'utilisateur tape un montant, on désélectionne les boutons
  amountInput.addEventListener("input", () => {
    amountButtons.forEach((btn) => btn.classList.remove("active"));
  });

  // Logique pour la soumission du formulaire vers WhatsApp
  donationForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Empêche l'envoi classique du formulaire

    // !! IMPORTANT !!
    // Remplacez le numéro ci-dessous par votre numéro WhatsApp au format international (sans le '+')
    const phoneNumber = "2250713604482";

    // Récupérer les valeurs des champs
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const amount = document.getElementById("amount").value;
    const paymentMethodElement = document.querySelector(
      'input[name="payment"]:checked'
    );

    // Vérification simple avant de continuer
    if (!firstName || !lastName || !email || !amount) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const paymentMethod = paymentMethodElement
      ? paymentMethodElement.nextElementSibling.textContent.trim()
      : "Non spécifié";

    // Construire le message pour WhatsApp
    let whatsappMessage = `*Nouvelle Intention de Don*

`;
    whatsappMessage += `*Donateur :* ${firstName} ${lastName}
`;
    whatsappMessage += `*Email :* ${email}
`;
    if (phone) {
      whatsappMessage += `*Téléphone :* ${phone}
`;
    }
    whatsappMessage += `*Montant :* ${amount} FCFA
`;
    whatsappMessage += `*Moyen de paiement souhaité :* ${paymentMethod}

`;
    whatsappMessage += `Merci de lui fournir les instructions pour finaliser le don.`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Créer l'URL WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Ouvrir WhatsApp dans un nouvel onglet
    window.open(whatsappURL, "_blank");
  });
});
