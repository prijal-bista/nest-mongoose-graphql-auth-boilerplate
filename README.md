# Authentication boiler plate using

- **NestJs**
- **MongoDB**
- **GraphQl**
- **Redis** (used for queuing jobs)

#### Features:

- Register (using email and password)
- Email Verification (User is blocked until email is verified, option of resending verificaiton email which is throttled to 10 requests per minute)
- Login (uses passport-jwt)
- Get User Details (protected by jwt auth guard )
- Change password (protected by jwt auth guard )
- Forgot Password ( throttling set to 10 requests per minute can be changed from .env variables)

> There is no logout because when creating jwt token, expiry is set to 30 minutes from the time jwt is created. This expiry time can be configured from .env with `JWT_EXPIRY_SECONDS` variable

#### Information about some of the packages used.

- `bull` used for queuing jobs (uses redis).
- `apollo` for graphql
- `passport-jwt` for generating and verifying jwt tokens for auth
- `@nestjs-modules/mailer` for mails which configured with `handlebar` for mail templates
- `joi` used only for `.env` validation and `class-validator` used for all other graphql input validations
- `husky` is setup with a simple pre-commit hook that runs `npm run lint`

#### Quick Setup

Requirements:

- NodeJs
- MongoDB: Either install and setup mongodb, or use docker image instead
  ```bash
  docker run --name mongo -p 27017:27017 -d mongo
  ```
  For interacting with mongodb from gui u can use tools like `robo3t` now renamed to `studio3t` or `compass`.
- Redis: Either install redis, or use docker image instead
  ```bash
  docker run -p 6379:6379 --name redisqueue -d redis
  ```

Setup:

1. Clone the repo
2. Install dependencies

```bash
   npm install
```

3. Copy `.env.example` to `.env` and set all the required values. The required and optional values for `.env` are determined from `src/config/env-validation.schema.ts` file.

4. Start server

```bash
npm run start:dev
```

5. Visit `http://localhost/3000/graphql` for graphql playground.

#### Some info about .env variables

- `QUEUE_CONNECTION` has 2 options:

  - `sync` option will cause mail related jobs to bypass queue and process job directly.[Implemented in mail module]
  - `redis` option will cause mail related jobs to get pushed in `mail` queue with name of `send-mail` in redis. Response will be instantaneous. These job will be later handled by our mail processor (`src/mail/mail.processor.ts`).

- `THROTTLE_TTL` and `THROTTLE_LIMIT` can be used to set the throttlers ttl and limit respectively. These configuration will effect only the mutations/queries which have used `GqlThrottlerGuard` i.e ` @UseGuards(GqlThrottlerGuard)`.

### Graphql query and mutation examples:

- Register

```graphql
mutation {
  register(
    registerInput: {
      name: "John Doe"
      email: "johndoe@mailinator.com"
      password: "Password@1"
      passwordConfirmation: "Password@1"
    }
  ) {
    message
  }
}
```

> Confirmation email will be sent once after successful register.

- Resend Confirmation email

```graphql
mutation {
  resendVerificationEmail(
    resendVerificationEmailInput: { email: "ram113@mailinator.com" }
  ) {
    message
  }
}
```

- Confirm Email
  > token for reset password can be retrieved from the url sent to email which is of form `FRONTEND_URL/:token/verify

```graphql
mutation {
  confirmEmail(
    confirmEmailInput: {
      token: "6fb59681f3dcfcbe3d519caa7bdcb55e42541073072ab2589c623ad8112e1a3a"
    }
  ) {
    message
  }
}
```

- Login

```graphql
mutation {
  login(
    loginInput: { email: "johndoe@mailinator.com", password: "Password@1" }
  ) {
    accessToken
    user {
      name
      emailVerifiedAt
    }
  }
}
```

- Get User Details
  > Authorization header with Bearer token is required here.

```graphql
query {
  getUser {
    name
    email
    roles
  }
}
```

- Change Password
  > Authorization header with Bearer token is required here.

```graphql
mutation {
  changePassword(
    changePasswordInput: {
      currentPassword: "Password@1"
      newPassword: "Password@2"
      newPasswordConfirmation: "Password@2"
    }
  ) {
    message
  }
}
```

- Forgot Password Email

```graphql
mutation {
  sendForgotPasswordEmail(
    forgotPasswordInput: { email: "johndoe@mailinator.com" }
  ) {
    message
  }
}
```

- Reset Password
  > token for reset password can be retrieved from the url sent to email which is of form `FRONTEND_URL/:token/reset

```graphql
mutation {
  resetPassword(
    resetPasswordInput: {
      token: "e0854273bdb8b5b7b25fa15e6b38cdc32a01744a43cbef414648a364155d840d"
      newPassword: "Test@1234"
      passwordConfirmation: "Test@1234"
    }
  ) {
    message
  }
}
```
