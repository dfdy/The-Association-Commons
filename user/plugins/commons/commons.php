<?php
namespace Grav\Plugin;
use Grav\Common\Plugin;
class CommonsPlugin extends Plugin
{
    public static function getSubscribedEvents(): array {return ['onPluginsInitialized'=>['redirectAliases',0],'onPageInitialized'=>['download',0]];}
    public function redirectAliases(): void
    {
        $path=rtrim(parse_url($_SERVER['REQUEST_URI']??'',PHP_URL_PATH)??'','/');
        if (in_array($path,['/donate','/languages','/stadgar','/white-paper','/privacy','/licence','/licence/content','/licence/software'],true)) {
            $query=$_SERVER['QUERY_STRING']??'';
            header('Location: /en'.$path.($query!==''?'?'.$query:''),true,302);exit;
        }
    }
    public function download(): void
    {
        $format=$_GET['download']??null;
        if (!in_array($format,['md','rtf','pdf'],true)||$this->isAdmin()) return;
        $page=$this->grav['page'];
        if (!$page->published() || !$page->routable() || !$page->isPage()) {http_response_code(404);exit;}
        $title=$page->title(); $markdown=$page->rawMarkdown();
        $export=new \RocketTheme\Toolbox\Event\Event(['markdown'=>$markdown]);
        $this->grav->fireEvent('onCommonsExportMarkdown',$export);
        $markdown=$export['markdown'];
        $markdown.="\n\nThe Democratic Development Commons · Content: CC BY-NC-SA 4.0 · https://creativecommons.org/licenses/by-nc-sa/4.0/\n";
        header('Cache-Control: private, no-store');header('X-Content-Type-Options: nosniff');
        header('Content-Disposition: attachment; filename="'.'democratic-development-commons'.'.'.$format.'"');
        if ($format==='md') {header('Content-Type: text/markdown; charset=utf-8');echo $markdown;exit;}
        if ($format==='rtf') {
            header('Content-Type: application/rtf');
            require_once __DIR__.'/FormattedRtf.php';
            echo FormattedRtf::render($markdown);exit;
        }
        require_once __DIR__.'/PdfExport.php';
        $theme=$_GET['pdf_theme']??$_COOKIE['tac-colour-mode']??'day';
        $theme=$theme==='night'?'night':'day';
        try {
            $document=PdfExport::document($page->content(),$title,
                (string)($page->header()->content_language??$page->header()->language_code??'en'),
                $theme,GRAV_ROOT,$page->path(),$this->grav['uri']->rootUrl(true),$page->url());
            $output=PdfExport::render($document);
            header('Content-Type: application/pdf');echo $output;
        } catch (\Throwable $error) {
            error_log('DDC PDF export failed: '.get_class($error));
            http_response_code(503);header_remove('Content-Disposition');
            header('Content-Type: text/plain; charset=utf-8');
            echo 'The PDF could not be created. Please try again, or use the Markdown or RTF download.';
        }
        exit;
    }
}
