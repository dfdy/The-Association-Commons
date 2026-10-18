<?php
namespace Grav\Plugin\LanguageSuggestions;
final class LanguageRegistry
{
    private static function normalise(string $value): string
    {
        if (class_exists(\Normalizer::class)) $value=\Normalizer::normalize($value,\Normalizer::FORM_KD);
        $value=preg_replace('/\p{M}/u','',$value);
        return trim(preg_replace('/[^\p{L}\p{N}]+/u',' ',mb_strtolower($value)));
    }
    public static function existing(string $name,string $code): bool
    {
        return in_array(self::normalise($name),['kaaps','afrikaaps','af x kaaps'],true) || in_array($code,['en','af','nr','nso','sfs','ss','st','tn','ts','ve','xh','zu'],true);
    }
    private static function distance(string $left,string $right): int
    {
        $a=mb_str_split($left);$b=mb_str_split($right);$previous=range(0,count($b));$before=$previous;
        foreach ($a as $i=>$letter) {
            $row=[$i+1];
            foreach ($b as $j=>$other) {
                $row[$j+1]=min($previous[$j+1]+1,$row[$j]+1,$previous[$j]+($letter===$other?0:1));
                if ($i>0 && $j>0 && $letter===$b[$j-1] && $a[$i-1]===$other) $row[$j+1]=min($row[$j+1],$before[$j-1]+1);
            }
            $before=$previous;$previous=$row;
        }
        return $previous[count($b)];
    }
    public static function find(string $input): array
    {
        $name=self::normalise($input);$length=mb_strlen($name);
        if ($length<2 || $length>100) return ['exact'=>false,'matches'=>[]];
        $registry=json_decode(file_get_contents(__DIR__.'/data/languages.json'),true,512,JSON_THROW_ON_ERROR);
        $exact=[];$fuzzy=[];$threshold=$length>=9?2:1;
        foreach ($registry as $language) {
            $row=['code'=>$language['code'],'name'=>$language['name']];
            foreach (array_unique(array_merge([$language['code']],$language['aliases'])) as $alias) {
                $alias=self::normalise($alias);
                if ($alias===$name) {$exact[$row['code']]=$row;continue;}
                if ($length<4 || abs(mb_strlen($alias)-$length)>$threshold) continue;
                $score=self::distance($name,$alias);
                if ($score<=$threshold && (!isset($fuzzy[$row['code']]) || $score<$fuzzy[$row['code']]['score'])) $fuzzy[$row['code']]=$row+['score'=>$score];
            }
        }
        if ($exact) return ['exact'=>true,'matches'=>array_values($exact)];
        usort($fuzzy,static fn($a,$b)=>($a['score']<=>$b['score'])?:strcmp($a['name'],$b['name']));
        $best=$fuzzy[0]['score']??null;
        return ['exact'=>false,'matches'=>array_map(static fn($row)=>['code'=>$row['code'],'name'=>$row['name']],array_slice(array_values(array_filter($fuzzy,static fn($row)=>$row['score']===$best)),0,6))];
    }
}
