<?php
	require "../../assets/includes/connect.php";  //Connect - includes session_start();
	$username = 'bob';
?>
<!DOCTYPE html>
<html>
<head>
	<!--Imports the metadata and information that will go in the <head> of every page-->
	<?php echo file_get_contents('../../Header.html'); ?>
	
	<!--Imports styling-->
	<link href='../../main-style.css' rel='stylesheet' type='text/css'>
	<link href='../user_style.css' rel='stylesheet' type='text/css'>
</head>
<body>
	<!--Imports navigation bar-->
	<?php include "../../navbar.php"; ?>
	
	<!-- Main wrapper -->
	<div class="container main">
		<div class="main-inner">
			Hello and welcome to "bob".
			<?php
				echo $main;
			?>
		</div>
	</div>
	
	<!-- footer -->
	<?php echo file_get_contents('../../footer.html'); ?>
</body>
</html>
