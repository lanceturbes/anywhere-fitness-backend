# Endpoint Documentation

The current endpoints for this backend are described, below.

At the time of writing, the API is currently [live on Heroku](https://anywhere-fitness-bwft5.herokuapp.com/)! Just append an endpoint of choice to the URL (for example, <https://anywhere-fitness-bwft5.herokuapp.com/api/users> if you want to get the list of all registered users).

--------------------------------------------------------------------------------

## Authentication

Endpoints starting with `/api/auth` are related to the login/sign-up process.

### Register

**Endpoint**: `[POST] /api/auth/register`

**Input**: pass in an object containing the following registration information...

Key          | Type   | Required | Notes
------------ | ------ | -------- | -----------------------------------------------------------
first_name   | string | yes      | must be between 3-64 characters long
last_name    | string | yes      | must be between 3-64 characters long
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
    "name": "Ulfric Stormcloak",
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

## Classes

Endpoints starting with `/api/classes` are related to fitness class information.

### Get All Classes

**Endpoint**: `[GET] /api/classes`

**Output**: returns an array of fitness class objects

```
[
  ...
  {
    "attendees": 11,
    "class_id": 9,
    "duration": 30,
    "instructor": "Mr. Miyagi",
    "intensity": "low",
    "location": "Fancy Gardens",
    "max_class_size": 20,
    "name": "Zen Fitness",
    "start_time": "08:00",
    "type": "Yoga"
  },
  {
    "attendees": 18,
    "class_id": 10,
    "duration": 60,
    "instructor": "Intensity Man",
    "intensity": "high",
    "location": "Muscle Gym",
    "max_class_size": 35,
    "name": "Shredders",
    "start_time": "13:00",
    "type": "Strength Training"
  }
  ...
]
```

### Get Class By ID

**Endpoint**: `[GET] /api/classes/:id`

**Parameters**: `:id` must be an integer representing the class ID

**Output**: returns an object containing information for a single fitness class

```
{
  "attendees": 18,
  "class_id": 10,
  "duration": 60,
  "instructor": "Intensity Man",
  "intensity": "high",
  "location": "Muscle Gym",
  "max_class_size": 35,
  "name": "Shredders",
  "start_time": "13:00",
  "type": "Strength Training"
}
```

### Create New Class

**Endpoint**: `[POST] /api/classes`

**Input**: pass in an object with the following properties...

Key            | Type    | Required | Notes
-------------- | ------- | -------- | -------------------------------------------
instructor_id  | integer | yes      | ID of the instructor to assign the class to
name           | string  | yes      | must be between 5-64 characters long
type           | integer | yes      | represents the fitness class category ID
start_time     | string  | yes      | must be in `00:00` format
duration       | integer | no       | time in minutes; defaults to 60
intensity      | string  | yes      | must be either `low`, `medium`, or `high`
location       | string  | yes      | must be between 6-128 characters long
max_class_size | integer | no       | defaults to 30

**Output**: returns a success message and the newly created class

```
{
  message: "Class created successfully!",
  class: {
    "class_id": 12,
    "duration": 100,
    "instructor_id": 1,
    "intensity": "high",
    "location": "Koopa Troopa Beach",
    "max_class_size": 50,
    "name": "Koopa's Circuit",
    "start_time": "05:00",
    "type": "Cardio"
  }
}
```

### Edit Class Details

**Endpoint**: `[PUT] /api/classes/:id`

**Parameters**: `:id` must be an integer representing a class_id

**Input**: pass in an object containing **ALL** of the following...

Key            | Type    | Notes
-------------- | ------- | -----------------------------------------
name           | string  | must be between 5-64 characters long
type           | integer | represents the fitness class category ID
start_time     | string  | must be in `00:00` format
duration       | integer | time in minutes; defaults to 60
intensity      | string  | must be either `low`, `medium`, or `high`
location       | string  | must be between 6-128 characters long
max_class_size | integer | defaults to 30

**Output**: returns a success message and the updated records

```
{
  message: "Class edited successfully!",
  class: {
    "duration": 60,
    "intensity": "medium",
    "location": "Koopa Troopa Beach",
    "max_class_size": 30,
    "name": "Troopa's Circuit",
    "start_time": "08:00",
    "type": "Cardio"
  }
}
```

### Delete Class

**Endpoint**: `[DELETE] /api/classes/:id`

**Parameters**: `:id` must be an integer; represents `class_id`

**Output**: returns a success message and the name/id of the deleted class

```
{
  message: "Class deleted successfully!",
  class: {
    "class_id": 12,
    "name": "Koopa's Circuit"
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
