
// FONCTIONS POUR LE POPUP D'OPTIONS DE CALENDRIER.

/**
 * Affiche le popup des options.
 * Si <start> est vrai, considère que le popup est ouvert au moment de l'ajout d'un calendrier.
 * Initialise/réinitialise les éléments du popup.
 */
function displayPopup(start) {
  document.getElementById("erreur_form").style.display = "none";
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;
  let popup = document.getElementById("more_popup");
  let labelDates = document.getElementById("label_dates");
  let champAnnees = document.getElementById("champ_annees");
  let fermer = document.getElementById("fermer_popup");
  let importer = document.getElementById("drop_zone");
  let contratPro = document.getElementById("contrat_pro");
  let selectAnnee = document.getElementById("selectAnnee");
  let selectMois = document.getElementById("selectMois");
  let labelStart = document.getElementById("label_start");
  let labelAnnee = document.getElementById("label_annee");
  let labelMois = document.getElementById("label_mois");
  let champHoraire = document.getElementById("horaireDemiJournee");
  let boutonAddVac = document.getElementById("btn_add_vacances");

  for(let el of document.getElementsByClassName("wrong")) {
    el.classList.remove("wrong");
  }

  if($("#dropdownAdvanced").hasClass("show")) {
    $("#dropdownAdvanced").removeClass("show");
  }

  if(start) {
    selectAnnee.innerHTML = "";
    let option;
    for(let i = currentYear; i<currentYear+10; i++) {
      option = new Option(i, i);
      selectAnnee.appendChild(option);
    }

    selectMois.innerHTML = "";
    for(let i = 0; i<months.length; i++) {
      option = new Option(months[i], i+1);
      selectMois.appendChild(option);
    }

    selectAnnee.style.display = "inherit";
    selectMois.style.display = "inherit";
    labelAnnee.style.display = "inherit";
    labelMois.style.display = "inherit";
    labelStart.style.display = "inherit";

    document.getElementById("titre_popup").innerHTML = "Quelques informations avant de commencer :";
    fermer.style.display = "none";
    importer.style.display = "none";
    labelDates.style.display = "inherit";
    champAnnees.style.display = "block";
    contratPro.style.display = "block";
    document.getElementById("radio_pro").checked = false;
    document.getElementById("radio_nonpro").checked = false;

    champAnnees.value = "";
  } else {
    selectAnnee.style.display = "none";
    selectMois.style.display = "none";
    labelAnnee.style.display = "none";
    labelMois.style.display = "none";
    labelStart.style.display = "none";

    document.getElementById("titre_popup").innerHTML = "Options";
    fermer.style.display = "inline-block";
    importer.style.display = "block";
    labelDates.style.display = "none";
    champAnnees.style.display = "none";
    contratPro.style.display = "none";
    champAnnees.value = calendars[parseInt(select.options[choice].value, 10)][5];
  }

  champHoraire.value = calendars[parseInt(select.options[choice].value, 10)][8];
  boutonAddVac.style.display = "";

  let list = document.getElementById("liste_vacances");
  list.innerHTML = "";
  if(start) {
    addVacancesItem();
  }

  popup.style.display = "block";
}

/**
 * Ferme le popup sans tenir compte des changements.
 */
function closePopup() {
  let popup = document.getElementById("more_popup");
  popup.style.display = "none";
}

/**
 * Ajoute un item de vacances au popup.
 * Si 5 vacances sont ajoutées, cache le bouton d'ajout.
 */
function addVacancesItem() {
  let list = document.getElementById("liste_vacances");
  let vacances = list.getElementsByClassName("vacances");
  let idVac;

  // S'il n'y a pas d'item de vacances déjà ajouté on commence l'indexation à 0.
  if(vacances.length == 0) {
    idVac = 0;
  // Sinon on récupère l'index à partir de l'id du dernier item de vacances ajouté.
  } else {
    let inputs = vacances[vacances.length - 1].getElementsByTagName("input");
    let id = inputs[0].id;
    idVac = parseInt(id.substr(8,id.length), 10);
  }

  // Création et ajout de l'item de vacances.
  let li = document.createElement("li");
  li.className = "list-group-item vacances";
  li.innerHTML = "Du <input type=\"date\" id=\"debutVac" + (idVac+1) + "\" min=\"2018-01-01\" class=\"form-control dateInput\"/> au <input type=\"date\" id=\"finVac" + (idVac+1) + "\" min=\"2018-01-01\" class=\"form-control dateInput\"/>. <a class=\"btn btn-danger\" onclick=\"deleteVacancesItem('debutVac" + (idVac+1) + "');\"><img src=\"content/dustbin.png\" alt=\"Suppr\" class=\"btnPopupDel\" title=\"Supprimer le calendrier courant.\"></a>";/*TODO improve*/
  list.appendChild(li);

  // Si la taille de la liste excède 5 il y a des risques que le popup soit trop grand pour la fenêtre.
  // Il faut donc empêcher l'ajout d'un nouvel item.
  if(list.children.length > 5) {
    let boutonAddVac = document.getElementById("btn_add_vacances");
    boutonAddVac.style.display = "none";
  }
}

/**
 * Supprime l'élément parent de <idItem>.
 */
function deleteVacancesItem(idItem) {
  document.getElementById(idItem).parentNode.remove();
}

/**
 * Vérifie les données entrées dans le popup.
 * S'il y a une erreur, affiche le message d'erreur et surligne en rouge les éléments concernés.
 * Sinon lance la prise en compte des changements.
 */
function validateForm() {
  let list = document.getElementById("liste_vacances");
  let vacances = list.getElementsByClassName("vacances");
  let errors = [];
  let id;
  let finVac = "", debutVac = "";
  let champAnnees = document.getElementById("champ_annees").value;
  let radios = document.getElementsByName("contratInput");

  if(!started) {
    let divContrat = "contrat_pro";
    for(let r of radios) {
      if(r.checked) divContrat = null;
    }
    if(divContrat != null) errors.push("label_contrat");
    if(champAnnees == "" || !champAnnees.match(/(\d+)/)) errors.push("champ_annees");
  }

  for (let vac of vacances) {
    let inputs = document.querySelectorAll(".vacances input");
    for (let input of inputs) {
      id = input.id;
      if(id.includes("debutVac")) {
        debutVac = document.getElementById(id).value;
        if(debutVac == "" || !debutVac.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(id);
      }
      if(id.includes("finVac")) {
        finVac = document.getElementById(id).value;
        if(finVac == "" || !finVac.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(id);
      }
    }
  }

  document.getElementById("erreur_form").style.display = "none";
  if(errors.length > 0){
    document.getElementById("erreur_form").style.display = "block";
    for (let error of errors) {
      document.getElementById(error).classList.add('wrong');
    }
  } else {
    validatePopup();
    putVacances();
  }
}

/**
 * Récupère les données entrées dans le popup et effectue les modifications pour le calendrier courant.
 * Les champs utilisés dépendent de la valeur de la variable globale <started>.
 * Une fois les modifications effectuées, cache le popup.
 */
function validatePopup() {
  let nbAnnees = parseInt(document.getElementById("champ_annees").value, 10);
  let popup = document.getElementById("more_popup");
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;
  let radios = document.getElementsByName("contratInput");
  let selectAnnee = document.getElementById("selectAnnee");
  let selectMois = document.getElementById("selectMois");
  let contratPro = null;
  for(let r of radios) {
    if(r.checked) {
      switch(r.value) {
        case "oui":
        contratPro = true;
        break;
        case "non":
        contratPro = false;
        break;
      }
    }
  }

  if(!started) {
    calendars[parseInt(select.options[choice].value, 10)][7] = new Array(selectAnnee.options[selectAnnee.selectedIndex].value, selectMois.options[selectMois.selectedIndex].value);
  }

  if(isNaN(nbAnnees)) {
    calendars[parseInt(select.options[choice].value, 10)][5] = 1;
    if(calendars[parseInt(select.options[choice].value, 10)][6] == null) {
      calendars[parseInt(select.options[choice].value, 10)][6] = contratPro;
    }
  } else {
    calendars[parseInt(select.options[choice].value, 10)][5] = nbAnnees;
    if(calendars[parseInt(select.options[choice].value, 10)][6] == null) {
      calendars[parseInt(select.options[choice].value, 10)][6] = contratPro;
    }
  }

  if(started) {
    save();
    display(select.options[choice].value);
  } else {
    let selectAnnee = document.getElementById("selectAnnee");
    let selectMois = document.getElementById("selectMois");
    displayCalendar(nbAnnees, selectAnnee[selectAnnee.selectedIndex].value, selectMois[selectMois.selectedIndex].value);
    started = true;
    save();
    let infosPro = document.getElementsByClassName("contrat_pro_info");
    for(let i of infosPro) {
      if(contratPro) {
        i.style.display = "block";
      } else {
        i.style.display = "none";
      }
    }
  }
  popup.style.display = "none";
}

/**
 * Ajoute les périodes de vacances entrées dans le popup au calendrier courant.
 * Retrouve la date de début de chaque période dans le calendrier et lance le coloriage des jours suivants.
 */
function putVacances() {
  let vacances = document.querySelectorAll(".vacances");
  let nVac = 1;
  let debut, fin, anneeDebut, anneeFin;

  for(let v of vacances) { // TODO:improve
    debut = new Date($("#debutVac"+nVac).val());
    fin = new Date($("#finVac"+nVac).val());

    // Si la date entrée pour la fin est avant celle du début on inverse les deux pour que la fonction reste valide.
    if(debut > fin) {
      let tmp = fin;
      fin = debut;
      debut = temp;
    }
    nVac++;

    // On crée un tableau contenant les années sur lesquelles les vacances s'étalent.
    // Cela permet de gérer le cas où une période de vacances est à cheval sur deux années.
    anneeDebut = debut.getFullYear();
    anneeFin = fin.getFullYear();
    let anneesVacances = [];
    for(let i=anneeDebut; i<=anneeFin; i++) anneesVacances.push(i);

    let calendar = document.getElementById("calendar");
    let tables = calendar.childNodes;
    let yearsTH, years = [];
    yearsTH = document.querySelectorAll("#calendar table thead th");

    // On récupère les années sur lesquelles s'étale le calendrier courant.
    // On conserve également la largeur en termes de colonnes pour pouvoir gérer l'itération qui va venir.
    for(let y of yearsTH) {
      let o = {
        y: parseInt(y.innerHTML, 10),
        n: parseInt(y.colSpan, 10)
      };
      years.push(o);
    }

    // On vérifie que la période de vacances en cours de traitement entre bien dans le calendrier courant.
    let yBool = false;
    for(let y of years) {
      if(anneesVacances.includes(y.y)) yBool = true;
    }
    // Si ce n'est pas le cas on arrête le traitement.
    if(!yBool) return;

    // Enfin on itère grâce au type Date entre la date de début et la date de fin pour colorier les cases correspondantes.
    for(let d = debut; debut<=fin; d.setDate(d.getDate()+1)) {
      addVacancesColor(years, d.getDate(), d.getMonth()+1, d.getFullYear());
    }
  }
}

/**
 * Colorie la case correspondant au jour <day>, au mois <month et à l'année <year>.
 * Les objets contenus dans <years> permettent de connaitre la largeur de chaque année présente dans le calendrier.
 */
function addVacancesColor(years, day, month, year) {
  // On récupère toutes les tables correspondant aux mois.
  let monthTABLE = document.querySelectorAll("#calendar table tbody tr td table:not(.recap)");
  let currentMonth, index = -1;

  // On itère dans les mois sélectionnés et on vérifie qu'il corresponde au mois recherché.
  // S'il ne correspond pas, on passe au suivant.
  for(let y of years) {
    for(let i=0; i<y.n; i++) {
      index++;
      if(y.y != year) continue;
      currentMonth = monthTABLE[index].querySelector("thead tr td").textContent;
      switch(currentMonth) {
        case "Janvier":
        if(month != 1) continue;
        break;
        case "Février":
        if(month != 2) continue;
        break;
        case "Mars":
        if(month != 3) continue;
        break;
        case "Avril":
        if(month != 4) continue;
        break;
        case "Mai":
        if(month != 5) continue;
        break;
        case "Juin":
        if(month != 6) continue;
        break;
        case "Juillet":
        if(month != 7) continue;
        break;
        case "Août":
        if(month != 8) continue;
        break;
        case "Septembre":
        if(month != 9) continue;
        break;
        case "Octobre":
        if(month != 10) continue;
        break;
        case "Novembre":
        if(month != 11) continue;
        break;
        case "Décembre":
        if(month != 12) continue;
        break;
        default:
        break;
      }

      // Remplissage de la cellule avec la catégorie Vacances.
      let days = monthTABLE[index].querySelectorAll("tbody tr");
      let cells = days[day].querySelectorAll("td");
      cells[2].className = "day vacanceCat";
      cells[3].className = "day vacanceCat";
    }
  }
}
