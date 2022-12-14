import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ASession } from 'request/session';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ARequest } from 'request/request';
import { Observable } from 'rxjs';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
   selector: 'ms-workbook-addedit',
   templateUrl:'./add-component.html',
   styleUrls: ['./add-component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class AddComponent implements OnInit {

	public  form : FormGroup;
	public config: AngularEditorConfig;
	public title = "Add new";
	public description: string;
	private id: string;
  	constructor(private fb: FormBuilder,
               private pageTitleService: PageTitleService,
			   public translate: TranslateService,
			   private router: Router,
			   private toastr: ToastrService,
			   private route: ActivatedRoute,
			   private request: ARequest,
               private session: ASession) {}

  	ngOnInit() {

		this.config = {
			editable: true,
			spellcheck: true,
			height: '15rem',
			minHeight: '5rem',
			placeholder: 'Enter text here...',
			translate: 'no',
			customClasses: [
			  {
				name: "quote",
				class: "quote",
			  },
			  {
				name: 'redText',
				class: 'redText'
			  },
			  {
				name: "titleText",
				class: "titleText",
				tag: "h1",
			  },
			]
		  };
      this.translate.get('Workbooks').subscribe((res: string) => {
        this.pageTitleService.setTitle(res);
      });

    	this.form = this.fb.group({
			  title: [null, Validators.compose([Validators.required])],
			  name: [null, Validators.compose([Validators.required])],
			  description: [null, Validators.compose([Validators.required])],
			  type: [null],
			  account: [null],
			  analysis: [null],
			  content: [null],
			  date:[null],
			  id:[null],
			  site:[null]
		});
		
		this.route.params.subscribe(params => {
			this.id = params['id'];
			});
			
			if (this.id) {
				this.title = "Edit " + this.id;
				this.request.get('/wb/byid/' + this.id).subscribe(
					res=> {
						this.form.setValue(res);
					}
				) 
			}
	  }  
	  
	  onSubmit() {
		  console.log(this.form.value.id);
		  if (!this.form.value.id)
			  this.add();
		  else
		  	this.edit(); 	  
	  }
	add() {
		const id = '_' + Math.random().toString(36).substr(2, 9);
		this.request.post('/wb/add',
		{
		  id: id,
		  name: this.form.value.name,
		  title: this.form.value.title,
		  description: this.form.value.description,
		  date: new Date(),
		  account: this.form.value.account,
		  analysis: this.form.value.analysis,
		  content: this.form.value.content,
		  type: this.form.value.type,
		  site: this.form.value.site
		}).subscribe(res=> {
		  this.toastr.success('Workbook has been added.');
		  this.logmessage(id, 'Workbook ' + this.form.value.title + ' added').subscribe(res => {
			this.router.navigate(['/workbooks/list']);
		  })
		});
	}

	edit() {
		this.request.post('/wb/update', 
		{
		  id:  this.form.value.id,
		  name: this.form.value.name,
		  title: this.form.value.title,
		  description: this.form.value.description,
		  date: new Date(),
		  account: this.form.value.account,
		  analysis: this.form.value.analysis,
		  content: this.form.value.content,
		  type: this.form.value.type,
		  site: this.form.value.site
		}).subscribe(res=> {
		  this.toastr.success('Workbook has been updated.');
		  this.logmessage(this.form.value.id, 'Workbook ' + this.form.value.title + ' updated').subscribe(res => {
			this.router.navigate(['/workbooks/list']);
		  })
		});
	}
	logmessage(refId, msg): Observable<any> {
		return this.request.post('/message/add', {
			id:  '_' + Math.random().toString(36).substr(2, 9),
			org: this.session.company,
			orgid: this.session.oid,
			type: 'n',
			wb: refId,
			date: new Date(),
			from1:'',
			to: '',
			status: 1,
			msg: msg
		  });
	}
}



