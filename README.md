[![Build Status](https://travis-ci.org/AncesTree/AncesTree-Auth.svg?branch=master)](https://travis-ci.org/AncesTree/AncesTree-Auth)
# AncesTree-Auth

##### post /auth/login 
{email, password}
##### post /auth/register 
{email, password}
##### get /auth/checktoken 
{token}

##### post /invitation 
{email, firstname, lastname}
##### get /invitation/check 
{id}
##### put /invitation 
{id, email, password}

##### get /oauth/authorize 
##### get /oauth/callback
##### get /oauth/linkedinprofile
##### get /oauth/email
##### get /oauth/profilepicture

##### get /users 
{id}
