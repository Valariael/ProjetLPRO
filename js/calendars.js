
// Manage the calendars.

let currentDate = new Date();
var currentYear = currentDate.getFullYear();
var calendars = new Array();

// Format des données stockées : calendars[title, complement, compoAndPlace, [arrayOfCategories], [semainesRecap], nbAnnees, contratPro, [anneeDebut, moisDebut], tauxHoraire]

var started = true;

/*-------------------------------- utilitaires --------------------------------------*/

/**
 * Extension de la classe String.
 *
 * Renvoie la longueur réelle d'une chaine de caractères dans un input text.
 */
String.prototype.visualLength = function()
{
  let ruler = document.getElementById("ruler");

  // On écrit la chaine de caractères dans un input non formatté.
  ruler.innerHTML = this;
  // Puis on récupère sa largeur réelle avec l'attribut offsetWidth.
  return ruler.offsetWidth;
}

/**
 * Adapte la taille de l'input text <el> à son contenu.
 * Nécessite une taille max en CSS.
 */
function resizeInput(el) {
  let text = el.value;
  let len = text.visualLength();
  el.style.width = (len*2) + 'px';
}

/**
 * Classe les calendriers dans le tableau 'calendars' en ordre alphabétique suivant leur titre.
 */
function sortCalendars() {
  // La fonction sort d'Array accepte un paramètre qui est une redéfinition de la fonction de rangement.
  calendars.sort(function(a,b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0; //TODO peut etre utiliser localeCompare pour prendre en compte les accents ?
  }); // TODO comparer suivant complement aussi
}

/**
 * Compare les tableaux <array1> et <array2>.
 *
 * Renvoie vrai si identiques, faux sinon.
 */
function compareArrays(array1, array2) {
  // D'abord on vérifie que le second tableau ne soit pas faux.
  if (!array2)
  return false;

  // On compare les tailles avant de continuer.
  if (array1.length != array2.length)
  return false;

  for (var i = 0; i < array1.length; i++) {
    // S'il y a des tableaux imbriqués, on fait du récursif.
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      if (!compareArrays(array1[i], array2[i]))
      return false;
    // Sinon on compare les objets.
    } else if (array1[i] != array2[i]) {
      return false;
    }
  }
  return true;
}

/*-------------------------------- initialization ------------------------------------*/

/**
 * Initialise l'application.
 */
$( document ).ready(function() {
  // Récupération des données stockées dans le cache de type localStorage.
  let data = window.localStorage.getItem("calendars");
  // S'il n'y a pas de données, on ajoute un nouveau calendrier.
  if(data == null  || data == undefined || data == "" || data.length < 2 || data == "null"){
    addCalendarBtn();
  }else{
    // Sinon on converti la chaine de caractères stockées au format JSON en tableau de calendriers.
    calendars = JSON.parse(data);

    // Suppression des éventuels null apparut dans la liste des calendriers (BUGFIX)
    for (let i = calendars.length - 1; i >= 0; i--) {
      if(calendars[i] == null) {
        calendars.splice(i, 1);
      }
    }

    // On classe les calendriers avant toute modification.
    sortCalendars();

    let select = document.getElementById('selectCal');
    // Ajoute les options correspondantes au select.
    for (let i = 0; i < calendars.length; i++) {
      let newOption = new Option (calendars[i][0], i);
      select.options.add(newOption);
    }

    // Affichage du calendrier.
    select.selectedIndex = select.options.length-1;
    let choice = select.selectedIndex;
    display(select.options[choice].value);

  }
});

/*-------------------------------- Saves ------------------------------------*/

/**
 * Sauvegarde le calendrier avant d'en changer.
 */
$('#selectCal').click(function() {
  started = true;
  save();
});

/**
 * Sauvegarde tous les changements du calendrier courant.
 */
function save(){
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;

  // Récupération des composants du titre.
  let title = document.getElementById('nomForm').value;
  let compoAndPlace = document.getElementById('compoAndPlace').value;
  let complement = document.getElementById("compForm").value;

  // Création du tableau de données représentant les cellules.
  let dataCategories = createDataCategories();

  // Vérification du champ date dans le résumé pour éviter NPE si 'à définir'.
  let dateInput = document.getElementById("semaineDate");
  let date;
  if(dateInput == null) date = null;
  else date = dateInput.value;

  // Réécriture du tableau représentant le calendrier.
  editCalendarArray(parseInt(select.options[choice].value, 10), title, complement, compoAndPlace, dataCategories, new Array(
    document.getElementById("semaineCours").value,
    document.getElementById("semaineCoursProjet").value,
    document.getElementById("semaineExamen").value,
    date,
    document.getElementById("semaineEntreprise").value,
    document.getElementById("semaineEntrepriseProjet").value
  ), calendars[parseInt(select.options[choice].value, 10)][5], calendars[parseInt(select.options[choice].value, 10)][6], calendars[parseInt(select.options[choice].value, 10)][7], parseFloat(document.getElementById("horaireDemiJournee").value));

  // Mise à jour de l'option correspondante dans le select.
  select.children[select.selectedIndex].innerHTML = title;

  // On enlève l'item correspondant aux données des calendriers avant de l'écrire pour assurer la consistence des données.
  window.localStorage.removeItem('calendars');
  // L'écriture se fait sous forme de chaine de caractères au format JSON.
  window.localStorage.setItem("calendars",JSON.stringify(calendars));

}

/*-------------------------------- Buttons functions -----------------------------------*/

/**
 * Déclenche l'ajout d'un nouveau calendrier et l'affiche.
 * Affiche le popup en mode ajout.
 */
function addCalendarBtn() {
  // Réinitialisation des valeurs et de la taille des champs de titre.
  let title = "Calendrier vierge " + currentYear;
  document.getElementById("nomForm").value = title;
  resizeInput(document.getElementById("nomForm"));
  document.getElementById("compForm").value = "";
  resizeInput(document.getElementById("compForm"));
  document.getElementById("compoAndPlace").value = "";
  resizeInput(document.getElementById("compoAndPlace"));
  let idCalendar = calendars.length;

  // Ajout de la nouvelle option au select.
  let select = document.getElementById('selectCal');
  let newOption = new Option (title, idCalendar);
  select.options.add(newOption);

  // On sélectionne l'option dernièrement ajoutée.
  $("#selectCal").val(idCalendar);

  // Ajout du calendrier au tableau de données.
  addCalendarToArray(title);

  // Affichage du calendrier vierge par défaut.
  displayCalendar(1, currentYear, 1);

  // Réinitialisation du récapitulatif.
  updateResume();
  document.getElementById("semaineCours").value = "0";
  document.getElementById("semaineCoursProjet").value = "0";
  document.getElementById("semaineExamen").value = "0";
  let dateInput = document.getElementById("semaineDate");
  if(dateInput != null) dateInput.value = "";
  document.getElementById("semaineEntrepriseProjet").value = "0";
  document.getElementById("semaineEntreprise").value = "0";

  save();
  started = false;
  displayPopup(true);
}

/**
 * Déclenche la suppression du calendrier courant.
 */
function delCalendarBtn(){
  // Récupération de l'index du calendrier à supprimer.
  let select = document.getElementById('selectCal');
  let index = select.selectedIndex;
  let valueToDelete = parseInt(select.options[index].value, 10);

  // Suppresion du calendrier dans les données stockées.
  delCalendarOfArray(valueToDelete);

  // Suppression de l'option correspondante dans le select.
  select.remove(index);
  for(let o of select.options) {
    if(o.value > valueToDelete) o.value = parseInt(o.value)-1;
  }

  // Sauvegarde des changements et affichage du premier calendrier ou ajout automatique s'il n'y a plus de calendrier.
  if($("#selectCal option").length == 0 ){
    addCalendarBtn();
    save();
  }else{
    display(parseInt(select.options[0].value, 10));
    save();
  }
  select.selectedIndex = 0;
}

/**
 * Déclenche la sauvegarde du calendrier courant.
 */
function saveCalendarBtn(){
  // Écrasement des données sauvegardées.
  save();

  let select = document.getElementById("selectCal");
  let currentCal = calendars[select.selectedIndex];

  // Rangement des calendriers par ordre alphabétique.
  sortCalendars();

  // Rafraichissement des valeurs liant les options du select aux calendriers.
  select.innerHTML = "";
  for (let i = 0; i < calendars.length; i++) {
    if(calendars[i] != null){ // bugfix null pas forcément nécessaire
      let newOption = new Option (calendars[i][0], i);
      select.options.add(newOption);
    }else{
      continue;
    }
  }

  // Comme l'ordre des options a changé il faut rechercher celle qui correspond au calendrier courant et la resélectionner.
  for(let i=0; i<calendars.length; i++) {
    if(compareArrays(currentCal, calendars[i])){
      select.selectedIndex = i;
      return;
    }
  }
  console.log("lost comparing arrays");
}

/*-------------------------------- Calendars[] functions ------------------------------------*/

/**
 * Ajoute un nouveau calendrier avec des valeurs par défaut et comme titre <title>.
 */
function addCalendarToArray(title) {
  let today = new Date(Date.now());

  // Ajout d'un tableau de calendrier avec des valeurs par défaut.
  calendars[calendars.length] = new Array(title, "", "", null, ["0","0","0","00 / 00 / 0000","0", "0"], 1, null, new Array(today.getFullYear(),1), 3.5);
}

/**
 * Remplace les valeurs du calendrier à l'index <id> avec les valeurs correspondantes.
 */
function editCalendarArray(id, title, complement, compoAndPlace, arrayOfCategories, infosSemaines, nAnnees, contratPro, starts, horaireDemiJournee) {

  calendars[id] = new Array(title, complement, compoAndPlace, arrayOfCategories, infosSemaines, nAnnees, contratPro, starts, horaireDemiJournee);
}

/**
 * Supprime le calendrier à l'index <id>.
 */
function delCalendarOfArray(id) {
  calendars.splice(id, 1);
}

/*-------------------------------- Categories/Résumé functions  ------------------------------------*/

/**
 * Crée et retourne le tableau des données des cases du calendrier.
 */
function createDataCategories(){
  let dataCategories = new Array();
  let codeCat;

  // Pour chaque cellule du calendrier on récupère une valeur correspondant à sa couleur.
  $('.day').each(function() {
    if($(this).hasClass('coursCat')){
      codeCat = 0;
    }else if($(this).hasClass('projetTutCoursCat')){
      codeCat = 1;
    }else if($(this).hasClass('examenCat')){
      codeCat = 2;
    }else if($(this).hasClass('entrepriseCat')){
      codeCat = 3;
    }else if($(this).hasClass('projetTutEntrepriseCat')){
      codeCat = 4;
    }else if($(this).hasClass('vacanceCat')){
      codeCat = 5;
    }else if($(this).hasClass('ferieCat')){
      codeCat = 6;
    }else{
      codeCat = 7;
    }

    dataCategories.push(codeCat);
  });

  return dataCategories;
}

/**
 * Met à jour le résumé en utilisant 'setDataCategories'.
 */
function updateResume() {
  let select = document.getElementById("selectCal");
  let index = select.selectedIndex;
  save();

  setDataCategories(calendars[parseInt(select.options[index].value)][3].slice(0));
}

/**
 * Modifie le bouton de changement de la date d'examen.
 * Change la date d'examen en 'à définir' et inversement.
 */
function toggleDateExamen() {
  let btnDateExamen = document.getElementById("btnDateExamen");
  let labelDateExamen = document.querySelector("#btnDateExamen label");
  let dateExamenContainer = document.getElementById("dateExamenContainer");

  if(labelDateExamen.classList.contains("dateADefinir")) {
    labelDateExamen.innerHTML = "Date examen<br>à définir";
    labelDateExamen.style.color = "";
    btnDateExamen.style.backgroundColor = "";

    dateExamenContainer.innerHTML = "<input type=\"date\" id=\"semaineDate\" size=\"15\" title=\"Date au format jj/mm/aaaa.\"/>";

    labelDateExamen.classList.remove("dateADefinir");
  } else {
    labelDateExamen.innerHTML = "Date examen<br>connue";
    labelDateExamen.style.color = "black";
    btnDateExamen.style.backgroundColor = "#d9d9d9";

    dateExamenContainer.innerHTML = "'à définir'";

    labelDateExamen.classList.add("dateADefinir");
  }
}

/**
 * Utilise les données du tableau <dataCategories> pour colorer le calendrier.
 * Totalise les heures pour chaque catégorie et remplis le récapitulatif.
 * Remplis également les valeurs des nombres de semaines.
 */
function setDataCategories(dataCategories){
  // Réinitialisation des valeurs des totaux d'heures.
  $("#heureCours").val('0');
  $("#heureCoursProjet").val('0');
  $("#heureExamen").val('0');
  $("#heureEntreprise").val('0');
  $("#heureEntrepriseProjet").val('0');
  $("#heureVacance").val('0');
  for(let r of document.getElementsByClassName("recapCours")) {
    r.innerHTML = "0";
  }
  for(let r of document.getElementsByClassName("recapProjetTutUniv")) {
    r.innerHTML = "0";
  }
  for(let r of document.getElementsByClassName("recapEntreprise")) {
    r.innerHTML = "0";
  }
  for(let r of document.getElementsByClassName("recapProjetTutEts")) {
    r.innerHTML = "0";
  }

  let nCours = 0, nCoursP = 0, nExamen = 0, nEts = 0, nEtsP = 0, nVac = 0;
  let select = document.getElementById("selectCal");
  let choice = select.selectedIndex;

  $('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat ferieCat  projetTutEntrepriseCat vacanceCat libreCat');
  $('.day').each(function() {
    let element = dataCategories.shift();
    //TODO replace long lines
    switch (element) {
      case 0: $(this).addClass('coursCat');
      $(this).closest('table').next('table').find('.recapCours').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapCours').html())+calendars[choice][8]) * 10) / 10));
      nCours += calendars[choice][8];
      break;
      case 1: $(this).addClass('projetTutCoursCat');
      $(this).closest('table').next('table').find('.recapProjetTutUniv').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapProjetTutUniv').html())+calendars[choice][8]) * 10) / 10));
      nCoursP += calendars[choice][8];
      break;
      case 2: $(this).addClass('examenCat');
      nExamen += calendars[choice][8];
      break;
      case 3: $(this).addClass('entrepriseCat');
      $(this).closest('table').next('table').find('.recapEntreprise').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapEntreprise').html())+calendars[choice][8]) * 10) / 10));
      nEts += calendars[choice][8];
      break;
      case 4: $(this).addClass('projetTutEntrepriseCat');
      $(this).closest('table').next('table').find('.recapProjetTutEts').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapProjetTutEts').html())+calendars[choice][8]) * 10) / 10));
      nEtsP += calendars[choice][8];
      break;
      case 5:$(this).addClass('vacanceCat');
      nVac += calendars[choice][8];
      break;
      case 6:$(this).addClass('ferieCat');break;
      default:$(this).addClass('libreCat');break;
    }
  });

  // Arrondi au premier chiffre après la virgule.
  $("#heureCours").val(Math.round(nCours * 10) / 10);
  $("#heureCoursProjet").val(Math.round(nCoursP * 10) / 10);
  $("#heureExamen").val(Math.round(nExamen * 10) / 10);
  $("#heureEntreprise").val(Math.round(nEts * 10) / 10);
  $("#heureEntrepriseProjet").val(Math.round(nEtsP * 10) / 10);
  $("#heureVacance").val(Math.round(nVac * 10) / 10);

  $("#semaineCours").val(calendars[choice][4][0]); //TODO calcul auto semaines
  $("#semaineCoursProjet").val(calendars[choice][4][1]);
  $("#semaineExamen").val(calendars[choice][4][2]);
  let dateInput = document.getElementById("semaineDate");
  if(dateInput != null) dateInput.value = calendars[choice][4][3];
  $("#semaineEntreprise").val(calendars[choice][4][4]);
  $("#semaineEntrepriseProjet").val(calendars[choice][4][5]);
}

/*-------------------------------- Display functions ------------------------------------*/

/**
 * Lance l'affichage du calendrier sélectionné.
 */
function displayData(){
  let select = document.getElementById('selectCal');
  let index = select.selectedIndex;

  display(parseInt(select.options[index].value));
}

/**
 * Affiche le calendrier d'index <id>.
 */
function display(value){
  // Affichage des valeurs déjà stockées.
  $("#nomForm").val(calendars[value][0]);
  resizeInput(document.getElementById("nomForm"));
  $("#compForm").val(calendars[value][1]);
  resizeInput(document.getElementById("compForm"));
  $("#compoAndPlace").val(calendars[value][2]);
  resizeInput(document.getElementById("compoAndPlace"));

  // Affichage du calendrier vierge correspondant
  if(calendars[value][3] == null || calendars[value][3] == "" || calendars[value][3] == undefined){
    displayCalendar(calendars[value][5], calendars[value][7][0], calendars[value][7][1]);
  }else{
    displayCalendar(calendars[value][5], calendars[value][7][0], calendars[value][7][1]);
    // Remplissage des cellules.
    let duplicatedCalendar1 = calendars[value][3].slice(0);
    setDataCategories(duplicatedCalendar1);
  }

  // Mise à jour de l'affichage des éléments propres au contrat pro.
  let infosPro = document.getElementsByClassName("contrat_pro_info");
  for(let i of infosPro) {
    if(calendars[value][6]) {
      i.style.display = "block";
    } else {
      i.style.display = "none";
    }
  }

}
