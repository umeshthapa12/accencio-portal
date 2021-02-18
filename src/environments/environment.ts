// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_GATEWAY: 'https://87io963525.execute-api.us-east-1.amazonaws.com/Stage',
  // TABLEAU_API: 'http://18.214.214.157',
  // SPOTFIRE_API: 'http://52.203.6.121/spotfire/wp'
  TABLEAU_API: 'https://apps.accencio.com',
  SPOTFIRE_API: 'https://apps.accencio.com/spotfire/wp'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
