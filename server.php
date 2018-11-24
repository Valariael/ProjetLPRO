<?php

	if(isset($_POST["request"])){
	    $request = $_POST["request"];

	    if($request == 'get'){
	    	$backup = file_get_contents('data.txt');
	    	print json_encode($backup);
	    	die();
	    }else{
	    	$ret = file_put_contents('data.txt', $request);
	    	die();
	    }
	}
	die();
?>