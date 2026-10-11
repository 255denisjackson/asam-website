<?php
// Asam Technologies - form to email handler (no database)
// Upload next to index.html. Needs PHP mail() enabled (standard on cPanel hosting).

$TO   = 'info@asamtechn.com';      // <-- where messages are delivered
$FROM = 'noreply@asamtechn.com';   // <-- must be an address on YOUR domain
$SITE = 'Asam Technologies Website';

header('Content-Type: application/json; charset=utf-8');

function out($ok, $msg) { echo json_encode(['ok' => $ok, 'message' => $msg]); exit; }
function clean($v) { return trim(strip_tags((string)$v)); }
function noCRLF($v) { return str_replace(["\r", "\n", "%0a", "%0d"], ' ', $v); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Invalid request.');
if (!empty($_POST['website'])) out(true, 'Thank you!'); // honeypot: bots fill this

$type    = clean($_POST['form_type'] ?? 'contact');
$name    = noCRLF(clean($_POST['name'] ?? ''));
$email   = noCRLF(clean($_POST['email'] ?? ''));
$phone   = noCRLF(clean($_POST['phone'] ?? ''));
$service = noCRLF(clean($_POST['service'] ?? ''));
$message = clean($_POST['message'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) out(false, 'Please enter a valid email address.');

if ($type === 'newsletter') {
    $subject = "New newsletter signup";
    $body = "Newsletter signup:\n$email\n";
} else {
    if ($name === '' || $message === '') out(false, 'Please fill in your name and message.');
    $label = ($type === 'quote') ? 'Free Quote Request' : 'Contact / Feedback';
    $subject = "$label from $name";
    $body = "$label\n\nName: $name\nEmail: $email\nPhone: $phone\nService: $service\n\nMessage:\n$message\n";
}

$headers  = "From: $SITE <$FROM>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers)) {
    out(true, 'Thank you! Your message has been sent. We will get back to you shortly.');
}
out(false, 'Sorry, we could not send your message. Please call +255 718 273 723.');
