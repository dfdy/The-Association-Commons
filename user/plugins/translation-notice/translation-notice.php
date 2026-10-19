<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;

class TranslationNoticePlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return [
            'onShortcodeHandlers'=>['registerShortcodes',0],
            'onTwigSiteVariables'=>['addAssets',0],
            'onCommonsExportMarkdown'=>['exportMarkdown',0],
        ];
    }

    public function registerShortcodes(): void
    {
        $this->grav['shortcode']->registerAllShortcodes(__DIR__.'/shortcodes');
    }

    public function addAssets(): void
    {
        if (!$this->isAdmin()) {
            $version=substr(hash_file('sha256',__DIR__.'/assets/translation-notice.css'),0,12);
            $this->grav['assets']->addCss('plugin://translation-notice/assets/translation-notice.css?v='.$version);
        }
    }

    public static function links(string $route): array
    {
        $parts=explode('/',trim($route,'/'));
        $language=array_shift($parts);
        return ['/en'.($parts?'/'.implode('/',$parts):''),'/'.rawurlencode($language)];
    }

    public static function render(string $route): string
    {
        [$english,$proposal]=self::links($route);
        $escape=static fn($value)=>htmlspecialchars($value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');
        return '<aside class="tac-translation-notice" lang="en" aria-label="Translation notice">'
            .'<svg class="tac-translation-warning-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" focusable="false"><path d="M12 3 2 21h20Z"/><path class="tac-translation-icon-shade" d="M12 3v18h10Z" stroke="none"/><path d="M12 9v5"/><circle cx="12" cy="17.5" r=".8" fill="currentColor" stroke="none"/></svg>'
            .'<p><strong>Machine-translated content</strong></p>'
            .'<p>This content has been machine translated and may contain errors. The <a href="'.$escape($english).'" hreflang="en">English version of this page</a> is the current canonical source.</p>'
            .'<p>Interested in helping to translate or improve translations? Please express your interest in joining the translation effort. Joining information is on <a href="'.$escape($proposal).'">the proposal page for this language</a>.</p></aside>';
    }

    public function exportMarkdown(Event $event): void
    {
        [$english,$proposal]=self::links($this->grav['page']->route());
        $notice='**Machine-translated content**'."\n\n"
            .'This content has been machine translated and may contain errors. The [English version of this page]('.$english.') is the current canonical source.'."\n\n"
            .'Interested in helping to translate or improve translations? Please express your interest in joining the translation effort. Joining information is on [the proposal page for this language]('.$proposal.').';
        $event['markdown']=preg_replace('/^\[translation-notice\s*\/\]\s*$/m',$notice,$event['markdown']);
    }
}
