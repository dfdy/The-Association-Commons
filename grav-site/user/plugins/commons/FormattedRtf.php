<?php
namespace Grav\Plugin;

/** Plain-text Markdown exports with named, outlined RTF heading styles. */
final class FormattedRtf
{
    private static function escape(string $text): string
    {
        $result='';
        foreach (unpack('v*',mb_convert_encoding($text,'UTF-16LE','UTF-8')) as $unit) {
            if ($unit===10) {$result.='\\line ';continue;}
            if ($unit===9) {$result.='\\tab ';continue;}
            if ($unit<128) {
                $char=chr($unit);
                $result.=(in_array($char,['\\','{','}'],true)?'\\':'').$char;
            } else {$result.='\\u'.($unit>32767?$unit-65536:$unit).'?';}
        }
        return $result;
    }

    public static function render(string $markdown): string
    {
        $styles='{\\s0\\f0\\fs22\\sa160\\sl300\\slmult1 Normal;}';
        $sizes=[1=>48,2=>34,3=>28,4=>25,5=>23,6=>22];
        foreach ($sizes as $level=>$size) {
            $styles.='{\\s'.$level.'\\sbasedon0\\snext0\\keepn\\b\\fs'.$size
                .'\\sb'.($level===1?320:240).'\\sa120\\outlinelevel'.($level-1).' Heading '.$level.';}';
        }
        $rtf='{\\rtf1\\ansi\\ansicpg1252\\uc1\\deff0{\\fonttbl{\\f0 Arial;}}'
            .'{\\stylesheet'.$styles.'}\\paperw11907\\paperh16840\\margl1247\\margr1247\\margt1247\\margb1247' . "\n";
        $paragraph=[];
        $flush=static function () use (&$paragraph,&$rtf): void {
            if (!$paragraph) return;
            $rtf.='\\pard\\plain\\s0\\f0\\fs22\\sa160\\sl300\\slmult1 '
                .self::escape(implode("\n",$paragraph)).'\\par' . "\n";
            $paragraph=[];
        };
        foreach (explode("\n",str_replace(["\r\n","\r"],"\n",$markdown)) as $line) {
            if (preg_match('/^(#{1,6})\s+(.+?)\s*#*$/u',$line,$match)) {
                $flush();$level=strlen($match[1]);
                $rtf.='\\pard\\plain\\s'.$level.'\\f0\\b\\fs'.$sizes[$level]
                    .'\\keepn\\sb'.($level===1?320:240).'\\sa120\\outlinelevel'.($level-1).' '
                    .self::escape($match[2]).'\\par' . "\n";
            } elseif (trim($line)==='') {$flush();}
            else {$paragraph[]=$line;}
        }
        $flush();
        return $rtf.'}';
    }
}
