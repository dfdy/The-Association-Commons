<?php
namespace Grav\Plugin\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;

class RememberPanelShortcode extends Shortcode
{
    private static int $instance=0;
    public function init()
    {
        $this->shortcode->getHandlers()->add('remember-panel', function(ShortcodeInterface $sc) {
            $id=(string)$sc->getParameter('id','');
            // An explicit stable ID is required. Never infer identity from heading or position.
            if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/D',$id)) return $sc->getContent();
            $title=(string)$sc->getParameter('title','Panel');
            $reset=(string)$sc->getParameter('reset','7d');
            $days=preg_match('/^([1-9][0-9]{0,2})d$/D',$reset,$match)?min(365,(int)$match[1]):7;
            $contentId='remember-panel-content-'.(++self::$instance);
            $escape=static fn($value)=>htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');
            return '<section class="remember-panel" data-remember-panel="'.$escape($id).'" data-reset-ms="'.($days*86400000).'" aria-label="'.$escape($title).'">'
                .'<div class="remember-panel__content" id="'.$contentId.'">'.$sc->getContent().'</div>'
                .'<button class="remember-panel__handle" type="button" aria-controls="'.$contentId.'" aria-expanded="true" data-show-label="'.$escape($sc->getParameter('show','Open')).'" data-hide-label="'.$escape($sc->getParameter('hide','Close')).'" hidden>'
                .'<span class="remember-panel__grip" aria-hidden="true"></span><span>'.$escape($title).' — <span data-panel-action></span></span>'
                .'<svg class="remember-panel__chevron" aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="m5 12 5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                .'</button></section>';
        });
    }
}
