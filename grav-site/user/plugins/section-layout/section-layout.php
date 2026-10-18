<?php
namespace Grav\Plugin;

use Grav\Common\Plugin;
use RocketTheme\Toolbox\Event\Event;

class SectionLayoutPlugin extends Plugin
{
    public static function getSubscribedEvents(): array
    {
        return [
            'onShortcodeHandlers'=>['registerShortcodes',0],
            'onTwigSiteVariables'=>['addAssets',0],
            'onCommonsExportMarkdown'=>['exportMarkdown',0],
        ];
    }

    public function registerShortcodes(): void
    {
        $this->grav['shortcode']->registerAllShortcodes(__DIR__.'/shortcodes');
    }

    public function addAssets(): void
    {
        if ($this->isAdmin()) return;
        $this->grav['assets']->addCss('plugin://section-layout/assets/section-layout.css');
    }

    public function exportMarkdown(Event $event): void
    {
        $event['markdown']=self::withoutControls($event['markdown']);
    }

    /** Keep all prose in exports; preserve literal shortcode examples in code fences. */
    public static function withoutControls(string $markdown): string
    {
        $lines=explode("\n",$markdown);$output=[];$fence=null;
        foreach ($lines as $line) {
            if (preg_match('/^\s{0,3}(`{3,}|~{3,})(.*)$/',$line,$match)) {
                if ($fence===null) $fence=$match[1];
                elseif ($match[1][0]===$fence[0] && strlen($match[1])>=strlen($fence) && trim($match[2])==='') $fence=null;
                $output[]=$line;continue;
            }
            if ($fence===null && preg_match('/^\s*\[(?:(?:section-layout|subsection)\b[^\r\n]*|\/(?:section-layout|subsection))\]\s*$/',$line)) {
                // Sidebar prose belongs in downloads too; omit only the visual wrapper.
                if (preg_match("/\\bdescription=([\"'])(.*?)\\1/",$line,$description)) {
                    $output[]=html_entity_decode($description[2],ENT_QUOTES|ENT_HTML5,'UTF-8');
                    $output[]='';
                }
                continue;
            }
            $output[]=$line;
        }
        return implode("\n",$output);
    }
}
