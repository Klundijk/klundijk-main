<?php
// Contactformulier van klundijk.com: valideert de invoer en verstuurt hem via Resend (https://resend.com) naar het kantooradres.
//
// Configuratie staat BUITEN de webroot, in ../resend-config.php (naast public_html) en wordt bij de deploy uit GitHub-geheimen
// geschreven. Het bestand bevat de API-sleutel en komt nooit in git. Formaat:
//   <?php return ['api_key' => 're_...', 'from' => 'Klundijk website <website@klundijk.com>', 'to' => 'info@klundijk.com'];
// Zonder configuratie antwoordt dit script met 503, zodat de site de foutmelding toont en er niets verloren lijkt te gaan.
//
// Aanroep: POST (multipart of urlencoded) met naam, bedrijf, email, vraagstuk en het verborgen spamveld "website".
// Met "Accept: application/json" (het formulier-script) komt er JSON terug; zonder (formulier zonder JavaScript) een kleine pagina.

declare(strict_types=1);

ini_set('display_errors', '0');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(bool $json, int $status, bool $ok, string $code, string $message)
{
    http_response_code($status);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'error' => $ok ? null : $code, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    $title = $ok ? 'Bedankt' : 'Versturen is niet gelukt';
    $m = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="nl"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>' . $title . ' | Klundijk</title>'
        . '<body style="font-family:system-ui,sans-serif;max-width:34rem;margin:4rem auto;padding:0 1.25rem;line-height:1.5">'
        . '<h1 style="font-size:1.75rem">' . $title . '</h1><p>' . $m . '</p><p><a href="/">Terug naar de homepage</a></p></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond($wantsJson, 405, false, 'method', 'Alleen POST is toegestaan.');
}

// Verzoeken moeten van de eigen site komen (bescherming tegen formulieren op andere sites).
$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    $v = $_SERVER[$h] ?? '';
    if ($v !== '' && strtolower((string) parse_url($v, PHP_URL_HOST)) !== preg_replace('/:\d+$/', '', $host)) {
        respond($wantsJson, 403, false, 'origin', 'Dit verzoek is niet toegestaan.');
    }
}

// Configuratie laden.
$cfg = null;
foreach ([__DIR__ . '/../../resend-config.php', dirname($_SERVER['DOCUMENT_ROOT'] ?? '') . '/resend-config.php'] as $file) {
    if (is_file($file)) { $cfg = include $file; break; }
}
if (!is_array($cfg) || empty($cfg['api_key']) || empty($cfg['from']) || empty($cfg['to'])) {
    error_log('contact.php: resend-config.php ontbreekt of is onvolledig');
    respond($wantsJson, 503, false, 'not_configured', 'Het formulier is nog niet gekoppeld.');
}

// Invoer opschonen: geen stuurtekens, gelimiteerde lengte.
$clean = static function (string $key, int $max, bool $multiline = false): string {
    $v = (string) ($_POST[$key] ?? '');
    $v = preg_replace($multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}+/u', ' ', $v) ?? '';
    $v = trim($v);
    return mb_substr($v, 0, $max, 'UTF-8');
};
$naam = $clean('naam', 120);
$bedrijf = $clean('bedrijf', 120);
$email = $clean('email', 254);
$vraag = $clean('vraagstuk', 5000, true);

// Spamval: een mens laat het verborgen veld leeg. Bij een bot doen we alsof het gelukt is en versturen niets.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond($wantsJson, 200, true, '', 'Bedankt, we hebben je bericht ontvangen.');
}

$fields = [];
if ($naam === '') { $fields[] = 'naam'; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $fields[] = 'email'; }
if ($vraag === '') { $fields[] = 'vraagstuk'; }
if ($fields) {
    http_response_code(400);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => false, 'error' => 'validation', 'fields' => $fields, 'message' => 'Controleer de ingevulde gegevens.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    respond(false, 400, false, 'validation', 'Controleer je naam, e-mailadres en bericht en probeer het opnieuw.');
}

// Eenvoudige rem per IP-adres (maximaal 5 berichten per 10 minuten), bestandsgebaseerd en best-effort.
$ip = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '');
$bucket = rtrim($cfg['rate_dir'] ?? sys_get_temp_dir(), '/') . '/klundijk-contact-' . hash('sha256', $ip . ($cfg['api_key'])) . '.json';
$now = time();
$hits = [];
if (is_file($bucket)) {
    $hits = array_values(array_filter((array) json_decode((string) @file_get_contents($bucket), true), static fn ($t) => is_int($t) && $t > $now - 600));
}
if (count($hits) >= 5) {
    respond($wantsJson, 429, false, 'rate', 'Er zijn net al meerdere berichten verstuurd. Probeer het over een paar minuten opnieuw.');
}

// Bericht opstellen.
$e = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$subject = 'Nieuw bericht via de website: ' . $naam;
$text = "Nieuw bericht via klundijk.com\n\nNaam: $naam\nBedrijf: " . ($bedrijf !== '' ? $bedrijf : '-') . "\nE-mail: $email\n\nBericht:\n$vraag\n";
$html = '<p><strong>Nieuw bericht via klundijk.com</strong></p>'
    . '<p>Naam: ' . $e($naam) . '<br>Bedrijf: ' . ($bedrijf !== '' ? $e($bedrijf) : '-') . '<br>E-mail: <a href="mailto:' . $e($email) . '">' . $e($email) . '</a></p>'
    . '<p>Bericht:<br>' . nl2br($e($vraag)) . '</p>'
    . '<p style="color:#666;font-size:12px">Antwoorden op deze e-mail gaan rechtstreeks naar de afzender.</p>';
$payload = [
    'from' => (string) $cfg['from'],
    'to' => array_map('trim', explode(',', (string) $cfg['to'])),
    'reply_to' => $email,
    'subject' => $subject,
    'text' => $text,
    'html' => $html,
];

// Versturen via Resend (de Idempotency-Key voorkomt een dubbel bericht bij een snelle herhaling).
$ch = curl_init((string) ($cfg['api_url'] ?? 'https://api.resend.com/emails'));
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $cfg['api_key'],
        'Content-Type: application/json',
        'User-Agent: klundijk-website/1.0',
        'Idempotency-Key: ' . hash('sha256', $email . $vraag . intdiv($now, 300)),
    ],
]);
$body = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($status < 200 || $status >= 300) {
    // Alleen de status en de foutmelding van Resend loggen, nooit de gegevens van de bezoeker.
    error_log('contact.php: Resend gaf ' . $status . ' ' . ($curlErr !== '' ? $curlErr : substr((string) $body, 0, 300)));
    respond($wantsJson, 502, false, 'send_failed', 'Versturen is niet gelukt. Probeer het opnieuw of mail naar info@klundijk.com.');
}

$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);
respond($wantsJson, 200, true, '', 'Bedankt, we hebben je bericht ontvangen.');
