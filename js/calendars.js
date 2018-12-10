
// Manage the calendars.

var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var calendars = new Array();

// Format : calendars[calendar[title][compoAndPlace][arrayOfCategories][schedulesRecap][hoursRecap][dataRecap]]

/*-------------------------------- initialization ------------------------------------*/

$( document ).ready(function() {

	displayCalendar(currentYear);

	var select = document.getElementById('selectCal');
	var index = select.selectedIndex;

	$.ajax({
        url: 'server.php',
        type: 'POST',
        data: function(){
            var data = new FormData();
            data.append('request', 'get');
            return data;
        }(),
        success: function (data) {

        	if(data == "\"\""){
        		addCalendarBtn();
        	}else{
        		var select = document.getElementById('selectCal');
	        	data = data.substring(1, data.length-1);
	        	data = data.replace(/\\/g,"");
	        	var edit = " " + data + " ";

	        	// Get the server data
	        	var obj = JSON.parse(edit.substring(1, edit.length-1));
	        	calendars = obj;

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
        },
        error: function (data) {
            console.log(data);
        },
        complete: function () {

        },
        cache: false,
        contentType: false,
        processData: false
    })

});

/*-------------------------------- Saves ------------------------------------*/

$('#selectCal').click(function() {
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

	$.ajax({
        url: 'server.php',
        type: 'POST',
        data: function(){
            var data = new FormData();
            data.append('request', JSON.stringify(calendars));
            return data;
        }(),
        success: function () {

        },
        error: function (data) {
            console.log(data);
        },
        complete: function () {

        },
        cache: false,
        contentType: false,
        processData: false
    });

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
    $("#selectCal").val(idCalendar);

    // Add the option to the global table "calendars".
    addCalendarToArray(title);

    // Display the new calendar.
    display(idCalendar);
    save();

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

	calendars[calendars.length] = new Array(title, "", null, [0,0,0,0], ["0","0","0","0"], ["0","0","0","00 / 00 / 0000","0"]);
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
		}else{
			codeCat = 6;
		}

		dataCategories.push(codeCat);
  	});

  	return dataCategories;
}


function setDataCategories(dataCategories){

	$('.day').each(function() {

		var element = dataCategories.shift();

		switch (element) {
			case 0:$(this).addClass('coursCat');break;
			case 1:$(this).addClass('projetTutCoursCat');break;
			case 2:$(this).addClass('examenCat');break;
			case 3:$(this).addClass('entrepriseCat');break;
			case 4:$(this).addClass('projetTutEntrepriseCat');break;
			case 5:$(this).addClass('vacanceCat');break;
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
	document.getElementById('demiJourneeCoursProjet').value = daySchedules[0];
	document.getElementById('demiJourneeExamen').value = daySchedules[1];
	document.getElementById('demiJourneeEntrepriseProjet').value = daySchedules[2];
	document.getElementById('demiJourneeVacance').value = daySchedules[3];

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

function display(value){

	var index = value;
	//console.log(calendars);

	// The name
	$("#nomForm").val(calendars[index][0]);

	// The component and the place
	$("#compoAndPlace").val(calendars[index][1]);

	// The categories
	$('.day').removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat libreCat');

	if(calendars[index][2] == null){
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
