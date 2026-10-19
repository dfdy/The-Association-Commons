<?php
namespace Grav\Plugin\Shortcodes;
use Grav\Common\Grav;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;
class LanguageSuggestionsShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('language-suggestions',static function(ShortcodeInterface $sc) {return Grav::instance()['language-suggestions']->render();});
    }
}
