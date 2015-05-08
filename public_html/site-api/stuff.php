<?php
require 'lib.php';

$userid = 'false';
if(isset($_GET['userid'])) {
    $userid = $_GET['userid'];
} else {
    $userid = $_SESSION["userId"];
}

if($userid === 'false') {
    echo 'FALSE';
    die();
}

try {
	connectDatabase();
} catch(Exception $e){
	die(json_encode(array(array("status"=>"error","message"=>"Cannot connect to database"))));
}

$raw = getImagesForUser($userid);

$assets = getAssetList($raw);

echo json_encode($assets, JSON_PRETTY_PRINT);

/*

error_reporting(0);
$files = glob('../uploads/uploaded/' . $userid . '-*.*', GLOB_NOSORT);
$read_files = array();
for ($i = 0; $i < count($files); $i++) {
    if(substr($files[$i], -4) !== 'json') {
        array_push($read_files, json_decode(file_get_contents($files[$i] . '.json'), true));
    }
}

$files_sorted = array();
for($i = 0; $i < count($read_files); $i++) {
    $key = substr($read_files[$i]['name'], strlen($_GET['userid']) + 1, strrpos($read_files[$i]['name'], '.') - 2);
    //$key = $i + 1;
    $files_sorted[$key] = $read_files[$i];
}

krsort($files_sorted, SORT_NUMERIC);

echo json_encode($files_sorted, JSON_PRETTY_PRINT);*/

?>