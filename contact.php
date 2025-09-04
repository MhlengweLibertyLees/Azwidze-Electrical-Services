<?php
// Basic contact handler. For production, consider SMTP via PHPMailer.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Method Not Allowed');
}

function clean($v) {
  $v = trim($v ?? '');
  return filter_var($v, FILTER_UNSAFE_RAW, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);
}

$honeypot = $_POST['company'] ?? '';
if (!empty($honeypot)) {
  http_response_code(200);
  exit('OK');
}

$name = clean($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$phone = clean($_POST['phone'] ?? '');
$service = clean($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');

if (!$name || !$email || !$phone || !$service || !$message) {
  http_response_code(400);
  exit('Missing required fields.');
}

$to = 'info@azwidze.co.za';
$subject = "New quote request - $service";
$body = "Name: $name\nEmail: $email\nPhone: $phone\nService: $service\n\nMessage:\n$message\n\n---\nSource: Azwidze Electrical website";
$headers = "From: Azwidze Website <no-reply@azwidze.co.za>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = function_exists('mail') ? @mail($to, $subject, $body, $headers) : false;

if ($sent) {
  echo 'Thanks! Your request has been sent.';
} else {
  http_response_code(500);
  echo 'Could not send email. Please try again or WhatsApp us.';
}
