<?php
namespace Grav\Plugin\Shortcodes;

use Grav\Common\Grav;
use Grav\Plugin\TranslationNoticePlugin;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class TranslationNoticeShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('translation-notice', static function(ShortcodeInterface $sc) {
            return TranslationNoticePlugin::render(Grav::instance()['page']->route());
        });
    }
}
