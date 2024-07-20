# Run npm start to start the server.

## It must run along side with problem 2.

JSON

POST /users/register

       {
    		"name":"Test",
        	"email":"test@example.com",
        	"password":"Asdfghj1$"
       }

POST /users/login
{
"email":"test@example.com",
"password":"Asdfghj1$"
}

POST /users/logout

Response as user logging in or register:

    {
        "user":  {

        "_id":  "6676d3d3d20200f1dba42e73",
        "name":  "Test",
        "email":  "test@example.com",
        "age":  0,
        "createdAt":  "2024-06-22T13:38:27.375Z",
        "updatedAt":  "2024-06-22T13:47:55.995Z",
        "__v":  6
    },

    "token":  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Njc2ZDNkM2QyMDIwMGYxZGJhNDJlNzMiLCJpYXQiOjE3MTkwNjQwNzV9.X7PfUnDGdWzyVYB7s0JUSbcLKTuN7DLzodAQ8gEV838"
    }

    Use current Bearer Token required to make an action logout which generated during login or register.

POST /users/logoutAll

    Use current Bearer Token to Delete all Bearer Token which generated for many devices user has logged in.

GET /users/me

    Use current Bearer Token to get user information.

DELETE /users/me

    Use current Bearer Token to delete user all information.

POST /users/me/avatar

    Use current Bearer Token to upload user avatar (png supported).

GET /users/:id/avatar

    Use current Bearer Token to get user avatar.

DELETE /users/:id/avatar

    Use current Bearer Token to delete user avatar.

All route require user logged in along with Bearer Token.

POST /tasks

    {

        "description":  "Todo",

        "completed":  false

    }

GET /tasks

    Get all tasks user has created, can use query:
    ?completed=true&sortBy=desc&limit=2&skip=1

GET /tasks/:id

    As user created a task with Response:
    	{

    "_id":  "6676dc24864065f40438cbd2",

    "description":  "Todo",

    "completed":  false,

    "owner":  "6676d3d3d20200f1dba42e73",

    "createdAt":  "2024-06-22T14:13:56.201Z",

    "updatedAt":  "2024-06-22T14:13:56.201Z",

    "__v":  0

    }

    use _id to get only one task.

PATCH /tasks/:id

    use _id to edit one task.

DELETE /tasks/:id

    use _id to delete one task.
