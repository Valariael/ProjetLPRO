
// FONCTIONS POUR L'EXPORT ET L'IMPORT DE CALENDRIER(S)

/**
 * Déclencheur de l'export.
 * Exporte le calendrier actuellement sélectionné.
 */
function exportThis() {
  let select = document.getElementById("selectCal");
  exportCalendar(select.selectedIndex);
}

/**
 * Exporte le calendrier d'index <id>.
 * Lance le téléchargement d'un fichier généré contenant les données au format JSON du calendrier.
 */
function exportCalendar(id) {
  // Transformation du tableau en chaine de caractères au format JSON.
  let blob = JSON.stringify(calendars[id]);
  let filename = "export_"+calendars[id][0];
  let elem = window.document.createElement('a');

  // On remplace tous les caractères interdits dans les noms de fichiers
  filename = filename.replace(/[`\s~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "_");
  // Encodage de la chaine de caractères créée pour le support Web et création du data URI.
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(blob));
  // Lancement du téléchargement.
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  // Suppression du lien après utilisation.
  document.body.removeChild(elem);
}

/**
 * Lance l'importation des données du fichier contenu dans l'input file.
 */
function importFile() {
  let file = document.getElementById("file_input").files[0];

  if (file) {
    // Utilisation de l'API FileReader pour récupérer les données du fichier.
    let r = new FileReader();
    // Quand l'instance est prête, importer le calendrier.
    r.onload = function(e) {
      let contents = e.target.result;
      importCalendar(contents);
    }
    // Les données stockées étant au format texte, on lit comme du texte.
    r.readAsText(file);
    // Informe l'utilisateur du succès ou de l'échec de l'opération.
    alert("Calendrier importé.");
  } else {
    alert("Échec de l'importation.");
  }
  // Vidage de l'input file après l'import.
  document.getElementById("file_input").value = "";
}

/**
 * Crée un calendrier avec les données encodées <data>.
 * Puis sélectionne et affiche le calendrier créé.
 */
function importCalendar(data) {
  // Recréation du tableau représentant le calendrier
  // après décodage de la chaine de caractères.
  let cal = JSON.parse(decodeURIComponent(data));

  // Ajout aux autres calendriers.
  calendars.push(cal);
  let index = calendars.indexOf(cal);

  // Ajout de l'option au select.
  let select = document.getElementById('selectCal');
  let newOption = new Option (cal[0], index);
  select.options.add(newOption);

  // Affichage du calendrier importé.
  $("#selectCal").val(index);
  display(index);

  save();
  started = true;
}

/**
 * Affiche/cache le menu avancé dans le popup.
 */
function switchAdvancedMenu() {
  if($("#dropdownAdvanced").hasClass("show")) {
    $("#dropdownAdvanced").removeClass("show");
  } else {
    $("#dropdownAdvanced").addClass("show");
  }
}

/**
 * Redéfinition de l'événement sur le bouton d'import pour déclencher l'événement de l'input file.
 */
$("#fullImportButton").click(function(e){
  $("#full_import_input").trigger('click');
});

/**
 * Exporte tous les calendriers actuellement stockés.
 * Lance le téléchargement d'un fichier généré contenant les données au format JSON du tableau contenant tous les calendriers.
 */
function exportAll() {
  // Suppression des éventuels null apparut dans la liste des calendriers (BUGFIX)
  // > assurer l'export clean.
  for (let i = calendars.length - 1; i >= 0; i--) {
    if(calendars[i] == null) {
      calendars.splice(i, 1);
    }
  }

  // Transformation du tableau en chaine de caractères au format JSON.
  let blob = JSON.stringify(calendars);
  let elem = window.document.createElement('a');
  // Encodage de la chaine de caractères créée pour le support Web et création du data URI.
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(blob));

  let date = new Date();
  let filename = "export_complet_" + date.toLocaleDateString('fr-FR');
  // Remplacement des '/' dans la date.
  filename = filename.replace("/", "_");
  // Lancement du téléchargement.
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  // Suppression du lien après utilisation.
  document.body.removeChild(elem);
}

/**
 * Lance l'importation complète des calendriers contenus dans le fichier déposé.
 * Propose également à l'utilisateur s'il veut remplacer ou non les calendriers existants.
 */
function importFullFile() {
  let file = document.getElementById("full_import_input").files[0];

  if (file) {
    // Utilisation de l'API FileReader pour récupérer les données du fichier.
    let r = new FileReader();
    // Quand l'instance est prête, importer le calendrier.
    r.onload = function(e) {
      let contents = e.target.result;

      if(confirm("Voulez-vous remplacer les calendriers existants ?\n(Cette opération est irréversible)")) {
        importAll(true, contents);
      } else {
        importAll(false, contents);
      }
    }
    // Les données stockées étant au format texte, on lit comme du texte.
    r.readAsText(file);
  } else {
    // Informe l'utilisateur en cas d'échec.
    alert("Échec de l'importation.");
  }
  // Vidage de l'input file après l'import.
  document.getElementById("full_import_input").value = "";
}

/**
 * Crée les calendriers suivant les données encodées contenues dans <data>.
 * Remplace ou non les existants suivant le booléen <override>.
 * Affiche le dernier calendrier importé.
 */
function importAll(override, data) {
  // Recréation du tableau représentant le calendrier après décodage de la chaine de caractères.
  let cal = JSON.parse(decodeURIComponent(data));

  let index;
  // Si <override> est vrai on remplace les calendriers existants, sinon on concatène.
  if(override) {
    index = 0;
    calendars = cal;
  } else {
    index = calendars.length;
    calendars = calendars.concat(cal);
  }

  let select = document.getElementById('selectCal');
  // Vidage du select nécessaire pour réinitialiser les valeurs.
  select.innerHTML = "";
  let newOption;
  // Ajoute une option pour chaque calendrier et affiche le dernier.
  for(let c of calendars) {
    newOption = new Option (c[0], index);
    select.options.add(newOption);
    index++;
  }
  index--;
  $("#selectCal").val(index);

  display(index);
  save();
  started = true;
}

/*---------------------------------- drag n drop --------------------------------------*/

/**
 * Empêche le comportement par défaut du glisser-déposer dans la fenêtre.
 * Récupère les données du fichier déposé avec l'interface 'DataTransferItemList' et lance l'importation.
 */
function dropHandler(ev) {
  // Empêche le comportement par défaut de l'évènement
  // (ouverture du fichier dans le navigateur).
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Utilisation de l'interface DataTransferItemList pour accéder au fichier.
    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
      // On ne traite que les fichiers.
      if (ev.dataTransfer.items[i].kind === 'file') {
        let file = ev.dataTransfer.items[i].getAsFile();

        if (file) {
          // Utilisation de l'API FileReader pour récupérer les données du fichier.
          let r = new FileReader();
          // Quand l'instance est prête, importer le calendrier.
          r.onload = function(e) {
            let contents = e.target.result;
            importCalendar(contents);
          }
          r.readAsText(file);
          alert("Calendrier importé.");
        }
      } else {
        alert("Échec de l'import du calendrier.");
      }
    }
  } else {
    // Utilisation de l'interface DataTransfer.
    alert("Interface DataTransfer indisponible, contactez un développeur.");
  }
}

/**
 * Empêche le comportement par défaut du glisser-déposer dans la fenêtre.
 */
function dragOverHandler(ev) {
  // Empêche le comportement par défaut de l'évènement (ouverture du fichier dans le navigateur).
  ev.preventDefault();
}

/**
 * Ouvre la fenêtre de sélection de fichier.
 */
$("#btn_import").click(function(e){
  $("#file_input").trigger('click');
});
