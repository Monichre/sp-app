import * as firebase from 'firebase'

export const createFirebase = (config: Object) => {
  const app = firebase.initializeApp(config)
  console.log('initialized', app)
  console.log('app auth', app.auth())
  return app
}
