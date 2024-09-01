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

$sector = $_GET['sector'];

$sql = "SELECT id, name, polls FROM candidates WHERE sector = ? ORDER BY polls DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $sector);
$stmt->execute();
$result = $stmt->get_result();

$candidates = array();

while($row = $result->fetch_assoc()) {
    $candidates[] = $row;
}

if(empty($candidates)) {
    echo json_encode(["error" => "No candidates found"]);
} else {
    echo json_encode($candidates);
}

$stmt->close();
$conn->close();
?>
