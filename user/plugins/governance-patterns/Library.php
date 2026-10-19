<?php
namespace Grav\Plugin\GovernancePatterns;
final class Library
{
    public const CATEGORIES=['contributions'=>'Contributions','hardship'=>'Hardship','facilitation'=>'Rotating facilitation','reviewers'=>'Reviewer models','federation'=>'Federation','conflict'=>'Conflict procedures','accessible_meetings'=>'Accessible meetings'];
    public const STATUSES=['untested_draft'=>'Untested draft','in_testing'=>'In testing','tested'=>'Tested','retired'=>'Retired'];
    public const TYPES=['democratic_choice'=>'Democratic choice','prudent_safeguard'=>'Prudent safeguard','institutional_pattern'=>'Institutional pattern'];
    public static function load(): array
    {
        $data=json_decode(file_get_contents(__DIR__.'/data/governance-patterns.json'),true,512,JSON_THROW_ON_ERROR);
        if (($data['schema_version']??'')!=='1.0.0' || !isset($data['patterns'])) throw new \RuntimeException('Unsupported pattern dataset.');
        $ids=[];
        foreach ($data['patterns'] as $p) {
            if (!preg_match('/^[a-z][a-z0-9-]*$/D',$p['id']) || isset($ids[$p['id']])) throw new \RuntimeException('Invalid pattern ID.');
            $ids[$p['id']]=true;
            if (!isset(self::CATEGORIES[$p['category']],self::STATUSES[$p['testing_status']],self::TYPES[$p['provision_type']])) throw new \RuntimeException('Invalid pattern classification.');
            if ($p['testing_status']==='tested' && (!$p['test_evidence'] || !$p['last_tested'] || !$p['reviewer'])) throw new \RuntimeException('Tested patterns require evidence.');
            if ($p['legal_review_status']==='reviewed' && (!$p['legal_reviewed_on'] || !$p['legal_reviewer'] || !$p['legal_review_notes'])) throw new \RuntimeException('Legal review requires a date, reviewer, and notes.');
            if ($p['generator_ready'] && ($p['testing_status']!=='tested' || $p['legal_review_status']!=='reviewed' || !$p['review_due'])) throw new \RuntimeException('Pattern not ready for generator use.');
        }
        return $data;
    }
    private static function e($v): string {return htmlspecialchars((string)$v,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
    private static function list(array $items): string {return '<ul>'.implode('',array_map(static fn($v)=>'<li>'.self::e($v).'</li>',$items)).'</ul>';}
    public static function render(): string
    {
        $data=self::load();
        $html='<div class="legal-matrix governance-library" lang="en"><p>Dataset version <strong>'.self::e($data['dataset_version']).'</strong> · Last edited '.self::e($data['updated_at']).'. Editing dates do not establish testing or legal review.</p><p><a href="/en/governance-patterns?download=json">Download the JSON dataset</a> · <a href="/en/governance-patterns?download=schema">Download the JSON schema</a></p><div class="legal-matrix-filters" hidden><label for="pattern-search">Search the index<input type="search" id="pattern-search"></label>';
        foreach (['category'=>['Category',self::CATEGORIES],'testing'=>['Testing status',self::STATUSES],'type'=>['Provision type',self::TYPES]] as $key=>[$label,$options]) {
            $html.='<label for="pattern-'.$key.'">'.$label.'<select id="pattern-'.$key.'"><option value="">All</option>';
            foreach ($options as $value=>$text) $html.='<option value="'.self::e($value).'">'.self::e($text).'</option>';
            $html.='</select></label>';
        }
        $html.='<button type="button" id="pattern-reset">Reset filters</button><p id="pattern-status" role="status" aria-live="polite" aria-atomic="true"></p></div><div class="legal-matrix-scroll" role="region" aria-label="Governance patterns index" tabindex="0"><table class="legal-matrix-table" id="pattern-table"><caption>Governance patterns — research index</caption><thead><tr><th scope="col">Pattern</th><th scope="col">Category</th><th scope="col">Problem addressed</th><th scope="col">Provision type</th><th scope="col">Testing status</th></tr></thead><tbody>';
        foreach ($data['patterns'] as $p) $html.='<tr data-category="'.self::e($p['category']).'" data-testing="'.self::e($p['testing_status']).'" data-type="'.self::e($p['provision_type']).'"><th scope="row"><a href="#pattern-record-'.self::e($p['id']).'">'.self::e($p['title']).'</a></th><td>'.self::e(self::CATEGORIES[$p['category']]).'</td><td>'.self::e($p['problem']).'</td><td>'.self::e(self::TYPES[$p['provision_type']]).'</td><td>'.self::e(self::STATUSES[$p['testing_status']]).'</td></tr>';
        $html.='</tbody></table></div><h2>Pattern details</h2><p>The filters apply to the index; all patterns remain available below. Draft clauses contain placeholders for member decisions and require adaptation and legal review.</p>';
        foreach ($data['patterns'] as $p) {
            $html.='<details class="legal-matrix-record" id="pattern-record-'.self::e($p['id']).'"><summary>'.self::e($p['title']).'</summary><p><strong>Problem addressed:</strong> '.self::e($p['problem']).'</p>';
            foreach (['suitable_when'=>'When it may help','unsuitable_when'=>'When it may be unsuitable','how_it_works'=>'How it works','local_choices'=>'Choices for members','risks_and_safeguards'=>'Risks and safeguards'] as $field=>$label) $html.='<p><strong>'.$label.'</strong></p>'.self::list($p[$field]);
            $html.='<p><strong>Illustrative clause — '.self::e(self::STATUSES[$p['testing_status']]).'</strong></p><blockquote>'.self::e($p['draft_clause']).'</blockquote><p><strong>Accessibility:</strong> '.self::e($p['accessibility']).'</p><dl>';
            foreach (['Provision type'=>self::TYPES[$p['provision_type']],'Testing status'=>self::STATUSES[$p['testing_status']],'Last tested'=>$p['last_tested']??'Not yet tested','Reviewer'=>$p['reviewer']??'Not yet assigned','Next review'=>$p['review_due']??'Not scheduled','Legal review'=>str_replace('_',' ',$p['legal_review_status']),'Legal review date'=>$p['legal_reviewed_on']??'Not reviewed','Legal reviewer'=>$p['legal_reviewer']??'Not assigned','Legal review notes'=>$p['legal_review_notes']??'No review recorded','Generator readiness'=>$p['generator_ready']?'Ready':'Not ready — research only'] as $label=>$value) $html.='<dt>'.self::e($label).'</dt><dd>'.self::e($value).'</dd>';
            $html.='</dl><p><strong>Testing evidence</strong></p>';
            if (!$p['test_evidence']) $html.='<p>No field-testing evidence recorded. This is not a tested constitutional pattern.</p>';
            foreach ($p['test_evidence'] as $test) $html.='<p>'.self::e($test['date'].' — '.$test['context'].'; findings: '.$test['findings'].'; limitations: '.$test['limitations'].'; reference: '.$test['reference']).'</p>';
            $html.='<p><strong>Related legal research — not verified guidance</strong></p><ul>';
            foreach ($p['legal_record_ids'] as $id) $html.='<li><a href="/en/legal-matrix#legal-record-'.self::e($id).'">'.self::e(str_replace('-',' ',$id)).'</a></li>';
            $html.='</ul><p><strong>Sources</strong></p><ul>';
            foreach ($p['sources'] as $source) {
                $url=preg_match('~^(https://|/en/)~',$source['url'])?$source['url']:'#';
                $html.='<li><a href="'.self::e($url).'">'.self::e($source['title']).'</a> — '.self::e($source['locator']).'</li>';
            }
            $html.='</ul><p><strong>Change history</strong></p><ul>';
            foreach ($p['change_history'] as $change) $html.='<li>'.self::e($change['date'].' — '.$change['note']).'</li>';
            $html.='</ul></details>';
        }
        return $html.'</div>';
    }
    public static function markdown(): string
    {
        $data=self::load();$out='Dataset version '.$data['dataset_version'].'; edited '.$data['updated_at'].".\n\n";
        foreach ($data['patterns'] as $p) {
            $out.='## '.$p['title']."\n\n".$p['problem']."\n\nProvision type: ".self::TYPES[$p['provision_type']].'. Testing: '.self::STATUSES[$p['testing_status']].'. Legal review: '.$p['legal_review_status'].'. Generator ready: '.($p['generator_ready']?'yes':'no').".\n\n";
            foreach (['suitable_when'=>'When it may help','unsuitable_when'=>'When unsuitable','how_it_works'=>'How it works','local_choices'=>'Member choices','risks_and_safeguards'=>'Risks and safeguards'] as $field=>$label) $out.='### '.$label."\n\n- ".implode("\n- ",$p[$field])."\n\n";
            $out.="Illustrative draft clause:\n\n".$p['draft_clause']."\n\nAccessibility: ".$p['accessibility']."\n\nLast tested: ".($p['last_tested']??'Not yet tested').".\n\n";
            foreach ($p['legal_record_ids'] as $id) $out.='Related legal research: [/en/legal-matrix#legal-record-'.$id.'](/en/legal-matrix#legal-record-'.$id.")\n\n";
            foreach ($p['sources'] as $source) $out.='Source: ['.$source['title'].']('.$source['url'].")\n\n";
        }
        return $out;
    }
}
