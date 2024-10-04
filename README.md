# Quiz website Firebase

- register ( Both admin and User )
- login
- logout
- Forgot password
- email verification
- dashboard
- mcq question
- results for admin
- Creating New Quiz
- Adding Questions to Quiz
- Admin Edit Quiz & Questions
- download report

- react-router-dom
- scss
- react-helmet
- firebase
- dotenv
- react-hot-toast
- antd

## Routes

Base URL : `http://localhost:3000/`

To become Admin : `/admin/register`

To become Authorised user : `/login`

## Routes

| Route                       | Description                             | Access                |
| --------------------------- | --------------------------------------- | --------------------- |
| `/dashboard/admin`          | Admin dashboard page                    | Admin only            |
| `/dashboard/admin/question` | Admin question management page          | Admin only            |
| `/dashboard/admin/add-quiz` | Admin add quiz page                     | Admin only            |
| `/dashboard/admin/result`   | Admin result page                       | Admin only            |
| `/user-questions/:qid`      | User question page for a specific quiz  | Authorized users only |
| `/user-answer/:qid`         | User answer page for a specific quiz    | Authorized users only |
| `/user-rules/:qid`          | User rules page for a specific quiz     | Authorized users only |
| `/profile`                  | User profile page                       | Authorized users only |
| `/home`                     | Home page                               | Authorized users only |
| `/`                         | Landing page                            | Public access         |
| `/login`                    | Login page                              | Public access         |
| `/register`                 | Register page                           | Public access         |
| `/admin/register`           | Admin registration page                 | Public access         |
| `/admin/login`              | Admin login page                        | Public access         |
| `/forgot-pass`              | Forgot password page                    | Public access         |
| `/reset-pass`               | Password reset page                     | Public access         |
| `/*`                        | Catch-all page for any undefined routes | Public access         |

