import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { Auth } from 'aws-amplify';
import { UserResponse } from '../user-manage-list/User';
import { ARequest } from 'request/request';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
	selector: 'ms-organization-addedit',
	templateUrl: './add-user-component.html',
	styleUrls: ['./add-user-component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {

	public form: FormGroup;
	public config: AngularEditorConfig;
	public title = "Add new";
	public description: string;
	public id: string;
	companies: any;
	company: any;
	roles: any;
	fieldTextType: boolean = false;
	submitted = false;
	constructor(private fb: FormBuilder,
		private pageTitleService: PageTitleService,
		public translate: TranslateService,
		private router: Router,
		private toastr: ToastrService,
		private route: ActivatedRoute,
		private request: ARequest,
		private session: ASession) { }

	ngOnInit() {

		this.translate.get('User').subscribe((res: string) => {
			this.pageTitleService.setTitle(res);
		});

		this.form = this.fb.group({
			account: ['', [Validators.required]],
			email: ['', [Validators.required]],
			fullname: ['', [Validators.required]],
			password: ['',[Validators.required]],
			role: ['', [Validators.required]],
			company: ['', [Validators.required]]
		});
		this.id = null;
		this.route.params.subscribe(params => {
			this.id = params['id'];
		});

		if (this.id) {
			this.title = "Edit User " + this.id;
			this.request.get('/user/get/' + this.id).subscribe(users => {
				const user = users.Users.find(el => el.Username === this.id);
				this.company = {
					//id: user.Attributes.find(el => el.Name == "custom:oid").Value,
					name: user.Attributes.find(el => el.Name == "custom:company").Value,
				} 
				if (this.session.role != 'ACCENCIOADMIN') {
					this.company = {
						//id: user.Attributes.find(el => el.Name == "custom:oid").Value,
						name: this.session.company
					}
				}
				this.form.setValue({
					password: null,
					fullname: user.Attributes.find(el => el.Name == "given_name").Value,
					company: user.Attributes.find(el => el.Name == "custom:company").Value,
					account: user.Username,
					email: user.Attributes.find(el => el.Name == "email").Value,
					role: user.Attributes.find(el => el.Name == "custom:g1").Value,
				});
			});
		}
		if (this.session.role === 'ACCENCIOADMIN') {
			this.request.get('/org/all').subscribe(
				result => {
					this.companies = result;
				}
			);
			this.roles = [
				{ name: 'ACCENCIOADMIN' },
				{ name: 'CLIENTADMIN' },
				{ name: 'USER' }
			]
		} else {
			this.companies = [{ name: this.session.company }];
			this.roles = [
				{ name: 'CLIENTADMIN' },
				{ name: 'USER' }
			]
		}
	}



	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}
	onSubmit() {
		if (!this.id)
			this.add();
		else
			this.edit();
	}
	add() {
		this.submitted = true;
		if (!this.form.valid) {
			return;
		}
		this.submitted = false;
		let oid = this.session.oid;

		if (this.session.role === 'ACCENCIOADMIN') 
			oid = this.form.value.company.id;
			
		const user = {
			username: this.form.value.account,
			password: this.form.value.password,
			attributes: {
				email: this.form.value.email,
				given_name: this.form.value.fullname,
				'custom:company': this.form.value.company.name,
				'custom:g1': this.form.value.role,
				'custom:oid': oid
			}
		}
		Auth.signUp(user)
			.then(data => {
				this.toastr.success('User has been added.');
				this.router.navigate(['/user'])
			})
			.catch(err => {
				console.log(err);
				debugger;
				if (err.code == 'InvalidParameterException') {
					//this.toastr.error(err.message);
					this.form.setErrors({code: err.message}); 
				}
				if (err.code == 'InvalidPasswordException') {
					//this.toastr.error(err.message);
					this.form.setErrors({code: err.message}); 
				}
			});
	}

	edit() {
		debugger;
		this.request.post('/user/update',
			{
				username: this.form.value.account,
				givenname: this.form.value.fullname,
				company: this.company.name,
				role: this.form.value.role,
				email: this.form.value.email,
			}).subscribe(res => {
				this.toastr.success('User has been updated.');
				this.router.navigate(['/user'])
			});

	}
}



