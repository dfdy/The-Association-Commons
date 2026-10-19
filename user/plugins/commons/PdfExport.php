<?php
namespace Grav\Plugin;

/** Self-contained page styling with no page scripts, forms, or network resources. */
final class PdfExport
{
    private static function escape(string $text): string
    {
        return htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public static function document(string $html, string $title, string $language, string $theme, string $root, string $pagePath, string $origin, string $route): string
    {
        $theme = $theme === 'night' ? 'night' : 'day';
        $dom = new \DOMDocument('1.0', 'UTF-8');
        $previous = libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="UTF-8"><html><body>'.$html.'</body></html>', LIBXML_NONET);
        libxml_clear_errors();libxml_use_internal_errors($previous);
        $xpath = new \DOMXPath($dom);
        // Replace form widgets as a whole, so neither values nor verification tokens enter PDFs.
        foreach (['project-interest' => $route.'#project-interest', 'language-suggestions' => '/en/languages'] as $class => $url) {
            foreach ($xpath->query('//*[contains(concat(" ",normalize-space(@class)," ")," '.$class.' ")]') as $node) {
                $link = $dom->createElement('a', $class === 'project-interest' ? 'Open the participation form on the website' : 'Suggest a language on the website');
                $link->setAttribute('href', rtrim($origin, '/').$url);
                $node->parentNode->replaceChild($link, $node);
            }
        }
        foreach ($xpath->query('//script|//style|//form|//input|//textarea|//select|//button|//iframe|//object|//embed|//link|//meta|//*[contains(concat(" ",normalize-space(@class)," ")," legal-matrix-filters ")]') as $node) {
            $node->parentNode?->removeChild($node);
        }
        $tags = explode(' ', 'html body p div span section article aside nav h1 h2 h3 h4 h5 h6 a strong em b i u s del small sub sup blockquote pre code br hr ul ol li dl dt dd table thead tbody tfoot tr th td caption colgroup col figure figcaption img details summary abbr time');
        $attributes = ['class','id','lang','dir','alt','title','href','src','colspan','rowspan','scope','start','role','aria-label','aria-labelledby','aria-describedby','aria-hidden'];
        foreach (iterator_to_array($dom->getElementsByTagName('*')) as $node) {
            if (!in_array($node->tagName, $tags, true)) {$node->parentNode?->removeChild($node);continue;}
            foreach (iterator_to_array($node->attributes) as $attribute) {
                if (!in_array($attribute->name, $attributes, true)) $node->removeAttribute($attribute->name);
            }
            if ($node->tagName === 'details') $node->setAttribute('open', 'open');
            if ($node->hasAttribute('href')) {
                $href = trim($node->getAttribute('href'));
                if (preg_match('/[\x00-\x20]/', $href) || preg_match('/^(?!https?:|mailto:)[a-z][a-z0-9+.-]*:/i', $href)) $node->removeAttribute('href');
                elseif (str_starts_with($href, '/') && !str_starts_with($href, '//')) $node->setAttribute('href', rtrim($origin, '/').$href);
                elseif ($href !== '' && !preg_match('/^(?:https?:|mailto:|#|\/\/)/i', $href)) $node->setAttribute('href', rtrim($origin, '/').rtrim($route, '/').'/'.$href);
            }
            if ($node->tagName === 'img') {
                $src = rawurldecode(parse_url($node->getAttribute('src'), PHP_URL_PATH) ?: '');
                $path = realpath(str_starts_with($src, '/') ? $root.$src : $pagePath.'/'.$src);
                $allowed = false;
                foreach ([$root.'/user/pages', $root.'/user/themes/commons/images'] as $directory) {
                    $base = realpath($directory);
                    if ($base && $path && str_starts_with($path, $base.DIRECTORY_SEPARATOR)) $allowed = true;
                }
                $mime = $path && is_file($path) ? (new \finfo(FILEINFO_MIME_TYPE))->file($path) : '';
                if ($allowed && in_array($mime, ['image/png','image/jpeg','image/gif','image/webp'], true) && filesize($path) <= 5 * 1024 * 1024) {
                    $node->setAttribute('src', 'data:'.$mime.';base64,'.base64_encode(file_get_contents($path)));
                } else {
                    $node->parentNode?->replaceChild($dom->createTextNode($node->getAttribute('alt')), $node);
                }
            }
        }
        $body = '';
        foreach ($dom->getElementsByTagName('body')->item(0)->childNodes as $child) $body .= $dom->saveHTML($child);
        $css = file_get_contents($root.'/user/themes/commons/css/site.css');
        foreach (glob($root.'/user/plugins/*/assets/*.css') as $file) $css .= "\n".file_get_contents($file);
        $css .= "\n".file_get_contents(__DIR__.'/assets/pdf.css');
        $font = base64_encode(file_get_contents('/opt/pdf/fonts/NotoSans-Regular.ttf'));
        $css .= "\n".'@font-face{font-family:"DDC Sans";src:url(data:font/ttf;base64,'.$font.')}html{font-family:"DDC Sans",sans-serif}';
        $css .= "\n@page{background:".($theme === 'night' ? '#151d1a' : '#f6f4ed').'}';
        $logo = 'data:image/svg+xml;base64,'.base64_encode(file_get_contents($root.'/user/themes/commons/images/ddc-logo.svg'));
        $e = [self::class, 'escape'];
        preg_match('/^version:\s*(\S+)\s*$/m', file_get_contents(__DIR__.'/blueprints.yaml'), $release);
        $version = trim($release[1] ?? 'unknown', "\"'");
        $exported = (new \DateTimeImmutable('now', new \DateTimeZone('Africa/Johannesburg')))->format('j F Y');
        return '<!doctype html><html lang="'.$e($language).'" data-theme="'.$theme.'"><head><meta charset="utf-8">'
            .'<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:; font-src data:; base-uri \'none\'">'
            .'<title>'.$e($title).' · The Democratic Development Commons</title><style>'.$css.'</style></head><body>'
            .'<header class="site-header" lang="en"><div class="brand"><img class="brand-logo" src="'.$logo.'" alt=""><div class="brand-copy">The Democratic Development Commons<span>Collective learning, mutual aid, and democratic self-government</span></div></div>'
            .'<div class="pdf-export-meta"><p>© The Democratic Development Commons · Content licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>'
            .'<br>Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International</p>'
            .'<p>Exported '.$e($exported).' (South African Standard Time) · DDC software version '.$e($version).'</p></div></header>'
            .'<main id="content"><article class="prose" lang="'.$e($language).'">'.$body.'</article></main>'
            .'<footer class="pdf-attribution">The Democratic Development Commons · Content: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a></footer></body></html>';
    }

    public static function render(string $html): string
    {
        // Bound browser resource use; a busy download can be retried without queueing workers.
        $lock = fopen(sys_get_temp_dir().'/ddc-pdf-render.lock', 'c');
        if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
            if (is_resource($lock)) fclose($lock);
            throw new \RuntimeException('PDF renderer busy');
        }
        // Fixed executable and script path; page text is data on stdin, never a shell command.
        $process = proc_open(['/usr/local/bin/node', __DIR__.'/pdf-render.mjs'], [0=>['pipe','r'],1=>['pipe','w'],2=>['pipe','w']], $pipes);
        if (!is_resource($process)) {flock($lock, LOCK_UN);fclose($lock);throw new \RuntimeException('PDF renderer unavailable');}
        try {
            $offset = 0;
            while ($offset < strlen($html)) {
                $written = fwrite($pipes[0], substr($html, $offset));
                if (!$written) throw new \RuntimeException('PDF input failed');
                $offset += $written;
            }
            fclose($pipes[0]);
            $pdf = stream_get_contents($pipes[1]);fclose($pipes[1]);
            stream_get_contents($pipes[2]);fclose($pipes[2]);
            $status = proc_close($process);
            if ($status !== 0 || !str_starts_with($pdf, '%PDF-')) throw new \RuntimeException('PDF rendering failed');
            return $pdf;
        } finally {
            flock($lock, LOCK_UN);fclose($lock);
            foreach ($pipes as $pipe) if (is_resource($pipe)) fclose($pipe);
            if (is_resource($process)) {proc_terminate($process);proc_close($process);}
        }
    }
}
