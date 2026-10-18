<?php
namespace Grav\Plugin\Shortcodes;
use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class SectionLayoutShortcode extends Shortcode
{
    public function init()
    {
        $this->shortcode->getHandlers()->add('subsection', static function(ShortcodeInterface $sc) {
            $number=htmlspecialchars((string)$sc->getParameter('number',''),ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');
            return '<div class="tac-subsection"><span class="tac-subsection-number" aria-hidden="true">'.$number.'</span><div class="tac-subsection-content">'.$sc->getContent().'</div></div>';
        });
        $this->shortcode->getHandlers()->add('section-layout', static function(ShortcodeInterface $sc) {
            $label=htmlspecialchars((string)$sc->getParameter('label',''),ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');
            $description=htmlspecialchars((string)$sc->getParameter('description',''),ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');
            $surface=$sc->getParameter('surface','')==='shaded'?' tac-section--shaded':'';
            return '<div class="tac-section'.$surface.'"><div class="tac-section-aside"><p class="tac-section-label">'.$label.'</p>'.($description!==''?'<p class="tac-section-description">'.$description.'</p>':'').'</div><div class="tac-section-body">'.$sc->getContent().'</div></div>';
        });
    }
}
