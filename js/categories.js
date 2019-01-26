
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

function fillCat (element){
  if($(element).hasClass("ferieCat") && colorClass == "libreCat") {
      if($(element).siblings("td.day").hasClass("coursCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapCours').html(""+(parseInt($(element).siblings("td.day").closest('table').next('table').find('.recapCours').html())-4));
      } else if($(element).siblings("td.day").hasClass("projetTutCoursCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutUniv').html(""+(parseInt($(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutUniv').html())-4));
      } else if($(element).siblings("td.day").hasClass("projetTutEntrepriseCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutEts').html(""+(parseInt($(element).siblings("td.day").closest('table').next('table').find('.recapProjetTutEts').html())-4));
      } else if($(element).siblings("td.day").hasClass("entrepriseCat")) {
        $(element).siblings("td.day").closest('table').next('table').find('.recapEntreprise').html(""+(parseInt($(element).siblings("td.day").closest('table').next('table').find('.recapEntreprise').html())-4));
      }
      $(element).siblings("td.day").removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
      $(element).siblings("td.day").addClass(colorClass);
  }
  if($(element).hasClass("coursCat")) {
    $(element).closest('table').next('table').find('.recapCours').html(""+(parseInt($(element).closest('table').next('table').find('.recapCours').html())-4));
  } else if($(element).hasClass("projetTutCoursCat")) {
    $(element).closest('table').next('table').find('.recapProjetTutUniv').html(""+(parseInt($(element).closest('table').next('table').find('.recapProjetTutUniv').html())-4));
  } else if($(element).hasClass("projetTutEntrepriseCat")) {
    $(element).closest('table').next('table').find('.recapProjetTutEts').html(""+(parseInt($(element).closest('table').next('table').find('.recapProjetTutEts').html())-4));
  } else if($(element).hasClass("entrepriseCat")) {
    $(element).closest('table').next('table').find('.recapEntreprise').html(""+(parseInt($(element).closest('table').next('table').find('.recapEntreprise').html())-4));
  }
	$(element).removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
  if(colorClass == "ferieCat") {
    $(element).siblings("td.day").removeClass('coursCat projetTutCoursCat examenCat entrepriseCat projetTutEntrepriseCat vacanceCat ferieCat libreCat');
    $(element).siblings("td.day").addClass(colorClass);
  }

  if(colorClass == "coursCat") {
    $(element).closest('table').next('table').find('.recapCours').html(""+(parseInt($(element).closest('table').next('table').find('.recapCours').html())+4));
  } else if(colorClass == "projetTutCoursCat") {
    $(element).closest('table').next('table').find('.recapProjetTutUniv').html(""+(parseInt($(element).closest('table').next('table').find('.recapProjetTutUniv').html())+4));
  } else if(colorClass == "projetTutEntrepriseCat") {
    $(element).closest('table').next('table').find('.recapProjetTutEts').html(""+(parseInt($(element).closest('table').next('table').find('.recapProjetTutEts').html())+4));
  } else if(colorClass == "entrepriseCat") {
    $(element).closest('table').next('table').find('.recapEntreprise').html(""+(parseInt($(element).closest('table').next('table').find('.recapEntreprise').html())+4));
  }
  $(element).addClass(colorClass);
}

function eventCategories(){

	$('.day').click(function() {
		fillCat(this);
		//schedulesEvent();
 	});

	$('.day').hover(function() {
    	if( (down && colorClass == "libreCat") || (down && $(this).hasClass("libreCat") ) ){
    		fillCat(this);
    	}
    	//schedulesEvent();
	});
}
