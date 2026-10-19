<?php
// Run locally, or pipe into container PHP with GRAV_ROOT=/var/www/html.
$root = getenv('GRAV_ROOT') ?: dirname(__DIR__);
require_once $root.'/user/plugins/commons/PdfExport.php';
$html = '<section class="remember-panel"><h2 id="sample">Readable heading</h2><p>Normal <strong>formatted</strong> text.</p></section>'
    .'<div class="project-interest"><form><input name="nonce" value="private-token"><textarea>private-message</textarea></form></div>'
    .'<script>private-script</script><style>private-style</style><iframe src="file:///etc/passwd"></iframe>'
    .'<a href="javascript:alert(1)" onclick="private-handler">Safe label</a>'
    .'<img src="https://example.invalid/tracker.png" alt="Remote image description">'
    .'<img src="/user/pages/../../config/system.yaml" alt="Unavailable image">'
    .'<details><summary>Research record</summary><p>Expanded record</p></details>';
$pdf = \Grav\Plugin\PdfExport::document($html, 'Test <title>', 'zu', 'night', $root, $root.'/user/pages/01.en', 'http://localhost:8388', '/zu');
foreach (['private-token','private-message','private-script','private-style','private-handler','javascript:','file:///etc/passwd','https://example.invalid/tracker.png'] as $forbidden) {
    if (str_contains($pdf, $forbidden)) throw new RuntimeException('Unsafe content retained: '.$forbidden);
}
foreach (['data-theme="night"','lang="zu"','<strong>formatted</strong>','<details open="open">','Remote image description','Open the participation form','http://localhost:8388/zu#project-interest'] as $expected) {
    if (!str_contains($pdf, $expected)) throw new RuntimeException('Expected content absent: '.$expected);
}
echo "PASS: formatted content, theme/language, expanded records, form replacement, and removal of unsafe markup, URLs, private fields, and remote images.\n";
