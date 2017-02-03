// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  conf: {
    firebase: {
      apiKey: "AIzaSyBI2FvPhYYiBPWHm2zNXYk7M6QjC6c6A8M",
      authDomain: "rcv-dev.firebaseapp.com",
      databaseURL: "https://rcv-dev.firebaseio.com",
      storageBucket: "rcv-dev.appspot.com",
      messagingSenderId: "88594889604"
    }
  }
};
