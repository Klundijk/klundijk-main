<?php
// Contactformulier van klundijk.com: valideert de invoer en verstuurt hem via Resend (https://resend.com) naar het kantooradres.
//
// Configuratie staat BUITEN de webroot, in ../resend-config.php (naast public_html) en wordt bij de deploy uit GitHub-geheimen
// geschreven. Het bestand bevat de API-sleutel en komt nooit in git. Formaat:
//   <?php return ['api_key' => 're_...', 'from' => 'Klundijk website <website@klundijk.com>', 'to' => 'info@klundijk.com'];
// Zonder configuratie antwoordt dit script met 503, zodat de site de foutmelding toont en er niets verloren lijkt te gaan.
//
// Compatibel met PHP 7.2 (de testserver): geen pijlfuncties of andere PHP 7.4+-syntax.
//
// Aanroep: POST (multipart of urlencoded) met naam, bedrijf, email, vraagstuk, het verborgen spamveld "website" en de tijdstempel "ts" (ms).
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

// Spamfilters. Bij spam doen we alsof het gelukt is en versturen niets, zodat bots niet leren wat er afgekeurd wordt.
// De reden (zonder persoonsgegevens) gaat naar het serverlog, zodat een onterecht geweerd bericht te herleiden is.
$spam = static function (string $reason) use ($wantsJson) {
    error_log('contact.php: spam geweerd (' . $reason . ')');
    respond($wantsJson, 200, true, '', 'Bedankt, we hebben je bericht ontvangen.');
};

// 1. Verborgen veld: een mens laat het leeg.
if (trim((string) ($_POST['website'] ?? '')) !== '') { $spam('honeypot'); }

// 2. Tijdval: het formulier-script zet bij het laden van de pagina een tijdstempel (ms). Een bot post meteen of zonder tijdstempel.
$score = 0;
$ts = (string) ($_POST['ts'] ?? '');
if ($ts !== '' && ctype_digit($ts)) {
    $age = time() - intdiv((int) $ts, 1000);
    if ($age < 2) { $spam('te snel'); }
    if ($age > 86400 || $age < -60) { $score += 2; }
} else {
    $score += 2; // geen JavaScript of een rechtstreekse post: verdacht, maar niet direct fout (formulier zonder JavaScript).
}

// 3. Inhoud: links en bekende spamtaal. Een zakelijke vraag bevat zelden meerdere links.
$all = $naam . ' ' . $bedrijf . ' ' . $vraag;
$links = preg_match_all('~(?:https?://|www\.|\b[a-z0-9-]+\.(?:com|net|org|ru|cn|top|xyz|site|online|shop|info|biz|co)\b/)~i', $all);
if (preg_match('~https?://|www\.~i', $naam . ' ' . $bedrijf)) { $spam('link in naam of bedrijf'); }
if ($links >= 3) { $spam('veel links'); }
if ($links >= 1) { $score += 1; }
if ($links >= 2) { $score += 1; }
if (preg_match('~\b(seo|backlinks?|guest post|casino|viagra|cialis|crypto|bitcoin|forex|loan|escort|porn|telegram|whatsapp me|rank (?:#?1|first)|web ?design(?:er)? (?:offer|service)|we (?:can )?(?:offer|provide) (?:you )?(?:seo|web)|dear (?:sir|madam|webmaster|owner))\b~i', $all)) { $score += 2; }
if (mb_strtolower($naam, 'UTF-8') === mb_strtolower($vraag, 'UTF-8')) { $score += 2; }
// Bericht zonder één Nederlands woord én met Cyrillisch of Chinees schrift: bijna altijd massaspam.
if (preg_match('~[\x{0400}-\x{04FF}\x{4E00}-\x{9FFF}]~u', $all)) { $score += 2; }

// 4. E-maildomein moet bestaan (MX of A-record); wegwerpdomeinen weren.
$domain = strtolower((string) substr(strrchr($email, '@') ?: '@', 1));
if ($domain !== '' && function_exists('checkdnsrr') && !checkdnsrr($domain . '.', 'MX') && !checkdnsrr($domain . '.', 'A')) { $score += 2; }
if (in_array($domain, ['mailinator.com', 'guerrillamail.com', 'yopmail.com', 'tempmail.com', '10minutemail.com', 'trashmail.com', 'sharklasers.com', 'getnada.com', 'dispostable.com'], true)) { $score += 3; }

if ($score >= 3) { $spam('score ' . $score); }

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

// Rem: per IP-adres maximaal 3 berichten per 10 minuten, en voor de hele site maximaal 30 per uur (beschermt de inbox en het Resend-tegoed
// bij een bot met wisselende IP-adressen). Bestandsgebaseerd en best-effort.
$ip = (string) ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '');
$dir = rtrim($cfg['rate_dir'] ?? sys_get_temp_dir(), '/');
$now = time();
$load = static function (string $file, int $window) use ($now): array {
    if (!is_file($file)) { return []; }
    return array_values(array_filter((array) json_decode((string) @file_get_contents($file), true), static function ($t) use ($now, $window) { return is_int($t) && $t > $now - $window; }));
};
$bucket = $dir . '/klundijk-contact-' . hash('sha256', $ip . ($cfg['api_key'])) . '.json';
$globalBucket = $dir . '/klundijk-contact-global-' . hash('sha256', $cfg['api_key']) . '.json';
$hits = $load($bucket, 600);
$globalHits = $load($globalBucket, 3600);
if (count($hits) >= 3 || count($globalHits) >= 30) {
    respond($wantsJson, 429, false, 'rate', 'Er zijn net al meerdere berichten verstuurd. Probeer het over een paar minuten opnieuw of mail naar info@klundijk.com.');
}

// Bericht opstellen.
$e = static function (string $s): string { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
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
$globalHits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);
@file_put_contents($globalBucket, json_encode($globalHits), LOCK_EX);
respond($wantsJson, 200, true, '', 'Bedankt, we hebben je bericht ontvangen.');
