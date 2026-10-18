<?php
namespace Grav\Plugin\LanguageSuggestions;
use Grav\Plugin\Api\Controllers\AbstractApiController;
use Grav\Plugin\Api\Exceptions\NotFoundException;
use Grav\Plugin\Api\Response\ApiResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
require_once __DIR__.'/SubmissionStore.php';
final class AdminController extends AbstractApiController
{
    private function store(): SubmissionStore {return new SubmissionStore(GRAV_ROOT.'/user/data/commons-private/language-suggestions');}
    public function index(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireSuper($request);
        $query=$request->getQueryParams();
        $page=max(1,(int)($query['page']??1));
        $search=is_string($query['q']??null)?mb_substr(trim($query['q']),0,120):'';
        $days=max(1,(int)$this->config->get('plugins.language-suggestions.retention_days',90));
        $records=$this->store()->records($days);
        if ($search!=='') $records=array_values(array_filter($records,static fn($r)=>mb_stripos(implode(' ',[$r['name'],$r['code']]),$search)!==false));
        return ApiResponse::create(['records'=>array_slice($records,($page-1)*25,25),'total'=>count($records),'page'=>$page,'per_page'=>25,'retention_days'=>$days])->withHeader('Cache-Control','private, no-store');
    }
    public function delete(ServerRequestInterface $request): ResponseInterface
    {
        $this->requireSuper($request);
        $id=$this->getRouteParam($request,'id');
        if (!$this->store()->delete($id)) throw new NotFoundException('Submission not found.');
        return ApiResponse::create(['deleted'=>true])->withHeader('Cache-Control','private, no-store');
    }
}
