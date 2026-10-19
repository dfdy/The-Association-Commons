<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;

class LanguageMenuPlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return ['onTwigTemplatePaths'=>['templatePaths',0], 'onTwigSiteVariables'=>['assets',0]];
    }

    public function templatePaths(): void
    {
        $this->grav['twig']->twig_paths[]=__DIR__.'/templates';
    }

    public function assets(): void
    {
        if ($this->isAdmin()) return;
        $this->grav['assets']->addCss('plugin://language-menu/assets/language-menu.css');
        $this->grav['assets']->addJs('plugin://language-menu/assets/language-menu.js',['loading'=>'defer']);
    }
}
