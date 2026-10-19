<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class GlossaryShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('glossary', static function(ShortcodeInterface $sc) {
            return '<div class="tac-glossary">'.$sc->getContent().'</div>';
        });
        $this->shortcode->getHandlers()->add('glossary-entry', static function(ShortcodeInterface $sc) {
            return '<div class="tac-glossary-entry">'.$sc->getContent().'</div>';
        });
    }
}
