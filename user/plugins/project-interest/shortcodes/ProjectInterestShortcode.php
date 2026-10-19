<?php
namespace Grav\Plugin\Shortcodes;
use Grav\Common\Grav;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;
class ProjectInterestShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('project-interest',static function(ShortcodeInterface $sc) {return Grav::instance()['project-interest']->render();});
    }
}
