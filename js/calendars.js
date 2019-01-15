
// Manage the calendars.

var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var calendars = new Array();

// Format : calendars[calendar[title][compoAndPlace][arrayOfCategories][schedulesRecap][hoursRecap][dataRecap]]

var started = true;

/*-------------------------------- personalization ------------------------------------*/

function displayPopup() {
  document.getElementById("erreur_form").style.display = "none";
  let popup = document.getElementById("more_popup");
  if(popup.style.display == "none") {
    popup.style.display = "block";
  } else {
    popup.style.display = "none";
  }

  let labelDates = document.getElementById("label_dates");
  let champsDate = document.getElementsByClassName("champ_date");
  labelDates.style.display = "none";
  champsDate[0].style.display = "none";
  champsDate[1].style.display = "none";
  if(!started) {
    labelDates.style.display = "inherit";
    champsDate[0].style.display = "block";
    champsDate[1].style.display = "block";
    started = true;
  }

  let list = document.getElementById("liste_vacances");
  list.innerHTML = "";
  addVacancesItem();
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
    idVac = parseInt(id.substr(8,id.length));
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
  let dateDebut = document.getElementById("dateDebut").value;
  let dateFin = document.getElementById("dateFin").value;
  console.log(dateDebut);

  if(!started) {
    if(dateDebut == "" || !dateDebut.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(dateDebut);
    if(dateFin == "" || !dateFin.match(/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/)) errors.push(dateFin);
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
    displayPopup();
  }
}

function putVacances() {

  let vacances = document.querySelectorAll(".vacances");
  let nVac = 1;
  let debut, fin, anneeDebut, anneeFin;
  for(let v of vacances) { // TODO:improve
    debut = new Date($("#debutVac"+nVac).val());
    console.log(debut);
    fin = new Date($("#finVac"+nVac).val());
    console.log(fin);
    nVac++;

    anneeDebut = debut.getFullYear();
    anneeFin = fin.getFullYear();
    let anneesVacances = [];
    for(let i=anneeDebut; i<=anneeFin; i++) anneesVacances.push(i);

    let calendar = document.getElementById("calendar");
    let tables = calendar.childNodes;
    console.log(tables);
    let yearsTH, years = [];
    yearsTH = document.querySelectorAll("#calendar table thead th");
    console.log(yearsTH);

    for(let y of yearsTH) {
      let o = {
        y: parseInt(y.innerHTML, 10),
        n: parseInt(y.colSpan, 10)
      };
      years.push(o);
    }
    console.log("years :" + years);
    for(let y of yearsTH) {
      console.log(y);
    }

    let yBool = false;
    for(let y of years) {
      if(anneesVacances.includes(y.y)) yBool = true;
    }
    if(!yBool) return;

    for(let d = debut; debut<=fin; d.setDate(d.getDate()+1)) {
      console.log(d);
      addVacancesColor(years, d.getDate(), d.getMonth()+1, d.getFullYear());
    }
  }
}

function addVacancesColor(years, day, month, year) {
  let monthTABLE = document.querySelectorAll("#calendar table tbody tr td table");
  console.log(monthTABLE);
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
      console.log("day : " + day + " days[day] : ");
      console.log(days[day]);
      let cells = days[day].querySelectorAll("td");
      console.log(cells);
      cells[2].className = "day vacanceCat";
    }
  }
}

/*-------------------------------- initialization ------------------------------------*/

$( document ).ready(function() {

  displayCalendar(currentYear);
  var select = document.getElementById('selectCal');
  var index = select.selectedIndex;

  let data = window.localStorage.getItem("calendars");
  if(data == null){
    addCalendarBtn();
  }else{
    console.log(data);
    calendars = JSON.parse(data);
    /*
    var select = document.getElementById('selectCal');
    data = data.substring(1, data.length-1);
    data = data.replace(/\\/g,"");
    var edit = " " + data + " ";

    // Get the server data
    var obj = JSON.parse(edit.substring(1, edit.length-1));
    calendars = obj;*/

    // Add the option to the select.
    for (var i = 0; i < calendars.length; i++) {
      if(calendars[i] != null){
        var newOption = new Option (calendars[i][0], i);
        select.options.add(newOption);
      }else{
        continue;
      }
    }

    // refresh the display
    var choice = select.selectedIndex;
    display(select.options[choice].value);

  }
});

/*-------------------------------- Saves ------------------------------------*/

$('#selectCal').click(function() {
  started = true;
  save();
});

function save(){

  var select = document.getElementById('selectCal');
  var choice = select.selectedIndex;

  // Get the name.
  var title = document.getElementById('nomForm').value;

  // Get the component and the place.
  var compoAndPlace = document.getElementById('compoAndPlace').value;

  // Create the data categories.
  var dataCategories = createDataCategories();

  // Get the data schedules.
  var dataSchedules = createDataSchedules();

  // Get the hour schedules.
  var hourSchedules = createHourSchedules();

  // Get the week schedules.
  var weekSchedules = createWeekSchedules();

  // Edit the global table "calendars".
  editCalendarArray(parseInt(select.options[choice].value), title, compoAndPlace, dataCategories, dataSchedules, hourSchedules, weekSchedules);

  // change select.
  select.children[select.selectedIndex].innerHTML = title;

  window.localStorage.removeItem('calendars');
  window.localStorage.setItem("calendars",JSON.stringify(calendars));

}

/*-------------------------------- Buttons functions ------------------------------------*/

function addCalendarBtn() {

  var title = "Calendrier vierge " + currentYear;

  // Set the id calendar
  idCalendar = calendars.length;

  // Add the option to the select.
  var select = document.getElementById('selectCal');
  var newOption = new Option (title, idCalendar);
  select.options.add(newOption);

  // Switch to the new calendar
  $("#selectCal").val(idCalendar); // chanegr dates en années et creer les calendriers

  // Add the option to the global table "calendars".
  addCalendarToArray(title);
  calendars[calendars.length-1][2];

  // Display the new calendar.
  displayCalendar(currentYear);
  save(); // add displayAddedCalendar

  started = false;
  displayPopup();
}

function delCalendarBtn(){

  var select = document.getElementById('selectCal');
  var index = select.selectedIndex;

  // Delete the option of the global table "calendars".
  delCalendarOfArray(parseInt(select.options[index].value));

  // Delete the option of the select.
  select.remove(index);

  // Display the precedent calendar (if it exist).
  if($("#selectCal option").size() == 0 ){
    addCalendarBtn();
  }else{
    display(parseInt(select.options[0].value));
    save();
  }
}

function saveCalendarBtn(){

  save();
}

/*-------------------------------- Calendars[] functions ------------------------------------*/

function addCalendarToArray(title) {
  let today = new Date(Date.now());

  calendars[calendars.length] = new Array(title, "", null, [0,0,0,0], ["0","0","0","0"], ["0","0","0","00 / 00 / 0000","0"], today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(), today.getFullYear()+2 + "-" + today.getMonth() + "-" + today.getDate());
}

function editCalendarArray(id, title, compoAndPlace, arrayOfCategories, schedulesRecap, hourSchedules, weekSchedules) {

  calendars[id] = new Array(title, compoAndPlace, arrayOfCategories, schedulesRecap, hourSchedules, weekSchedules);
}

function delCalendarOfArray(id) {
  //console.log(calendars[id], id);
  calendars[id] = null;
}

/*-------------------------------- Categories functions  ------------------------------------*/

function createDataCategories(){

  var dataCategories = new Array();
  var codeCat;

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

  $('.day').each(function() {

    var element = dataCategories.shift();

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

  var ComptCours = 0;
  var ComptProjCours = 0;
  var ComptExam = 0;
  var ComptEntrep = 0;
  var ComptProjEntrep = 0;
  var ComptVac = 0;

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

  return dataSchedules = new Array(ComptCours+ComptProjCours, ComptExam, ComptEntrep+ComptProjEntrep, ComptVac);
}

function createHourSchedules(){

  var heureCoursProjet = document.getElementById('heureCoursProjet').value;
  var heureExamen = document.getElementById('heureExamen').value;
  var heureEntrepriseProjet = document.getElementById('heureEntrepriseProjet').value;
  var heureVacance = document.getElementById('heureVacance').value;

  return hourSchedules = new Array(heureCoursProjet, heureExamen, heureEntrepriseProjet, heureVacance);
}

function createWeekSchedules(){

  var semaineCours = document.getElementById('semaineCours').value;
  var semaineCoursProjet = document.getElementById('semaineCoursProjet').value;
  var semaineExamen = document.getElementById('semaineExamen').value;
  var semaineDate = document.getElementById('semaineDate').value;
  var semaineEntrepriseProjet = document.getElementById('semaineEntrepriseProjet').value;

  return hourSchedules = new Array(semaineCours, semaineCoursProjet, semaineExamen, semaineDate, semaineEntrepriseProjet);
}

function setDataSchedules(daySchedules, hourSchedules, weekSchedules){
  /*document.getElementById('journeeCoursProjet').value = daySchedules[0];
  document.getElementById('journeeExamen').value = daySchedules[1];
  document.getElementById('journeeEntrepriseProjet').value = daySchedules[2];
  document.getElementById('journeeVacance').value = daySchedules[3];*/ //unused

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
  var select = document.getElementById('selectCal');
  var index = event.target.selectedIndex;
  display(parseInt(select.options[index].value));
  schedulesEvent();
}

function display(value, hollidays){
  console.log("display id : " + value);


  var index = value;
  console.log("calendars " + calendars);

  // The name
  $("#nomForm").val(calendars[index][0]);

  // The component and the place
  $("#compoAndPlace").val(calendars[index][1]);

  // The categories
  $('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat ferieCat  projetTutEntrepriseCat vacanceCat libreCat');

  if(calendars[index][2] == null || calendars[index][2] == "" || calendars[index][2] == undefined){
    $('.day').addClass('libreCat');
  }else{
    // The table of categories is duplicated to avoid modifying the orginial table.
    var duplicatedCalendar1 = calendars[index][2].slice(0);
    setDataCategories(duplicatedCalendar1);
  }

  // The recap of schedules
  if(calendars[index][3] == null || calendars[index][4] == null || calendars[index][5] == null){
    // code here ..
  }else{
    setDataSchedules(calendars[index][3], calendars[index][4], calendars[index][5]);
  }
}
