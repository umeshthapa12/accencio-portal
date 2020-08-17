import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Auth, Hub } from 'aws-amplify';
import { ASession } from 'request/session';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { keyValuesToMap } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { ARequest } from 'request/request';


@Injectable({
   providedIn: 'root'
})
export class AuthService {

   userData: any;
   isLoggedIn = false;

   public fed1_mapping = [{
      src: "27bdb1cb-dd0e-40d0-80ba-62fe76226851",
      dest: "USER"
   }, {
      src: "b6ac1289-7913-465b-b23e-b982110e26e6",
      dest: "CLIENTADMIN"
   }
   ]

   constructor(private router: Router,
      private http: HttpClient,
      private request: ARequest,
      private session: ASession,
      private toastr: ToastrService) {
   }

   /*
    *  getLocalStorageUser function is used to get local user profile data.
    */
   getLocalStorageUser() {
      this.userData = JSON.parse(localStorage.getItem("userProfile"));
      if (this.userData) {
         this.isLoggedIn = true;
         return true;
      } else {
         this.isLoggedIn = false;
         return false;
      }
   }

   /*
* signupUserProfile method save email and password into firabse &
* signupUserProfile method save the user sign in data into local storage.
*/
   signupUserProfile(value) {
      const authInfo = {
         username: value.account,
         password: value.password
      };

      Auth.signIn(authInfo).then(user => {
         this.setLocalUserProfile(value);
         this.router.navigate(['/']);
      })
         .catch(err => this.toastr.error(err.message));
   }

   /*
    * loginUser fuction used to login.
    */
   loginUser(value) {
      const authInfo = {
         username: value.fname,
         password: value.password
      };
      Auth.signIn(authInfo).then(user => {
         //this.getUserInfo();

         this.setLocalUserProfile(value);

         Auth.currentAuthenticatedUser().then(au => {
            this.session.isLogged = true;
            this.session.id_token = au.signInUserSession.idToken.getJwtToken();
            this.session.username = au.username;
            this.session.name = au.attributes['given_name'];
            this.session.company = au.attributes['custom:company'];
            this.session.role = au.attributes['custom:g1'];
            this.toastr.success('You have been successfully logged In');
            this.router.navigate(['/home']);
         });
      })
         .catch(err => this.toastr.error(err.message));
   }

   fed1() {
      Auth.federatedSignIn({
         customProvider: 'acc1'
      }).then(fuser => {
         debugger;
      }

      ).catch(x =>
         console.log(x))
   }
   /*
    * resetPassword is used to reset your password.
    */
   resetPassword(value): Observable<any> {
      return this.request.post('/user/forgot-password',
         {
            username: value
         });
   }

   confirmCode(username, code, password): Observable<any> {
      return this.request.post('/user/confirm-code',
         {
            username: username,
            code: code,
            password: password
         });
   }

   /*
    * logOut function is used to sign out .
    */
   async logOut() {
      await Auth.signOut();
      localStorage.removeItem("userProfile");
      this.isLoggedIn = false;
      this.toastr.success("You have been successfully logged out.");
      this.router.navigate(['/session/loginone']);
   }

   /*
    * setLocalUserProfile function is used to set local user profile data.
    */
   public setLocalUserProfile(value) {
      localStorage.setItem("userProfile", JSON.stringify(value));
      this.isLoggedIn = true;
   }

   public async getUserInfo2() {

      var au = await Auth.currentAuthenticatedUser();
      if (!au)
         return;
      this.session.isLogged = true;
      this.session.id_token = au.signInUserSession.idToken.getJwtToken();
      this.session.username = au.username;
      this.session.name = au.attributes['given_name'];
      this.session.company = au.attributes['custom:company'];
      if (this.session.isSSO) {
         const role = this.fed1_mapping.find(el => {
            const s = el.src;
            return (au.attributes['custom:g1'] as any[]).includes(s)
         });

         if (role)
            this.session.role = role.dest;

      } else {

         this.session.role = au.attributes['custom:g1'];

      }
   }
   public async getOrg() {
      if (this.session.oid)
         return;
      var au = await Auth.currentAuthenticatedUser();
      if (!au)
         return;
      const rperm2 = this.request.get('/org/byname/' + this.session.company);
      rperm2.subscribe(orgs => {
      });
      const rperm = this.request.get('/org/all/');
      rperm.subscribe(orgs => {
         const org = (orgs as any[]).find(e => e.name === this.session.company);
         this.session.oid = org.id;
      })
   }
}
