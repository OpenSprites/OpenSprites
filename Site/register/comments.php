<?php
require '../assets/includes/connect.php';

$project_comments = file_get_html('http://scratch.mit.edu/site-api/comments/project/47606468/');
$comments = $project_comments -> find('.comment .info');
$is_good_reg = false;
foreach ($comments as $comment) {
	$creator = $comment -> find('name .a');
	$content = $comment -> find('.content');
	if ($creator == $logged_in_user && $content == $_GET['key']) {
		$is_good_reg = true;
		break;
	}
}

print_r($is_good_reg);

?>