<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "church_polling";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sector = $_POST['sector'];
$votes = explode(',', $_POST['votes']);

// Prepare the update query
$sql = "UPDATE candidates SET polls = polls + 1 WHERE sector = ? AND id IN (" . implode(',', array_fill(0, count($votes), '?')) . ")";
$stmt = $conn->prepare($sql);
$params = array_merge([$sector], $votes);
$stmt->bind_param(str_repeat('i', count($params)), ...$params);
$stmt->execute();

$stmt->close();
$conn->close();
?>
