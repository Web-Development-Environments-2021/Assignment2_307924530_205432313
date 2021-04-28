/*
<?php

	$dbhost = 'localhost';
	$dbuser = 'db_user_name';
	$dbpass = 'db_password';

	$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die ('Error connecting to mysql');

	$dbname = 'db_name';
	mysql_select_db($dbname);

	$width         = mysql_real_escape_string($_POST['width']);
	$height        = mysql_real_escape_string($_POST['height']);
	$screen_width  = mysql_real_escape_string($_POST['screen_width']);
	$screen_height = mysql_real_escape_string($_POST['screen_height']);

	$sql = "INSERT INTO data ( width,  height,  screen_width,  screen_height)
	      VALUES           ($width, $height, $screen_width, $screen_height)";

	if (!mysql_query($sql, $conn)) {
		die("Error:" . mysql_error());
	}

	echo "1 Record Added";

	mysql_close($conn);

?> */
