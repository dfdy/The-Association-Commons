<?php
namespace Grav\Plugin\LegalMatrix;

final class Matrix
{
    public const TYPES = ['legal_requirement'=>'Legal requirement','democratic_choice'=>'Democratic choice','prudent_safeguard'=>'Prudent safeguard','institutional_pattern'=>'Institutional pattern'];
    public const STATUSES = ['common_law'=>'Common law','enacted'=>'Enacted','proposed'=>'Proposed','repealed'=>'Repealed','uncertain'=>'Uncertain','not_applicable'=>'Not applicable'];
    public const REVIEWS = ['researched'=>'Researched','awaiting_verification'=>'Awaiting verification','verified'=>'Verified','due_for_review'=>'Due for review'];

    public static function load(): array
    {
        $data=json_decode(file_get_contents(__DIR__.'/data/legal-matrix.json'),true,512,JSON_THROW_ON_ERROR);
        if (($data['schema_version']??null)!=='1.0.0' || !isset($data['records']) || !is_array($data['records'])) throw new \RuntimeException('Unsupported legal matrix data.');
        $ids=[];
        foreach ($data['records'] as $row) {
            if (!preg_match('/^[a-z][a-z0-9-]*$/D',$row['id']??'') || isset($ids[$row['id']])) throw new \RuntimeException('Invalid or duplicate legal record ID.');
            $ids[$row['id']]=true;
            if (!isset(self::TYPES[$row['provision_type']],self::STATUSES[$row['legal_status']],self::REVIEWS[$row['review_status']])) throw new \RuntimeException('Invalid legal matrix classification.');
            if ($row['generator_ready'] && ($row['review_status']!=='verified' || !$row['last_verified'] || !$row['reviewer'] || in_array($row['legal_status'],['proposed','uncertain','repealed'],true))) throw new \RuntimeException('Unverified or proposed record cannot be generator-ready.');
            if ($row['generator_ready']) {
                if ($row['provision_type']==='legal_requirement' && empty($row['legal_basis'])) throw new \RuntimeException('A generator-ready legal requirement needs a legal basis.');
                foreach ($row['sources'] as $source) {
                    if (empty($source['source_checked_on']) || empty($source['locator'])) throw new \RuntimeException('Generator-ready records need checked, located sources.');
                }
            }
        }
        return $data;
    }
    private static function e($value): string { return htmlspecialchars((string)$value,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
    private static function url(string $value): string
    {
        return preg_match('~^(https://|/en/)~',$value) ? self::e($value) : '#';
    }
    public static function render(): string
    {
        $data=self::load();
        $html='<div class="legal-matrix" lang="en"><p>Dataset version <strong>'.self::e($data['dataset_version']).'</strong> · Last edited <time>'.self::e($data['updated_at']).'</time>. Editing dates are not legal verification dates.</p>';
        $html.='<p><a href="/en/legal-matrix?download=json">Download the JSON dataset</a> · <a href="/en/legal-matrix?download=schema">Download the JSON schema</a></p>';
        $html.='<div class="legal-matrix-filters" hidden><label for="legal-matrix-search">Search the indexes<input type="search" id="legal-matrix-search" autocomplete="off"></label>';
        foreach (['type'=>['Provision type',self::TYPES],'legal-status'=>['Legal status',self::STATUSES],'review'=>['Review status',self::REVIEWS]] as $key=>[$label,$choices]) {
            $html.='<label for="legal-matrix-'.$key.'">'.$label.'<select id="legal-matrix-'.$key.'"><option value="">All</option>';
            foreach ($choices as $value=>$text) $html.='<option value="'.self::e($value).'">'.self::e($text).'</option>';
            $html.='</select></label>';
        }
        $html.='<button type="button" id="legal-matrix-reset">Reset filters</button><p id="legal-matrix-status" role="status" aria-live="polite" aria-atomic="true"></p></div>';
        foreach ([false,true] as $reforms) {
            $heading=$reforms?'Proposed reforms — separate research watch':'Legal map and democratic design';
            $id=$reforms?'reforms':'map';
            $html.='<section aria-labelledby="legal-'.$id.'"><h2 id="legal-'.$id.'">'.$heading.'</h2>';
            if ($reforms) $html.='<p>These proposals are not treated as enacted requirements. Their current parliamentary status still needs independent verification.</p>';
            $html.='<div class="legal-matrix-scroll" role="region" aria-label="'.$heading.' index" tabindex="0"><table class="legal-matrix-table" id="legal-table-'.$id.'"><caption>'.$heading.' — research index</caption><thead><tr><th scope="col">Topic / dimension</th><th scope="col">Provision</th><th scope="col">Legal status</th><th scope="col">Provision type</th><th scope="col">Review status</th><th scope="col">Last verified</th></tr></thead><tbody>';
            foreach ($data['records'] as $r) {
                if (($r['legal_status']==='proposed')!==$reforms) continue;
                $html.='<tr data-provision-type="'.self::e($r['provision_type']).'" data-legal-status="'.self::e($r['legal_status']).'" data-review-status="'.self::e($r['review_status']).'"><th scope="row">'.self::e($r['topic']).'<br><small>'.self::e($r['dimension']).'</small></th><td><a href="#legal-record-'.self::e($r['id']).'">'.self::e($r['title']).'</a></td><td>'.self::e(self::STATUSES[$r['legal_status']]).'</td><td>'.self::e(self::TYPES[$r['provision_type']]).'</td><td>'.self::e(self::REVIEWS[$r['review_status']]).'</td><td>'.self::e($r['last_verified']??'Not yet verified').'</td></tr>';
            }
            $html.='</tbody></table></div></section>';
        }
        $html.='<section aria-labelledby="legal-records"><h2 id="legal-records">Record details and sources</h2><p>Open an entry to read its scope, sources, and outstanding research. Filters above apply to the indexes; all detail records remain available here.</p>';
        foreach ($data['records'] as $r) {
            $html.='<details class="legal-matrix-record" id="legal-record-'.self::e($r['id']).'"><summary>'.self::e($r['topic'].' — '.$r['title']).'</summary><p>'.self::e($r['summary']).'</p><dl>';
            $fields=['Provision type'=>self::TYPES[$r['provision_type']],'Legal status'=>self::STATUSES[$r['legal_status']],'Review status'=>self::REVIEWS[$r['review_status']],'Association forms'=>implode(', ',$r['applicability']['forms']),'Activities / triggers'=>implode(', ',$r['applicability']['activities']),'Applicability conditions'=>$r['applicability']['conditions'],'Legal basis / section'=>$r['legal_basis']??'Not yet verified','Effective from'=>$r['effective_from']??'Not yet verified','Effective to'=>$r['effective_to']??'Not established','Last verified'=>$r['last_verified']??'Not yet verified','Reviewer'=>$r['reviewer']??'Not yet assigned','Next review'=>$r['review_due']??'Not yet scheduled','Generator readiness'=>$r['generator_ready']?'Ready':'Not ready — research only','Research needed'=>$r['research_needed']];
            foreach ($fields as $label=>$value) $html.='<dt>'.self::e($label).'</dt><dd>'.self::e($value).'</dd>';
            $html.='</dl><p><strong>Sources and research leads</strong></p><ul>';
            foreach ($r['sources'] as $source) $html.='<li><a href="'.self::url($source['url']).'">'.self::e($source['title']).'</a> — '.self::e($source['locator']??'Specific provision to be identified').'; source checked: '.self::e($source['source_checked_on']??'not yet recorded').'.</li>';
            $html.='</ul><p><strong>Change history</strong></p><ul>';
            foreach ($r['change_history'] as $change) $html.='<li><time>'.self::e($change['date']).'</time>: '.self::e($change['note']).'</li>';
            $html.='</ul></details>';
        }
        return $html.'</section></div>';
    }
    public static function markdown(): string
    {
        $data=self::load();$out="Dataset version ".$data['dataset_version']."; last edited ".$data['updated_at'].". Editing dates are not verification dates.\n\n";
        foreach ($data['records'] as $r) {
            $out.='## '.$r['topic'].' — '.$r['title']."\n\n".$r['summary']."\n\nLegal status: ".self::STATUSES[$r['legal_status']].". Provision type: ".self::TYPES[$r['provision_type']].". Review: ".self::REVIEWS[$r['review_status']].". Last verified: ".($r['last_verified']??'Not yet verified').". Generator ready: ".($r['generator_ready']?'yes':'no').".\n\nForms: ".implode(', ',$r['applicability']['forms']).". Activities: ".implode(', ',$r['applicability']['activities']).".\n\n".$r['research_needed']."\n\n";
            foreach ($r['sources'] as $source) $out.='Source: ['.$source['title'].']('.$source['url'].")\n\n";
        }
        return $out;
    }
}
