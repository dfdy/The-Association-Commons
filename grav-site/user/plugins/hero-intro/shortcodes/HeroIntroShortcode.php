<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class HeroIntroShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('hero-label', static function(ShortcodeInterface $sc) {
            return '<p class="tac-hero-label">'.$sc->getContent().'</p>';
        });
        $this->shortcode->getHandlers()->add('hero-accent', static function(ShortcodeInterface $sc) {
            return '<span class="tac-hero-accent">'.$sc->getContent().'</span>';
        });
        $this->shortcode->getHandlers()->add('hero-intro', static function(ShortcodeInterface $sc) {
            return '<div class="tac-hero-intro">'.$sc->getContent().'</div>';
        });
    }
}
