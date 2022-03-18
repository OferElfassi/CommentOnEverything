<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/OferElfassi/CommentOnEverything">
    <img src="https://user-images.githubusercontent.com/13490629/159046292-1b047452-1946-4421-9345-64e1ca377497.png" alt="Logo">
  </a>

<h3 align="center">COE - Backend</h3>

  <p align="center">
    Comment on Everything social media backend
    <br />
    <a href="https://documenter.getpostman.com/view/17936847/UVkjwJ2j"><strong>Explore the API docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/OferElfassi/coe-fe">Frontend repo</a>
    ·
    <a href="https://github.com/OferElfassi/CommentOnEverything/issues">Report Bug</a>
    ·
    <a href="https://github.com/OferElfassi/CommentOnEverything/pulls">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Usage](#usage)
* [Project Diagrams](#project-diagrams)
  * [MVC Diagram](#mvc-diagram)
  * [Database ERD](#database-erd)
* [Contact](#contact)


<!-- ABOUT THE PROJECT -->
## About The Project

Backend services for Comment on Everything social media

API Endpoint : [https://comment-on-everything.herokuapp.com](https://comment-on-everything.herokuapp.com)</br>
API Documentation  : [https://documenter.getpostman.com/view/17936847/UVkjwJ2j](https://documenter.getpostman.com/view/17936847/UVkjwJ2j)



### Built With

* [Nodejs](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [AWS S3](https://aws.amazon.com/s3/)




<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo 
```sh
git clone https://github.com/OferElfassi/CommentOnEverything.git
```
2. Install NPM packages
```sh
npm install
```
3. Add .env file and write your credentials
```JS
DB_NAME="********"
DB_USER="********"
DB_PASS="********"
DB_HOST="********"
AWS_BUCKET_NAME="********"
AWS_BUCKET_REGION="********"
AWS_ACCESS_KEY="********"
AWS_SECRET_KEY="********"
```

<!-- USAGE EXAMPLES -->
## Usage
In order to use the demo API use the following endpoint - [https://comment-on-everything.herokuapp.com](https://comment-on-everything.herokuapp.com)

Here's example call to the API:

GET: get posts by hashtag
```JS
var settings = {
  "url": "https://comment-on-everything.herokuapp.com/api/posts/hashtag/Electronics",
  "method": "GET",
  "timeout": 0,
};

$.ajax(settings).done(function (response) {
  console.log(response);
});
```
Response (JSON)
```JSON
{
  "message": "success",
  "data": [
    {
      "_id": "61c59b5e7888c5fc326ddffd",
      "description": "Love that series ",
      "createdAt": "2021-12-24T10:04:48.413Z",
      "image": {
        "url": "https://comment-on-everything-bucket.s3.amazonaws.com/99631954-45e2-45f6-a6e8-60a50348a94b.jpg",
        "key": "99631954-45e2-45f6-a6e8-60a50348a94b.jpg"
      },
      "reactions": [],
      "comments": [],
      "hashtag": "61c592c4186ee007e46fb7fb",
      "id": "61c59b5e7888c5fc326ddffd"
    }
  ]
}
```


_For more examples, please refer to the [Documentation](https://documenter.getpostman.com/view/17936847/UVkjwJ2j)_

<!-- Project Diagrams -->
## Project Diagrams
### MVC Diagram
![coe-mvc](https://user-images.githubusercontent.com/13490629/159054001-42e959ec-59b0-46fd-9cf8-dc91b13c716d.PNG)
### Database ERD
![coe-erd](https://user-images.githubusercontent.com/13490629/159053249-b6e54367-3016-4044-a14c-24345f03c678.PNG)

<!-- CONTACT -->
## Contact

Ofer Elfassi - [@Linkedin](https://www.linkedin.com/in/oferelfassi) - ofer2212@gmail.com




