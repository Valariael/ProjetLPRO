
// Manage the calendars.

var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var calendars = new Array();

// Format : calendars[calendar[title][compoAndPlace][arrayOfCategories][schedulesRecap][hoursRecap][dataRecap]]

var started = true;
/*-------------------------------- import/export --------------------------------------*/

function exportThis() {
  let select = document.getElementById("selectCal");
  exportCalendar(select.selectedIndex);
}

function exportCalendar(id) {
  let blob = JSON.stringify(calendars[id]);
  let filename = "export_"+calendars[id][0]; //replace spaces TODO!!
  let elem = window.document.createElement('a');
  elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(blob));
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
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

/*---------------------------------- drag n drop --------------------------------------*/

function dropHandler(ev) {
  console.log('File(s) dropped');

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
          alert("Calendrier importé.")
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

/*-------------------------------- personalization ------------------------------------*/

function displayPopup(start) {
  document.getElementById("erreur_form").style.display = "none";
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;
  let popup = document.getElementById("more_popup");
  let labelDates = document.getElementById("label_dates");
  let champAnnees = document.getElementById("champ_annees");
  if(start) {
    document.getElementById("titreInput").value = "";
    labelDates.style.display = "inherit";
    champAnnees.style.display = "block";
    champAnnees.value = "";
  } else {
    document.getElementById("titreInput").value = calendars[parseInt(select.options[choice].value, 10)][0];
    labelDates.style.display = "none";
    champAnnees.style.display = "none";
    champAnnees.value = calendars[parseInt(select.options[choice].value, 10)][6];
  }
  popup.style.display = "block";

  let list = document.getElementById("liste_vacances");
  list.innerHTML = "";
  if(start) {
    addVacancesItem();
  }
}

function validatePopup() { // TODO setter nbAnnees
  let nbAnnees = parseInt(document.getElementById("champ_annees").value, 10);
  let popup = document.getElementById("more_popup");
  let select = document.getElementById('selectCal');
  let choice = select.selectedIndex;
  if(isNaN(nbAnnees)) {
    editCalendarArray(parseInt(select.options[choice].value, 10), document.getElementById("titreInput").value, calendars[parseInt(select.options[choice].value, 10)][1], calendars[parseInt(select.options[choice].value, 10)][2], calendars[parseInt(select.options[choice].value, 10)][3], calendars[parseInt(select.options[choice].value, 10)][4], calendars[parseInt(select.options[choice].value, 10)][5], 1);
  } else {
    editCalendarArray(parseInt(select.options[choice].value, 10), document.getElementById("titreInput").value, calendars[parseInt(select.options[choice].value, 10)][1], calendars[parseInt(select.options[choice].value, 10)][2], calendars[parseInt(select.options[choice].value, 10)][3], calendars[parseInt(select.options[choice].value, 10)][4], calendars[parseInt(select.options[choice].value, 10)][5], nbAnnees);
  }

  if(started) {
    save();
    display(select.options[choice].value);
  } else {
    displayCalendar(currentYear, nbAnnees);
    started = true;
    save();
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
  // let dateDebut = document.getElementById("dateDebut").value;
  // let dateFin = document.getElementById("dateFin").value;
  //console.log(champAnnees);

  if(!started) {
    if(champAnnees == "" || !champAnnees.match(/(\d+)/)) errors.push("champ_annees");
    // if(dateDebut == "" || !dateDebut.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(dateDebut);
    // if(dateFin == "" || !dateFin.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(dateFin);
  }

  if(champTitre.value==null || champTitre.value=="") errors.push("titreInput");

  for (let vac of vacances) { //traiter cas premiere date inferieure a seconde TODO
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
    putVacances();
    validatePopup();
  }
}

function putVacances() {

  let vacances = document.querySelectorAll(".vacances");
  let nVac = 1;
  let debut, fin, anneeDebut, anneeFin;
  for(let v of vacances) { // TODO:improve
    debut = new Date($("#debutVac"+nVac).val());
    fin = new Date($("#finVac"+nVac).val());
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
  let monthTABLE = document.querySelectorAll("#calendar table tbody tr td table");
  let currentMonth, index = -1;
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
        console.log("lost month : " + currentMonth);
        break;
      }

      let days = monthTABLE[index].querySelectorAll("tbody tr");
      let cells = days[day].querySelectorAll("td");
      cells[2].className = "day vacanceCat";
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

    let select = document.getElementById('selectCal');

    // Add the option to the select.
    for (let i = 0; i < calendars.length; i++) {
      if(calendars[i] != null){
        let newOption = new Option (calendars[i][0], i);
        select.options.add(newOption);
      }else{
        continue;
      }
    }

    displayCalendar(currentYear, calendars[parseInt(select.options[select.options.length-1].value, 10)][6]);
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

  // Get the data schedules.
  let dataSchedules = createDataSchedules();

  // Get the hour schedules.
  let hourSchedules = createHourSchedules();

  // Get the week schedules.
  let weekSchedules = createWeekSchedules();

  // Edit the global table "calendars".
  editCalendarArray(parseInt(select.options[choice].value, 10), title, compoAndPlace, dataCategories, dataSchedules, hourSchedules, weekSchedules, calendars[parseInt(select.options[choice].value, 10)][6]);

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

  // Add the option to the global table "calendars".
  addCalendarToArray(title, 1);

  // Display the new calendar.
  displayCalendar(currentYear, 1);
  save(); // add displayAddedCalendar

  started = false;
  displayPopup(true);
}

function delCalendarBtn(){

  let select = document.getElementById('selectCal');
  let index = select.selectedIndex;

  // Delete the option of the global table "calendars".
  delCalendarOfArray(parseInt(select.options[index].value, 10));

  // Delete the option of the select.
  select.remove(index);

  // Display the precedent calendar (if it exist).
  if($("#selectCal option").length == 0 ){
    addCalendarBtn();
    save();
  }else{
    display(parseInt(select.options[0].value, 10));
    save();
  }
}

function saveCalendarBtn(){

  save();
}

/*-------------------------------- Calendars[] functions ------------------------------------*/

function addCalendarToArray(title, nAnnees) {
  let today = new Date(Date.now());

  calendars[calendars.length] = new Array(title, "", null, [0,0,0,0], ["0","0","0","0"], ["0","0","0","00 / 00 / 0000","0"]/*, today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(), today.getFullYear()+2 + "-" + today.getMonth() + "-" + today.getDate()*/,nAnnees);
}

function editCalendarArray(id, title, compoAndPlace, arrayOfCategories, schedulesRecap, hourSchedules, weekSchedules, nAnnees) {

  calendars[id] = new Array(title, compoAndPlace, arrayOfCategories, schedulesRecap, hourSchedules, weekSchedules, nAnnees);
}

function delCalendarOfArray(id) {
  //console.log(calendars[id], id);
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


function setDataCategories(dataCategories){

  $('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat ferieCat  projetTutEntrepriseCat vacanceCat libreCat');
  $('.day').each(function() {
    let element = dataCategories.shift();

    let date = ""; // prendre la date de debut du cal et incrementer chaque jour,
    // check que la date est dans les periodes de vacances
    switch (element) {
      case 0:$(this).addClass('coursCat');break;
      case 1:$(this).addClass('projetTutCoursCat');break;
      case 2:$(this).addClass('examenCat');break;
      case 3:$(this).addClass('entrepriseCat');break;
      case 4:$(this).addClass('projetTutEntrepriseCat');break;
      case 5:$(this).addClass('vacanceCat');break;
      case 6:$(this).addClass('ferieCat');break;
      default:$(this).addClass('libreCat');break;
    }
  });
}

/*-------------------------------- Schedules functions ------------------------------------*/

function schedulesEvent(event) {
  setDataSchedules(createDataSchedules(), createHourSchedules(), createWeekSchedules());
}

function createDataSchedules(){

  let ComptCours = 0;
  let ComptProjCours = 0;
  let ComptExam = 0;
  let ComptEntrep = 0;
  let ComptProjEntrep = 0;
  let ComptVac = 0;

  $('.day').each(function() {
    if($(this).hasClass('coursCat')){
      ComptCours++;
    }else if($(this).hasClass('projetTutCoursCat')){
      ComptProjCours++;
    }else if($(this).hasClass('examenCat')){
      ComptExam++;
    }else if($(this).hasClass('entrepriseCat')){
      ComptEntrep++;
    }else if($(this).hasClass('projetTutEntrepriseCat')){
      ComptProjEntrep++;
    }else if($(this).hasClass('vacanceCat')){
      ComptVac++;
    }
  });

  return dataSchedules = new Array(ComptCours, ComptProjCours, ComptExam, ComptEntrep+ComptProjEntrep, ComptVac);
}

function createHourSchedules(){

    let heureCours = document.getElementById('heureCours').value;
  let heureCoursProjet = document.getElementById('heureCoursProjet').value;
  let heureExamen = document.getElementById('heureExamen').value;
  let heureEntrepriseProjet = document.getElementById('heureEntrepriseProjet').value;
  let heureVacance = document.getElementById('heureVacance').value;

  return hourSchedules = new Array(heureCoursProjet, heureExamen, heureEntrepriseProjet, heureVacance);
}

function createWeekSchedules(){

  let semaineCours = document.getElementById('semaineCours').value;
  let semaineCoursProjet = document.getElementById('semaineCoursProjet').value;
  let semaineExamen = document.getElementById('semaineExamen').value;
  let semaineDate = document.getElementById('semaineDate').value;
  let semaineEntrepriseProjet = document.getElementById('semaineEntrepriseProjet').value;

  return hourSchedules = new Array(semaineCours, semaineCoursProjet, semaineExamen, semaineDate, semaineEntrepriseProjet);
}

function setDataSchedules(daySchedules, hourSchedules, weekSchedules){
  /*document.getElementById('journeeCoursProjet').value = daySchedules[0];
  document.getElementById('journeeExamen').value = daySchedules[1];
  document.getElementById('journeeEntrepriseProjet').value = daySchedules[2];
  document.getElementById('journeeVacance').value = daySchedules[3];*/ //unused

    document.getElementById('heureCours').value = hourSchedules[0];
  document.getElementById('heureCoursProjet').value = hourSchedules[0];
  document.getElementById('heureExamen').value = hourSchedules[1];
  document.getElementById('heureEntrepriseProjet').value = hourSchedules[2];
  document.getElementById('heureVacance').value = hourSchedules[3];

  document.getElementById('semaineCours').value = weekSchedules[0];
  document.getElementById('semaineCoursProjet').value = weekSchedules[1];
  document.getElementById('semaineExamen').value = weekSchedules[2];
  document.getElementById('semaineDate').value = weekSchedules[3];
  document.getElementById('semaineEntrepriseProjet').value = weekSchedules[4];

}

/*-------------------------------- Display functions ------------------------------------*/

// From the select
function displayData(event){
  let select = document.getElementById('selectCal');
  let index = event.target.selectedIndex;
  display(parseInt(select.options[index].value));
  schedulesEvent();
}

function display(value){
  console.log("display id : " + value);
  console.log("ici");
  let index = value;

  // The name
  $("#nomForm").val(calendars[index][0]);

  // The component and the place
  $("#compoAndPlace").val(calendars[index][1]);

  // The categories
  //$('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat ferieCat  projetTutEntrepriseCat vacanceCat libreCat');

  if(calendars[index][2] == null || calendars[index][2] == "" || calendars[index][2] == undefined){
    displayCalendar(currentYear, calendars[index][6]);
  }else{
    displayCalendar(currentYear, calendars[index][6]);
    // The table of categories is duplicated to avoid modifying the orginial table.
    let duplicatedCalendar1 = calendars[index][2].slice(0);
    setDataCategories(duplicatedCalendar1);
  }

  // The recap of schedules
  if(calendars[index][3] == null || calendars[index][4] == null || calendars[index][5] == null){
    // code here ..
  }else{
    setDataSchedules(calendars[index][3], calendars[index][4], calendars[index][5]);
  }
}
