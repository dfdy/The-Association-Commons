<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;
use Grav\Plugin\GovernancePatterns\Library;
require_once __DIR__.'/Library.php';

class GovernancePatternsPlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return ['onShortcodeHandlers'=>['registerShortcodes',0], 'onTwigSiteVariables'=>['assets',0], 'onPageInitialized'=>['download',10], 'onCommonsExportMarkdown'=>['exportMarkdown',0]];
    }
    public function registerShortcodes(): void { $this->grav['shortcode']->registerAllShortcodes(__DIR__.'/shortcodes'); }
    public function assets(): void
    {
        if ($this->isAdmin() || $this->grav['page']->route()!=='/en/governance-patterns') return;
        $assets=$this->grav['assets'];
        $assets->addCss('plugin://legal-matrix/assets/vendor/dataTables.dataTables.min.css');
        $assets->addCss('plugin://legal-matrix/assets/legal-matrix.css');
        $assets->addJs('plugin://legal-matrix/assets/vendor/jquery-3.7.1.min.js',['priority'=>103,'loading'=>'defer']);
        $assets->addJs('plugin://legal-matrix/assets/vendor/dataTables.min.js',['priority'=>102,'loading'=>'defer']);
        $assets->addJs('plugin://governance-patterns/assets/governance-patterns.js',['priority'=>101,'loading'=>'defer']);
    }
    public function download(): void
    {
        if ($this->isAdmin() || $this->grav['page']->route()!=='/en/governance-patterns') return;
        $format=$_GET['download']??'';
        if (!in_array($format,['json','schema'],true)) return;
        $page=$this->grav['page'];
        if (!$page->published() || !$page->routable()) return;
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('Content-Disposition: attachment; filename="governance-patterns'.($format==='schema'?'.schema':'').'.json"');
        if ($format==='json') echo json_encode(Library::load(),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
        else readfile(__DIR__.'/data/governance-patterns.schema.json');
        exit;
    }
    public function exportMarkdown(Event $event): void
    {
        if (str_contains($event['markdown'],'[governance-patterns /]')) $event['markdown']=str_replace('[governance-patterns /]',Library::markdown(),$event['markdown']);
    }
}
