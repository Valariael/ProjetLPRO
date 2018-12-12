<!DOCTYPE html>

<?php

require_once 'php/config.php';
require_once $phpcas_path . '/CAS.php';
phpCAS::setDebug();
phpCAS::setVerbose(true);
phpCAS::client(CAS_VERSION_2_0, $cas_host, $cas_port, $cas_context);
phpCAS::setNoCasServerValidation();
phpCAS::forceAuthentication();
$user = phpCAS::getUser(); // contient username cas ex: alederma
if (isset($_REQUEST['logout'])) {
	phpCAS::logout();
}

?>

<html lang="fr">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

	<title>Calendriers FC</title>
	<link rel="shortcut icon" href="content/favicon.ico" type="image/x-icon">

	<!-- ***** STYLESHEETS ***** -->

	<link rel="stylesheet" type="text/css" href="css/bootstrap-select.min.css">
	<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">

	<link rel="stylesheet" type="text/css" href="css/normalize.css"/>
	<link rel="stylesheet" type="text/css" href="css/style.css" title="style" />

</head>
<body>
	<header>
		<div class="row">
			<div class="outils">
				<div class="col-sm-4 col-xs-12 categories">
					<label class="text-nowrap lblCat"> Sélectionner, créer ou supprimer un calendrier</label>
					<div class="CalendarParam">
						<div class="styled-select">
							<select id="selectCal" onchange="displayData(event)"></select>
						</div>
						<a onclick="addCalendarBtn();" ><img src="content/file.png" alt="Ajouter" id="addCal" class="btnCal" title="Ajouter le calendrier"></a> &nbsp;
						<a href="javascript:saveCalendarBtn()" ><img src="content/save.png" alt="Sauvegarder"  id="saveCal" class="btnCal" title="Enregistrer le calendrier"></a>
						<a href="javascript:delCalendarBtn()" ><img src="content/dustbin.png" alt="Supprimer"  id="delCal" class="btnCal" title="Supprimer le calendrier"></a>
					</div>
				</div>
				<div class="col-sm-3 col-xs-12 categories">
					<label class="text-nowrap lblCat"> Sélectionner une catégorie</label>
					<select id="selectid" class="selectpicker">
						<option class="c1" value="1" id="1">Cours</option>
						<option class="c2" value="2" id="2">Projet tut. Université</option>
						<option class="c3" value="3" id="3">Examen</option>
						<option class="c4" value="4" id="4">Entreprise</option>
						<option class="c5" value="5" id="5">Projet tut. Entreprise</option>
						<option class="c6" value="6" id="6">Vacances</option>
						<option class="c7" value="7" id="7">Férié</option>
						<option class="c8" value="8" id="8">Libre</option>
					</select>
				</div>
				<div class="col-sm-1 col-xs-12 categories">
					<a class="btn btn-info btn-lg btnCategorie btnPlus" onclick="displayPopup();"><span class="plus-lg">+</span></a>
				</div>
				<div class="col-sm-2 col-xs-12 categories">
					<label class="text-nowrap lblCat"> Génération du calendrier en PDF</label>
					<div id="editor"></div>
					<a class="btn btn-danger btn-lg btnCategorie" href="javascript:genPDF()" >PDF</a>
				</div>
				<div class="col-sm-1 col-xs-12 categories">
					<label class="lblCat"> Résumé</label>
					<a class="btn btn-info btn-lg btnCategorie" href="#calculPart"><img class="arrow-down" src="content/warrow_down.png"/></a>
				</div>
				<div class="col-sm-1 col-xs-12 categories">
					<a href="?logout=" class="btn btn-primary btnCategorie btnDeconnexion" >Déconnexion</a>
				</div>
			</div>
		</div>
	</header>

	<main>
		<div class="container-fluid">
			<div id="cal">
				<div class="row">
					<div class="nomCalendrier">
						<div class="col-xs-2 col-sm-offset-1">
							<img src="content/logo_ufrst.png" alt="Logo UFC" class="imgUFC">
						</div>
						<div class="col-sm-4 col-sm-offset-1">
							<center>
								<h2 id="mainTitle"> Calendrier prévisionnel</h2>
								<input type="text" id="nomForm" class="nomFormation" placeholder="Nom de la formation" size="40" value="" />
								<input type="text" id="compoAndPlace" class="nomFormation" placeholder="Composante et lieu de formation" size="40" />
							</center>
						</div>
					</div>
				</div>
				<div class="row">
					<h4 class="MsgPrecaution" > Attention: Ce calendrier est prévisionnel, les dates sont susceptibles de varier.</h4>
				</div>
				<div class="row">
					<div class="col-sm-12 col-xs-12">
						<div id="calendar"></div>
					</div>
				</div>
				<div class="row" >
					<div id="calculPart">
						<div class=" col-sm-10 col-sm-offset-1">
							<table class="resume">
								<tr>
									<td class="tdLabel"><label>Catégories</label></td>
									<td class="tdLabel"><label>Nombre d'heures totales</label></td>
									<td class="tdDesc"></td>
								</tr>
								<tr>
									<td class="tdLabel c1"><label>Cours<br>+<br>Projets tutorés</label></td>
									<td class="tdInput"><input type="text" id="heureCoursProjet" size="3" value="0"/></td>
									<td class="tdDesc"><p>Cours répartis sur <input type="text" id="semaineCours" size="3" value="0"/> semaines.</p><p>Projets tutorés répartis sur <input type="text" id="semaineCoursProjet" size="3" value="0"/> semaines.</p></td>
								</tr>
								<tr>
									<td class="tdLabel c3"><label>Examen </label></td>
									<td class="tdInput"><input type="text" id="heureExamen" size="3" value="0"/></td>
									<td class="tdDesc"><p>Contrôle continu de formation et/ou examens ponctuels répartis sur <input type="text" id="semaineExamen" size="3" value="0"/> semaines.</p><p>La soutenance de validation de l'UE "Stage" aura lieu le <input type="text" id="semaineDate" size="15" value="00 / 00 / 0000"/> ou selon la date de fin du contrat.</p></td>
								</tr>
								<tr>
									<td class="tdLabel c4"><label>Entreprise<br>+<br>Projets tutorés</label></td>
									<td class="tdInput"><input type="text" id="heureEntrepriseProjet" size="3" value="0"/></td>
									<td class="tdDesc"><p><strong> Si contrat de professionnalisation</strong>: le contrat de travail peut démarrer au plus tôt 2 mois avant le début de la formation et prendre fin au plus tard 2 mois après le dernier jour en centre (cours ou examen).</p><p>Projet tutorés répartis sur <input type="text" id="semaineEntrepriseProjet" size="3" value="0"/> semaines.</p></td>
								</tr>
								<tr>
									<td class="tdLabel c6"><label>Vacances universitaires</label></td>
									<td class="tdInput"><input type="text" id="heureVacance" size="3" value="0"/></td>
									<td class="tdDesc"><p>Les salariés en <strong>contrat de professionnalisation </strong> sont en entreprise ou en congés payés durant ces périodes (à définir avec l'employeur).</p></td>
								</tr>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="connect_popup" class="container-fluid" style="display: none;">
				<span class="to_center"></span>
				<div>
					<div id="fermer_popup" onclick="displayPopup();">X</div>
					<div class="row">
						<div class="col">
							<h4 class="text-nowrap">Quelques informations avant de commencer :</h4>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<label id="label_vacances" class="text-nowrap">Périodes de vacances : </label>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<ul class="list-group" id="liste_vacances">
							  <li class="list-group-item vacances">Du <input type="date" id="debutVac0" min="2018-01-01" class="form-control dateInput"/> au <input type="date" id="finVac0" min="2018-01-01" class="form-control dateInput"/>. <a class="btn btn-danger" onclick="deleteVacancesItem('debutVac0');">suppr</a></li>
							</ul>
							<a id="btn_add_vacances" class="btn btn-info" onclick="addVacancesItem();">Ajouter une période</a>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<a id="btn_form_valid" class="btn btn-success" onclick="validateForm();">Valider</a>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<p id="erreur_form" class="text-nowrap" style="display: none;">Champ manquant.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>

	<footer>
		<div class="row " >
			<div class="col-sm-6 col-sm-offset-3 adresse">
				<h3>Université de Franche-Comté - Service Formation Continue</h3><br>
				<p>Maison des étudiants - 36 A avenue de l’Observatoire - 25030 BESANCON Cedex </p>
				<p> Tél: 03 81 66 61 21 - Fax: 03 81 66 61 02 </p>
				<a href="mailto:formation-continue@univ-fcomte.fr">formation-continue@univ-fcomte.fr</a> - <a href="http://formation-continue.univ-fcomte.fr">http://formation-continue.univ-fcomte.fr</a>
			</div>
		</div>
	</footer>

	<!-- ***** SCRIPS ***** -->

	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/bootstrap-select.min.js"></script>
	<script src="js/jspdf.min.js" ></script>
	<script src="js/html2canvas.js" ></script>
	<script src="js/bootstrap.min.js" ></script>

	<script src="js/calendars.js"></script>
	<script src="js/scroll.js"></script>
	<script src="js/gridCalendar.js"></script>
	<script src="js/categories.js"></script>
	<script src="js/pdf.js"></script> <!-- rename file ? jquery ? -->
</body>
</html>
