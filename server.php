<?php

header('Content-Type: application/json');

try {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "my";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception('Database connection error: ' . $conn->connect_error);
    }

    $name = $_POST['name'] ?? null;
    $surname = $_POST['surname'] ?? null;
    $surname2 = $_POST['surname2'] ?? null;
    $date_of_birth = $_POST['date'] ?? null;
    $email = $_POST['email'] ?? null;
    $status = $_POST['status'] ?? null;
    $about = $_POST['about'] ?? null;
    $accepted_rules = isset($_POST['check']) ? 1 : 0;

    // Объединение телефонов и кодов стран в одну строку
    $phones = [];
    if (isset($_POST['phone']) && isset($_POST['countryCode'])) {
        foreach ($_POST['phone'] as $index => $phone) {
            $countryCode = $_POST['countryCode'][$index];
            $phones[] = $countryCode . ' ' . $phone;
        }
    }
    $phoneString = implode(", ", $phones);  // Пример: +375 123456, +7 987654

    if (!$name || !$surname || !$email || !$phoneString) {
        throw new Exception('Required fields are missing.');
    }

    $sql = "INSERT INTO users (name, surname, surname2, date_of_birth, email, status, about, phone, accepted_rules) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception('Query preparation error: ' . $conn->error);
    }

    $stmt->bind_param("ssssssssi", $name, $surname, $surname2, $date_of_birth, $email, $status, $about, $phoneString, $accepted_rules);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Data insertion error: ' . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
