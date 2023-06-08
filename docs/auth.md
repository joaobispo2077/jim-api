# 3 main ways

## Basic Auth

Send username and password in every request on header as base64 encoded string

Should be use only with HTTPS.

## JWT

The user logs in and sends an email/password. The backend creates a UNIQUE, unmodifiable, and STATELESS token.

Stateless: It does not store anything on the server, no session, no database, or any persistence structure.

Backend: When creating the token, it uses a KEYWORD.


## API keys

They are used for machine-to-machine authentication, meaning authentication between backends.