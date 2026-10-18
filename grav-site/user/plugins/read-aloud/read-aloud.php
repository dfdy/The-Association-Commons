<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;

class ReadAloudPlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return ['onTwigSiteVariables'=>['assets',0]];
    }
    public function assets(): void
    {
        if ($this->isAdmin()) return;
        $this->grav['assets']->addCss('plugin://read-aloud/assets/read-aloud.css');
        $this->grav['assets']->addJs('plugin://read-aloud/assets/read-aloud.js',['loading'=>'defer']);
    }
}
