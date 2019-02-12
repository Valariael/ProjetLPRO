
// Manage the calendars.

var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var calendars = new Array();

// Format : calendars[calendar[title][compoAndPlace][arrayOfCategories][semainesRecap],nbAnnees, contratPro, anneeDebut]

var started = true;

String.prototype.visualLength = function()
{
  let ruler = document.getElementById("ruler");
  ruler.innerHTML = this;
  return ruler.offsetWidth;
}

function resizeInput(el) {
  let text = el.value;
  let len = text.visualLength();
  el.style.width = (len*2) + 'px';
}

function sortCalendars() {
  calendars.sort(function(a,b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0; //TODO peut etre utiliser localeCompare pour prendre en compte les accents ?
  });
}

function compareArrays(array1, array2) {
  // if the other array is a falsy value, return
  if (!array2)
    return false;

  // compare lengths - can save a lot of time
  if (array1.length != array2.length)
    return false;

  for (var i = 0; i < array1.length; i++) {
    // Check if we have nested arrays
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // recurse into the nested arrays
      if (!compareArrays(array1[i], array2[i]))
        return false;
    } else if (array1[i] != array2[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}

/*-------------------------------- import/export --------------------------------------*/

function exportThis() {
  let select = document.getElementById("selectCal");
  exportCalendar(select.selectedIndex);
}

function exportCalendar(id) {
  let blob = JSON.stringify(calendars[id]);
  let filename = "export_"+calendars[id][0];
  //On remplace tous les caractères interdits dans les noms de fichiers
  filename = filename.replace(/[`\s~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "_");
  let elem = window.document.createElement('a');
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(blob));
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function importFile() {
  let file = document.getElementById("file_input").files[0];
  if (file) {
    let r = new FileReader();
    r.onload = function(e) {
      let contents = e.target.result;
      importCalendar(contents);
    }
    r.readAsText(file);
    alert("Calendrier importé.");
  } else {
    alert("Échec de l'importation.");
  }
  document.getElementById("file_input").value = "";
}

function importCalendar(data) {
  let cal = JSON.parse(decodeURIComponent(data));
  calendars.push(cal);
  let index = calendars.indexOf(cal);

  // Set the id calendar
  idCalendar = calendars.length;

  // Add the option to the select.
  let select = document.getElementById('selectCal');
  let newOption = new Option (cal[0], index);
  select.options.add(newOption);

  // Switch to the new calendar
  $("#selectCal").val(index); // chanegr dates en années et creer les calendriers

  // Display the imported calendar.
  display(index);
  save();

  started = true;
}

function switchAdvancedMenu() {
  if($("#dropdownAdvanced").hasClass("show")) {
    $("#dropdownAdvanced").removeClass("show");
  } else {
    $("#dropdownAdvanced").addClass("show");
  }
}

$("#fullImportButton").click(function(e){
  e.preventDefault();
  $("#full_import_input").trigger('click');
});

function exportAll() {
  // Suppression des éventuels null apparut dans la liste des calendriers (BUGFIX)
  for (let i = calendars.length - 1; i >= 0; i--) {
    if(calendars[i] == null) {
      calendars.splice(i, 1);
    }
  }

  let date = new Date();
  let blob = JSON.stringify(calendars);
  let filename = "export_complet_" + date.toLocaleDateString('fr-FR');
  filename = filename.replace("/", "_");
  let elem = window.document.createElement('a');
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(blob));
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

function importFullFile() {
  let file = document.getElementById("full_import_input").files[0];
  if (file) {
    let r = new FileReader();
    r.onload = function(e) {
      let contents = e.target.result;
      if(confirm("Voulez-vous remplacer les calendriers existants ?\n(Cette opération est irréversible)")) {
        importAll(true, contents);
      } else {
        importAll(false, contents);
      }
    }
    r.readAsText(file);
  } else {
    alert("Échec de l'importation.");
  }
  document.getElementById("full_import_input").value = "";
}

function importAll(override, data) {
  let cal = JSON.parse(decodeURIComponent(data));
  let index;
  if(override) {
    index = 0;
    calendars = cal;
  } else {
    index = calendars.length;
    calendars = calendars.concat(cal);
  }

  let select = document.getElementById('selectCal');
  let newOption;
  for(let c of cal) {
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

function dropHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  let fr = new FileReader();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === 'file') {

        let file = ev.dataTransfer.items[i].getAsFile();
        if (file) {
          let r = new FileReader();
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
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      console.log("LOST datatransfer");
    }
  }
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

$("#btn_import").click(function(e){
  e.preventDefault();
  $("#file_input").trigger('click');
});

/*-------------------------------- personalization ------------------------------------*/

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

    document.getElementById("titreInput").value = "";
    champAnnees.value = "";
  } else {
    selectAnnee.style.display = "none";
    selectMois.style.display = "none";
    labelAnnee.style.display = "none";
    labelMois.style.display = "none";
    labelStart.style.display = "none";

    document.getElementById("titre_popup").innerHTML = "Paramètres";
    document.getElementById("titreInput").value = calendars[parseInt(select.options[choice].value, 10)][0];
    fermer.style.display = "inline-block";
    importer.style.display = "block";
    labelDates.style.display = "none";
    champAnnees.style.display = "none";
    contratPro.style.display = "none";
    champAnnees.value = calendars[parseInt(select.options[choice].value, 10)][4];
  }

  champHoraire.value = calendars[parseInt(select.options[choice].value, 10)][7];
  boutonAddVac.style.display = "";

  let list = document.getElementById("liste_vacances");
  list.innerHTML = "";
  if(start) {
    addVacancesItem();
  }

  popup.style.display = "block";
}

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
    calendars[parseInt(select.options[choice].value, 10)][6] = new Array(selectAnnee.options[selectAnnee.selectedIndex].value, selectMois.options[selectMois.selectedIndex].value);
  }

  if(isNaN(nbAnnees)) {
    calendars[parseInt(select.options[choice].value, 10)][0] = document.getElementById("titreInput").value;
    calendars[parseInt(select.options[choice].value, 10)][4] = 1;
    if(calendars[parseInt(select.options[choice].value, 10)][5] == null) {
      calendars[parseInt(select.options[choice].value, 10)][5] = contratPro;
    }
  } else {
    calendars[parseInt(select.options[choice].value, 10)][0] = document.getElementById("titreInput").value;
    calendars[parseInt(select.options[choice].value, 10)][4] = nbAnnees;
    if(calendars[parseInt(select.options[choice].value, 10)][5] == null) {
      calendars[parseInt(select.options[choice].value, 10)][5] = contratPro;
    }
  }

  if(document.getElementById("titreInput").value != document.getElementById("nomForm").value) document.getElementById("nomForm").value = document.getElementById("titreInput").value;

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

function closePopup() {
  let popup = document.getElementById("more_popup");
  popup.style.display = "none";
}

function addVacancesItem() {
  let list = document.getElementById("liste_vacances");
  let vacances = list.getElementsByClassName("vacances");
  let idVac;
  if(vacances.length == 0) {
    idVac = 0;
  } else {
    let inputs = vacances[vacances.length - 1].getElementsByTagName("input");
    let id = inputs[0].id;
    idVac = parseInt(id.substr(8,id.length), 10);
  }
  let li = document.createElement("li");
  li.className = "list-group-item vacances";
  li.innerHTML = "Du <input type=\"date\" id=\"debutVac" + (idVac+1) + "\" min=\"2018-01-01\" class=\"form-control dateInput\"/> au <input type=\"date\" id=\"finVac" + (idVac+1) + "\" min=\"2018-01-01\" class=\"form-control dateInput\"/>. <a class=\"btn btn-danger\" onclick=\"deleteVacancesItem('debutVac" + (idVac+1) + "');\">suppr</a>";/*TODO improve*/
  list.appendChild(li);
  if(list.children.length > 5) {
    let boutonAddVac = document.getElementById("btn_add_vacances");
    boutonAddVac.style.display = "none";
  }
}

function deleteVacancesItem(idItem) {
  document.getElementById(idItem).parentNode.remove();
}

function validateForm() {
  let list = document.getElementById("liste_vacances");
  let vacances = list.getElementsByClassName("vacances");
  let errors = [];
  let id;
  let finVac = "", debutVac = "";
  let champAnnees = document.getElementById("champ_annees").value;
  let champTitre = document.getElementById("titreInput");
  let radios = document.getElementsByName("contratInput");

  if(!started) {
    let divContrat = "contrat_pro";
    for(let r of radios) {
      if(r.checked) divContrat = null;
    }
    if(divContrat != null) errors.push(divContrat);
    else document.getElementById("contrat_pro").style.backgroundColor = "inherit";
    if(champAnnees == "" || !champAnnees.match(/(\d+)/)) errors.push("champ_annees");
  }

  if(champTitre.value==null || champTitre.value=="") errors.push("titreInput");

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

  let inputs = document.querySelectorAll(".vacances input");
  for (let input of inputs) {
    document.getElementById(input.id).style.backgroundColor = "inherit";
  }

  document.getElementById("erreur_form").style.display = "none";
  if(errors.length > 0){
    document.getElementById("erreur_form").style.display = "block";
    for (let error of errors) {
      console.log(error);
      document.getElementById(error).style.backgroundColor = "#ffcccc";
    }
  } else {
    validatePopup();
    putVacances();
  }
}

function putVacances() {

  let vacances = document.querySelectorAll(".vacances");
  let nVac = 1;
  let debut, fin, anneeDebut, anneeFin;
  for(let v of vacances) { // TODO:improve
    debut = new Date($("#debutVac"+nVac).val());
    fin = new Date($("#finVac"+nVac).val());
    if(debut > fin) {
      let tmp = fin;
      fin = debut;
      debut = temp;
    }
    nVac++;

    anneeDebut = debut.getFullYear();
    anneeFin = fin.getFullYear();
    let anneesVacances = [];
    for(let i=anneeDebut; i<=anneeFin; i++) anneesVacances.push(i);

    let calendar = document.getElementById("calendar");
    let tables = calendar.childNodes;
    let yearsTH, years = [];
    yearsTH = document.querySelectorAll("#calendar table thead th");

    for(let y of yearsTH) {
      let o = {
        y: parseInt(y.innerHTML, 10),
        n: parseInt(y.colSpan, 10)
      };
      years.push(o);
    }

    let yBool = false;
    for(let y of years) {
      if(anneesVacances.includes(y.y)) yBool = true;
    }
    if(!yBool) return;

    for(let d = debut; debut<=fin; d.setDate(d.getDate()+1)) {
      addVacancesColor(years, d.getDate(), d.getMonth()+1, d.getFullYear());
    }
  }
}

function addVacancesColor(years, day, month, year) {
  let monthTABLE = document.querySelectorAll("#calendar table tbody tr td table:not(.recap)");
  let currentMonth, index = -1;
  for(let y of years) {
    for(let i=0; i<y.n; i++) {
      index++;
      if(y.y != year) continue;
      console.log(monthTABLE[index]);
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
        console.log("lost month : " + currentMonth);
        break;
      }

      let days = monthTABLE[index].querySelectorAll("tbody tr");
      let cells = days[day].querySelectorAll("td");
      cells[2].className = "day vacanceCat";
      cells[3].className = "day vacanceCat";
    }
  }
}

/*-------------------------------- initialization ------------------------------------*/

$( document ).ready(function() {

  let data = window.localStorage.getItem("calendars");
  if(data == null  || data == undefined || data == "" || data.length < 2 || data == "null"){
    addCalendarBtn();
  }else{
    console.log(data);
    calendars = JSON.parse(data);

    // Suppression des éventuels null apparut dans la liste des calendriers (BUGFIX)
    for (let i = calendars.length - 1; i >= 0; i--) {
      if(calendars[i] == null) {
        calendars.splice(i, 1);
      }
    }

    sortCalendars();

    let select = document.getElementById('selectCal');

    // Add the options to the select.
    for (let i = 0; i < calendars.length; i++) {
      if(calendars[i] != null){
        let newOption = new Option (calendars[i][0], i);
        select.options.add(newOption);
      }else{
        continue;
      }
    }

    displayCalendar(calendars[parseInt(select.options[select.options.length-1].value, 10)][4], calendars[parseInt(select.options[select.options.length-1].value, 10)][6][0], calendars[parseInt(select.options[select.options.length-1].value, 10)][6][1]);
    // refresh the display

    select.selectedIndex = select.options.length-1;
    let choice = select.selectedIndex;
    display(select.options[choice].value);

  }
});

/*-------------------------------- Saves ------------------------------------*/

$('#selectCal').click(function() {
  started = true;
  save();
});

function save(){
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;
  console.log(calendars);
  // Get the name.
  let title = document.getElementById('nomForm').value;

  // Get the component and the place.
  let compoAndPlace = document.getElementById('compoAndPlace').value;

  // Create the data categories.
  let dataCategories = createDataCategories();

  // Edit the global table "calendars".
  editCalendarArray(parseInt(select.options[choice].value, 10), title, compoAndPlace, dataCategories, new Array(
    document.getElementById("semaineCours").value,
    document.getElementById("semaineCoursProjet").value,
    document.getElementById("semaineExamen").value,
    document.getElementById("semaineDate").value,
    document.getElementById("semaineEntreprise").value,
    document.getElementById("semaineEntrepriseProjet").value
  ), calendars[parseInt(select.options[choice].value, 10)][4], calendars[parseInt(select.options[choice].value, 10)][5], calendars[parseInt(select.options[choice].value, 10)][6], parseFloat(document.getElementById("horaireDemiJournee").value));

  // change select.
  select.children[select.selectedIndex].innerHTML = title;

  window.localStorage.removeItem('calendars');
  window.localStorage.setItem("calendars",JSON.stringify(calendars));

}

/*-------------------------------- Buttons functions -----------------------------------*/

function addCalendarBtn() {

  let title = "Calendrier vierge " + currentYear;
  document.getElementById("nomForm").value = title;
  // Set the id calendar
  idCalendar = calendars.length;

  // Add the option to the select.
  let select = document.getElementById('selectCal');
  let newOption = new Option (title, idCalendar);
  select.options.add(newOption);

  // Switch to the new calendar
  $("#selectCal").val(idCalendar); // chanegr dates en années et creer les calendriers

  // Add the new calendar to the global table "calendars".
  addCalendarToArray(title);

  // Display the new calendar.
  displayCalendar(1, currentYear, 1);

  updateResume();
  document.getElementById("semaineCours").value = "0";
  document.getElementById("semaineCoursProjet").value = "0";
  document.getElementById("semaineExamen").value = "0";
  document.getElementById("semaineDate").value = "";
  document.getElementById("semaineEntrepriseProjet").value = "0";
  document.getElementById("semaineEntreprise").value = "0";

  save(); // add displayAddedCalendar

  started = false;
  displayPopup(true);
}

function delCalendarBtn(){

  let select = document.getElementById('selectCal');
  let index = select.selectedIndex;
  let valueToDelete = parseInt(select.options[index].value, 10);

  // Delete the option of the global table "calendars".
  delCalendarOfArray(valueToDelete);

  // Delete the option of the select.
  select.remove(index);
  for(let o of select.options) {
    if(o.value > valueToDelete) o.value = parseInt(o.value)-1;
  }

  // Display the precedent calendar (if it exist).
  if($("#selectCal option").length == 0 ){
    addCalendarBtn();
    save();
  }else{
    display(parseInt(select.options[0].value, 10));
    save();
  }
  select.selectedIndex = 0;
}

function saveCalendarBtn(){
  save();
  let select = document.getElementById("selectCal");

  let currentCal = calendars[select.selectedIndex];

  sortCalendars();
  // Add the option to the select.
  select.innerHTML = "";
  for (let i = 0; i < calendars.length; i++) {
    if(calendars[i] != null){//TODO remove condition ?
      let newOption = new Option (calendars[i][0], i);
      select.options.add(newOption);
    }else{
      continue;
    }
  }

  for(let i=0; i<calendars.length; i++) {
    if(compareArrays(currentCal, calendars[i])){
      select.selectedIndex = i;
      return;
    }
  }
  console.log("lost comparing arrays");
}

/*-------------------------------- Calendars[] functions ------------------------------------*/

function addCalendarToArray(title) {
  let today = new Date(Date.now());

  calendars[calendars.length] = new Array(title, "", null, ["0","0","0","00 / 00 / 0000","0", "0"], 1, null, new Array(today.getFullYear(),1), 3.5);
}

function editCalendarArray(id, title, compoAndPlace, arrayOfCategories, infosSemaines, nAnnees, contratPro, starts, horaireDemiJournee) {

  calendars[id] = new Array(title, compoAndPlace, arrayOfCategories, infosSemaines, nAnnees, contratPro, starts, horaireDemiJournee);
}

function delCalendarOfArray(id) {
  calendars.splice(id, 1);
}

/*-------------------------------- Categories functions  ------------------------------------*/

function createDataCategories(){

  let dataCategories = new Array();
  let codeCat;

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

function updateResume() {
  let select = document.getElementById("selectCal");
  let index = select.selectedIndex;
  save();
  setDataCategories(calendars[parseInt(select.options[index].value)][2].slice(0));
}

function setDataCategories(dataCategories){
  $("#heureCours").val('0');
  $("#heureCoursProjet").val('0');
  $("#heureExamen").val('0');
  $("#heureEntreprise").val('0');
  $("#heureEntrepriseProjet").val('0');
  $("#heureVacance").val('0');
  let nCours = 0, nCoursP = 0, nExamen = 0, nEts = 0, nEtsP = 0, nVac = 0;

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

  let select = document.getElementById("selectCal");
  let choice = select.selectedIndex;

  $('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat ferieCat  projetTutEntrepriseCat vacanceCat libreCat');
  $('.day').each(function() {
    let element = dataCategories.shift();
//TODO replace long lines
    switch (element) {
      case 0: $(this).addClass('coursCat');
      $(this).closest('table').next('table').find('.recapCours').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapCours').html())+calendars[choice][7]) * 10) / 10));
      nCours += calendars[choice][7];
      break;
      case 1: $(this).addClass('projetTutCoursCat');
      $(this).closest('table').next('table').find('.recapProjetTutUniv').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapProjetTutUniv').html())+calendars[choice][7]) * 10) / 10));
      nCoursP += calendars[choice][7];
      break;
      case 2: $(this).addClass('examenCat');
      nExamen += calendars[choice][7];
      break;
      case 3: $(this).addClass('entrepriseCat');
      $(this).closest('table').next('table').find('.recapEntreprise').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapEntreprise').html())+calendars[choice][7]) * 10) / 10));
      nEts += calendars[choice][7];
      break;
      case 4: $(this).addClass('projetTutEntrepriseCat');
      $(this).closest('table').next('table').find('.recapProjetTutEts').html(""+(Math.round((parseFloat($(this).closest('table').next('table').find('.recapProjetTutEts').html())+calendars[choice][7]) * 10) / 10));
      nEtsP += calendars[choice][7];
      break;
      case 5:$(this).addClass('vacanceCat');
      nVac += calendars[choice][7];
      break;
      case 6:$(this).addClass('ferieCat');break;
      default:$(this).addClass('libreCat');break;
    }
  });

  $("#heureCours").val(Math.round(nCours * 10) / 10);
  $("#heureCoursProjet").val(Math.round(nCoursP * 10) / 10);
  $("#heureExamen").val(Math.round(nExamen * 10) / 10);
  $("#heureEntreprise").val(Math.round(nEts * 10) / 10);
  $("#heureEntrepriseProjet").val(Math.round(nEtsP * 10) / 10);
  $("#heureVacance").val(Math.round(nVac * 10) / 10);

  $("#semaineCours").val(calendars[choice][3][0]); //TODO calcul auto semaines
  $("#semaineCoursProjet").val(calendars[choice][3][1]);
  $("#semaineExamen").val(calendars[choice][3][2]);
  $("#semaineDate").val(calendars[choice][3][3]);
  $("#semaineEntreprise").val(calendars[choice][3][4]);
  $("#semaineEntrepriseProjet").val(calendars[choice][3][5]);
}

/*-------------------------------- Display functions ------------------------------------*/

// From the select
function displayData(){
  let select = document.getElementById('selectCal');
  let index = select.selectedIndex;
  display(parseInt(select.options[index].value));
}

function display(value){
  console.log("display id : " + value);

  // The name
  $("#nomForm").val(calendars[value][0]);
  resizeInput(document.getElementById("nomForm"));

  // The component and the place
  $("#compoAndPlace").val(calendars[value][1]);
  resizeInput(document.getElementById("compoAndPlace"));

  if(calendars[value][2] == null || calendars[value][2] == "" || calendars[value][2] == undefined){
    displayCalendar(calendars[value][4], calendars[value][6][0], calendars[value][6][1]);
  }else{
    displayCalendar(calendars[value][4], calendars[value][6][0], calendars[value][6][1]);
    // The table of categories is duplicated to avoid modifying the orginial table.
    let duplicatedCalendar1 = calendars[value][2].slice(0);
    setDataCategories(duplicatedCalendar1);
  }

  let infosPro = document.getElementsByClassName("contrat_pro_info");
  for(let i of infosPro) {
    if(calendars[value][5]) {
      i.style.display = "block";
    } else {
      i.style.display = "none";
    }
  }

}
