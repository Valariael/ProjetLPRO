
// Manage the catégories.

/*-------------------------------- Detect MouseDown ------------------------------------*/

var down = false;
$(document).mousedown(function() {
    down = true;

		 if(document.getElementById('selectid').value == "1") { colorClass = "coursCat"}
	else if(document.getElementById('selectid').value == "2") { colorClass = "projetTutCoursCat"}
	else if(document.getElementById('selectid').value == "3") { colorClass = "examenCat "}
	else if(document.getElementById('selectid').value == "4") { colorClass = "entrepriseCat"}
	else if(document.getElementById('selectid').value == "5") { colorClass = "projetTutEntrepriseCat"}
	else if(document.getElementById('selectid').value == "6") { colorClass = "vacanceCat"}
	else if(document.getElementById('selectid').value == "7") { colorClass = "ferieCat"}
	else{ colorClass = "libreCat"}

}).mouseup(function() {
    down = false;
});

/*----------------------------------- Fill Categories ----------------------------*/

function fillCat (element){ //TODO define jquery function to replace the long lines
  let select = document.getElementById("selectCal");
  let choice = select.selectedIndex;
  if($(element).hasClass("ferieCat") && colorClass == "libreCat") {
      if($(element).siblings("td.day").hasClass("coursCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapCours').html(""+(Math.round((parseFloat($(element).siblings("td.day").closest('table').next('table').find('.recapCours').html())-calendars[choice][7]) * 10) / 10));
      } else if($(element).siblings("td.day").hasClass("projetTutCoursCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutUniv').html(""+(Math.round((parseFloat($(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutUniv').html())-calendars[choice][7]) * 10) / 10));
      } else if($(element).siblings("td.day").hasClass("projetTutEntrepriseCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutEts').html(""+(Math.round((parseFloat($(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutEts').html())-calendars[choice][7]) * 10) / 10));
      } else if($(element).siblings("td.day").hasClass("entrepriseCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapEntreprise').html(""+(Math.round((parseFloat($(element).siblings("td.day").closest('table').next('table').find('.recapEntreprise').html())-calendars[choice][7]) * 10) / 10));
      }
      $(element).siblings("td.day").removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
      $(element).siblings("td.day").addClass(colorClass);
  }
  if($(element).hasClass("coursCat")) {
    $(element).closest('table').next('table').find('.recapCours').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapCours').html())-calendars[choice][7]) * 10) / 10));
  } else if($(element).hasClass("projetTutCoursCat")) {
    $(element).closest('table').next('table').find('.recapProjetTutUniv').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapProjetTutUniv').html())-calendars[choice][7]) * 10) / 10));
  } else if($(element).hasClass("projetTutEntrepriseCat")) {
    $(element).closest('table').next('table').find('.recapProjetTutEts').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapProjetTutEts').html())-calendars[choice][7]) * 10) / 10));
  } else if($(element).hasClass("entrepriseCat")) {
    $(element).closest('table').next('table').find('.recapEntreprise').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapEntreprise').html())-calendars[choice][7]) * 10) / 10));
  }
	$(element).removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
  if(colorClass == "ferieCat") {
    $(element).siblings("td.day").removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
    $(element).siblings("td.day").addClass(colorClass);
  }

  if(colorClass == "coursCat") {
    $(element).closest('table').next('table').find('.recapCours').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapCours').html())+calendars[choice][7]) * 10) / 10));
  } else if(colorClass == "projetTutCoursCat") {
    $(element).closest('table').next('table').find('.recapProjetTutUniv').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapProjetTutUniv').html())+calendars[choice][7]) * 10) / 10));
  } else if(colorClass == "projetTutEntrepriseCat") {
    $(element).closest('table').next('table').find('.recapProjetTutEts').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapProjetTutEts').html())+calendars[choice][7]) * 10) / 10));
  } else if(colorClass == "entrepriseCat") {
    $(element).closest('table').next('table').find('.recapEntreprise').html(""+(Math.round((parseFloat($(element).closest('table').next('table').find('.recapEntreprise').html())+calendars[choice][7]) * 10) / 10));
  }
  $(element).addClass(colorClass);
}

function eventCategories(){

	$('.day').click(function() {
		fillCat(this);
 	});

	$('.day').hover(function() {
    	if( (down && colorClass == "libreCat") || (down && $(this).hasClass("libreCat") ) ){
    		fillCat(this);
    	}
	});
}
