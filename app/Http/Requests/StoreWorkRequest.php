<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkRequest extends FormRequest {
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool {
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array {
		$languages = 'aa,ab,ae,af,ak,am,an,ar,as,av,ay,az,ba,be,bg,bh,bi,bm,bn,bo,br,bs,ca,ce,ch,co,cr,cs,cu,cv,cy,da,de,dv,dz,ee,el,en,eo,es,et,eu,fa,ff,fi,fj,fo,fr,ga,gd,gl,gn,gu,gv,ha,he,hi,ho,hr,ht,hu,hy,hz,ia,id,ie,ig,ii,ik,io,is,it,iu,ja,jv,ka,kg,ki,kj,kk,kl,km,kn,ko,kr,ks,ku,kv,kw,ky,la,lb,lo,lt,lu,lv,mg,mh,mk,ml,mn,mr,ms,mt,my,na,nb,nd,ne,nl,nn,no,nr,nv,ny,oc,oj,om,or,os,pa,pi,pl,ps,pt,qu,rm,rn,ro,ru,rw,se,sg,si,sk,sl,sm,sn,so,sq,sr,ss,st,su,sv,sw,ta,te,tg,th,ti,tk,tl,tn,to,tr,ts,tt,tw,ty,ug,uk,ur,uz,ve,vi,vo,wa,wo,xh,yi,yo,za,zh,zu';

		return [
			'title' => 'required|string|min:1|max:255',
			'description' => 'nullable|string|max:2000',
			'status_publication' => 'nullable|in:unknown,ongoing,completed,hiatus,cancelled',
			'status_reading' => 'required|in:reading,completed,on hold,dropped',
			'author' => 'nullable|string|max:255',
			'language_original' => 'nullable|string|in:' . $languages,
			'language_translated' => 'nullable|string|in:' . $languages,
			'publication_year' => 'nullable|integer|min:-5000|max:5000',
			'image' => 'nullable|string|max:255',
			'tags' => 'nullable|string|max:1000',
			'links' => 'nullable|string|max:3000',
		];
	}
}
