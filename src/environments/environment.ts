// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_GATEWAY: 'https://hmdz1lq98a.execute-api.us-east-1.amazonaws.com/Prod',
  //API_GATEWAY: 'https://api.accencio.com',
  TABLEAU_API: 'https://visualize.accencio.com',
  SPOTFIRE_API: 'https://visualizer.accencio.com/spotfire/wp/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
