<?php
namespace Grav\Plugin\Shortcodes;
use Grav\Plugin\GovernancePatterns\Library;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;
class GovernancePatternsShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('governance-patterns', static function(ShortcodeInterface $sc) { return Library::render(); });
    }
}
