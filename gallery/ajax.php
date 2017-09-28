<?php
echo json_encode(array_slice (json_decode (file_get_contents("files.json")), $_GET['start'], 4));
?>