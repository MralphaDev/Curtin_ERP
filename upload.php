<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header('Content-Type: application/json');

// upload dir
$uploadDir = '../images/';
$baseUrl = 'https://gsvi.cc/images/';

// validate file
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
$tmpName = $file['tmp_name'];
$originalName = basename($file['name']);

$allowedExtensions = ['jpg','jpeg','png','gif','webp'];
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions)) {
    echo json_encode(['error' => 'Invalid file type']);
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $tmpName);
finfo_close($finfo);

$allowedMimes = ['image/jpeg','image/png','image/gif','image/webp'];

if (!in_array($mime, $allowedMimes)) {
    echo json_encode(['error' => 'Invalid MIME']);
    exit;
}

if (getimagesize($tmpName) === false) {
    echo json_encode(['error' => 'Not image']);
    exit;
}

// safe name
$safeName = preg_replace("/[^A-Za-z0-9_\-\.]/", '', str_replace(' ', '_', $originalName));
$targetPath = $uploadDir . $safeName;

// ensure folder
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// move file
if (move_uploaded_file($tmpName, $targetPath)) {
    echo json_encode([
        'url' => $baseUrl . $safeName
    ]);
} else {
    echo json_encode(['error' => 'Upload failed']);
}