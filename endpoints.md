# Endpoint Documentation

The current endpoints for this backend are described, below.

--------------------------------------------------------------------------------

## Authentication

Endpoints starting with `/api/auth` are related to the login/sign-up process.

### Register

**Endpoint**: `[POST] /api/auth/register`

**Input**: pass in an object containing the following registration information...

Key          | Type   | Required | Notes
------------ | ------ | -------- | -----------------------------------------------------------
username     | string | yes      | must be unqiue, and between 6-32 characters long
password     | string | yes      | must be between 8-64 characters long
email        | string | yes      | must be formatted as a real email (i.e. address@email.com)
emailConfirm | string | yes      | must match the email provided in the `email` field, exactly

**Output**: on success, returns an object in the following format...

```
{
  "message": "New user registered, successfully!",
  "user": {
    "email": "highking@windhelm.net",
    "user_id": 3,
    "username": "ulfric-stormcloak"
  }
}
```

### Login

**Endpoint**: `[POST] /api/auth/login`

**Input**: pass in an object containing the following login information

Key      | Type   | Required | Notes
-------- | ------ | -------- | ------------------------------------------
username | string | yes      | user must exist in the database
password | string | yes      | password must be valid for the target user

**Output**: on success, returns an object in the following format...

```
{
  "message": "Welcome, ulfric-stormcloak!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjozLCJ1c2VybmFtZSI6InVsZnJpYy1zdG9ybWNsb2FrIiwiZW1haWwiOiJoaWdoa2luZ0B3aW5kaGVsbS5uZXQiLCJpYXQiOjE2MzY4NTYwNDUsImV4cCI6MTYzNjg1NjM0NX0.FjboXxx-9hZFrogTM2Q3McWPqc8u7F0odJehfIQYQ-4"
}
```

--------------------------------------------------------------------------------

## Users

Endpoints starting with `/api/users` are for fetching user information.

### Get All Users

**Endpoint**: `[GET] /api/users`

**Output**: on success, returns an array of objects containing all the users in the database; this is for development purposes, and will likely go unused in the final release

```
[
  {
    "email": "willie@wonka.com",
    "password": "$2a$06$GpPRvzwBls/o5Ixmv9jgEOHgR6wL08EZCjMfd5uK4mOan7RtVdVlm",
    "user_id": 1,
    "username": "willie-wonka"
  },
  {
    "email": "pebbles@thecursediterator.net",
    "password": "$2a$06$JwUBB7BzdMC9XKaMu4dPp.ObsMjelOEfYqhvSm/bihtdIYNzBCNtm",
    "user_id": 2,
    "username": "five-pebbles"
  },
  {
    "email": "highking@windhelm.net",
    "password": "$2a$06$I/RDKeqftecWTrkfM/cML.kOHThOAQbeldYIiv7xqySbO7q.SRDvG",
    "user_id": 3,
    "username": "ulfric-stormcloak"
  }
]
```
