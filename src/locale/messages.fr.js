export default {
  Trans: {
    beginning: "Début",
    cost: "Coût",
    date: "Date",
    day: "jour",
    week: "semaine",
    month: "mois",
    days: "jours",
    view: "Aperçu",
    description: "Description",
    delete: "Supprimer",
    "delete.confirm": "Êtes vous sur de supprimer?",
    download: "Télécharger",
    print: "Imprimer",
    end: "Fin",
    edit: "Modifier",
    save: "Enregistrer",
    send: "Envoyer",
    cancel: "Annuler",
    total: "Total",
    notFound: "Aucun",

    mister: "Monsieur",
    miss: "Madame",

    facebook: "Facebook",
    linkedin: "Linkedin",
    twitter: "Twitter",

    matin: "Matin",
    apresmidi: "Après-midi",
    refused: "Refusée",
    approved: "Acceptée",
    requested: "En attente",
    accepted: "Acceptée",

    monday: "Lundi",
    tuesday: "Mardi",
    wednesday: "Mercredi",
    thursday: "Jeudi",
    friday: "Vendredi",
    saturday: "Samedi",
    sunday: "Dimanche",

    welcome: "Bonjour __USER__",

    address: "Adresse",
    "address.street": "Rue",
    "address.country": "Pays",
    "address.city": "Ville",
    "address.postalCode": "Code Postal",

    error: {
      required: "Merci de renseigner ce champ",
      "email.invalid": "E-Mail invalide",
      "phone.invalid": "Numéro de téléphone invalide",
      "amountquote.invalid": "Montant de commande invalide",
      "socialSecurityNumber.invalid": "Numéro de sécurité social invalide"
    },

    advancedSearch: {
      show: "Filtres Avancés",
      hide: "Masquer les Filtres"
    },

    login: {
      username: "Nom d'Utilisateur",
      password: "Mot de Passe",
      rememberMe: "Se souvenir de moi",

      "logIn.button": "Connexion",
      "logOut.button": "Déconnexion",
      "username.error.required": "Veuillez reseigner votre identifiant",
      "password.error.required": "Veuillez taper votre mot de passe"
    },
    user: {
      firstName: "Prénom",
      lastName: "Nom",
      name: "Nom",
      username: "Identifiant",
      nationality: "Nationalité",
      schedules: "Horaires de formation",
      birthDate: "Date de naissance",
      noData: "Aucun stagiaire n'est concerné.",
      select: "Sélectionnez un stagiaire",
      email: "Email",
      boats: "Bateaux",
      phoneNumber: "N° Téléphone",
      password: "Mot de passe",
      passwordConfirm: "Confirmez votre mot de passe",
      "password.error.required": "Veuillez taper votre mot de passe",
      address: "Adresse",
      postalCode: "Code Postal",
      city: "Ville",
      role: "Role",
      type: "Type"
    },
    treatments: "Soins",
    treatment: {
      name: "Soin",
      description: "Description",
      add: {
        _: "Ajouter un soin",
        success: "Soin __name__ créé.",
        error: "Une erreur est survenue",
      },
      delete: {
        _: "Supprimer un soin",
        success: "Soin __name__ supprimé.",
        error: "Une erreur est survenue",
      },
      update: {
        _: "Modifier un soin",
        success: 'Soin "__name__" modifiée',
        error: "Une erreur est survenue"
      },
    },
    symptoms: "Symptomes",
    symptom: {
      name: "Symptôme",
      description: "Description",
      add: {
        _: "Ajouter un symptôme",
        success: "Symptôme __name__ créé.",
        error: "Une erreur est survenue",
      },
      delete: {
        _: "Supprimer un symptôme",
        success: "Symptôme __name__ supprimé.",
        error: "Une erreur est survenue",
      },
      update: {
        _: "Modifier un symptôme",
        success: 'Symptôme "__name__" modifiée',
        error: "Une erreur est survenue"
      },
      treatments: "Soins",
    }
  },

  // Ant Design
  Table: {
    filterTitle: "Rechercher...",
    filterConfirm: "OK",
    filterReset: "Réinitialiser",
    emptyText: "Aucune donnée"
  },
  Modal: {
    okText: "OK",
    cancelText: "Annuler",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Annuler"
  },
  Transfer: {
    notFoundContent: "Pas de résultat",
    searchPlaceholder: "Recherche",
    itemUnit: "élément",
    itemsUnit: "éléments"
  },
  Select: {
    notFoundContent: "Pas de résultat"
  },
  Pagination: {
    // Options.jsx
    items_per_page: "/ page",
    jump_to: "Allez à",
    page: "",

    // Pagination.jsx
    prev_page: "Page Précédente",
    next_page: "Page Suivante",
    prev_5: "5 Pages Précédentes",
    next_5: "5 Pages Suivantes",
    prev_3: "3 Pages Précédentes",
    next_3: "3 Pages Suivantes"
  },
  TimePicker: {
    placeholder: ""
  },
  DatePicker: {
    lang: {
      today: "Aujourd'hui",
      now: "Maintenant",
      backToToday: "Retour à aujourdh'hui",
      ok: "Ok",
      clear: "Vider",
      month: "Mois",
      year: "Année",
      timeSelect: "Sélectionner l'heure",
      dateSelect: "Sélectionner une date",
      monthSelect: "Sélectionner un mois",
      yearSelect: "Sélectionner une année",
      decadeSelect: "Sélectionner une décénie",
      yearFormat: "YYYY",
      dateFormat: "M/D/YYYY",
      dayFormat: "D",
      dateTimeFormat: "M/D/YYYY HH:mm:ss",
      monthFormat: "MMMM",
      monthBeforeYear: true,
      previousMonth: "Mois précédent (PageUp)",
      nextMonth: "Mois suivant (PageDown)",
      previousYear: "Année précédente (Control + left)",
      nextYear: "Année suivante (Control + right)",
      previousDecade: "Décennie précédente",
      nextDecade: "Décennie suivante",
      previousCentury: "Siècle précédent",
      nextCentury: "Siècle suivant",

      placeholder: "Sélectionnez une date",
      rangePlaceholder: ["Date de début", "Date de fin"]
    }
  }
};
