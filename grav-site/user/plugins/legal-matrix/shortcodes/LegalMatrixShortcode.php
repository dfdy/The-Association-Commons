<?php
namespace Grav\Plugin\Shortcodes;
use Grav\Plugin\LegalMatrix\Matrix;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;
class LegalMatrixShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('legal-matrix', static function(ShortcodeInterface $sc) { return Matrix::render(); });
    }
}
