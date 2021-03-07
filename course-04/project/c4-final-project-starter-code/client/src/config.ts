// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `http://${apiId}.execute-api.ca-central-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-acdm1d40.us.auth0.com',            // Auth0 domain
  clientId: 'FDcOx0l6RQqmQIk1x6594cUdjUAiiBGC',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
