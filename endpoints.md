# Endpoint Documentation

The current endpoints for this backend are described, below.

At the time of writing, the API is currently [live on Heroku](https://anywhere-fitness-bwft5.herokuapp.com/)! Just append an endpoint of choice to the URL (for example, <https://anywhere-fitness-bwft5.herokuapp.com/api/users> if you want to get the list of all registered users).

--------------------------------------------------------------------------------

## Authentication

Endpoints starting with `/api/auth` are related to the login/sign-up process.

### Register

**Endpoint**: `[POST] /api/auth/register`

**Input**: pass in an object containing the following registration information...

Key             | Type   | Required | Notes
--------------- | ------ | -------- | -------------------------------------------------------------
first_name      | string | yes      | must be between 3-64 characters long
last_name       | string | yes      | must be between 3-64 characters long
username        | string | yes      | must be unqiue, and between 6-32 characters long
password        | string | yes      | must be between 8-64 characters long
email           | string | yes      | must be formatted as a real email (i.e. address@email.com)
instructor_auth | string | no       | if correct, will register the user with an instructor account

**Output**: on success, returns an object in the following format...

```
{
  "message": "New user registered, successfully!",
  "user": {
    "id": 4,
    "name": "Super Mario",
    "username": "supermario",
    "email": "supermario@gmail64.net"
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
  "message": "Welcome, supermario!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo0LCJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InN1cGVybWFyaW8iLCJlbWFpbCI6InN1cGVybWFyaW9AZ21haWw2NC5uZXQiLCJyb2xlX2lkIjoyLCJpYXQiOjE2MzcxMTc3NDIsImV4cCI6MTYzNzExODA0Mn0.cyytmVUTViGJ5cQhFozDlHIL-fuZ75ZBrijc-uu0RWI",
  "user": {
    "id": 4,
    "name": "Super Mario",
    "username": "supermario",
    "email": "supermario@gmail64.net",
    "role_id": 2
  }
}
```

--------------------------------------------------------------------------------

## Classes

Endpoints starting with `/api/classes` are related to fitness class information.

### Get All Classes

**Endpoint**: `[GET] /api/classes`

**Output**: returns an array of fitness class objects

```
[
  {
    "attendees": 47,
    "id": 1,
    "duration": 120,
    "instructor": "John Snow",
    "intensity": "high",
    "location": "The Wall",
    "max_class_size": 64,
    "name": "Castle Black Combat",
    "start_time": "06:00:00",
    "type": "strength"
  },
  {
    "attendees": 16,
    "id": 2,
    "duration": 40,
    "instructor": "Wayward Pooch",
    "intensity": "medium",
    "location": "Koopa Troopa Beach",
    "max_class_size": 32,
    "name": "Pooch's Run",
    "start_time": "10:00:00",
    "type": "endurance"
  }
]
```

### Get Class By ID

**Endpoint**: `[GET] /api/classes/:id`

**Parameters**: `:id` must be an integer representing the class ID

**Output**: returns an object containing information for a single fitness class

```
{
  "attendees": 47,
  "id": 1,
  "duration": 120,
  "instructor": "John Snow",
  "intensity": "high",
  "location": "The Wall",
  "max_class_size": 64,
  "name": "Castle Black Combat",
  "start_time": "06:00:00",
  "type": "strength"
}
```

### Create New Class

This endpoint is protected; you must send your requests with a login token in the request header, and that token must be valid (not expired, correctly formatted) and for a user account registered as an instructor. If you are not an instructor, you will receive an `access denied` message.

**Endpoint**: `[POST] /api/classes`

**Input**: pass in an object with the following properties; optional arguments will be automatically filled in with the default values specified if left empty...

Key            | Type    | Required | Default | Notes
-------------- | ------- | -------- | ------- | ------------------------------------------------
name           | string  | yes      |         | must be between 5-64 characters long
type           | integer | yes      |         | represents a fitness class category ID (INT 1-5)
start_time     | string  | yes      |         | must be in `00:00:00` format
duration       | integer | no       | 60      | time in minutes; must be between 15-1440
intensity      | integer | yes      |         | must be either 1 (low), 2 (medium), or 3 (high)
location       | string  | yes      |         | must be between 6-128 characters long
max_class_size | integer | no       | 30      | must be between 5-200 characters long

**Notes**: The fitness class categories/types are as follows...

ID | Category Name
-- | -------------
1  | Balance
2  | Endurance
3  | Flexibility
4  | Meditation
5  | Strength

**Output**: returns a success message and the newly created class

```
{
  "message": "Class created successfully!",
  "newClass": {
    "attendees": 0,
    "id": 3,
    "duration": 60,
    "instructor": "Super Mario",
    "intensity": "low",
    "location": "Your Happy Place",
    "max_class_size": 30,
    "name": "Best Class Ever",
    "start_time": "17:00:00",
    "type": "meditation"
  }
}
```

--------------------------------------------------------------------------------

## Users

Endpoints starting with `/api/users` are for fetching user information.

### Get All Users

**Endpoint**: `[GET] /api/users`

**Output**: on success, returns an array of objects containing all the users in the database; this is for development purposes, and will likely go unused in the final release (the users depicted are not real -- they are listed for demonstrational purposes)

```
[
  {
    "email": "willie@wonka.com",
    "name": "Willie Wonka",
    "user_id": 1,
    "username": "willie-wonka"
  },
  {
    "email": "pebbles@thecursediterator.net",
    "name": "Five Pebbles",
    "user_id": 2,
    "username": "five-pebbles"
  },
  {
    "email": "highking@windhelm.net",
    "name": "Ulfric Stormcloak",
    "user_id": 3,
    "username": "ulfric-stormcloak"
  }
]
```

### Get User By ID

**Endpoint**: `[GET] /api/users/:id`

**Parameters**: `:id` must be an integer

**Output**: if a user with the id provided in the URL parameter exists, their information will be outputted as an object in the following format...

```
{
  "email": "highking@windhelm.net",
  "name": "Ulfric Stormcloak",
  "user_id": 3,
  "username": "ulfric-stormcloak"
}
```
