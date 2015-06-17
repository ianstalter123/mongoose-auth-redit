## Mongo Associations Assignment

For this assignment you will need to combine your knowledge of models, and associations to build a zoo application! 

### Requirements

Your application should have two models, zoo and animal. A zoo has many animals and an animal belongs to a zoo. 

Your zoo model should have a:

- name
- location
- reference to animals

Your animal model should have a/an:

- name 
- species 
- age
- photo (this should be an url)
- reference to a zoo

### Getting started (**START FROM SCRATCH**)

1. Create an app.js, run `npm init` and install the required dependencies for your application.
2. Start working on your Zoo and Animal model and use an `index.js` to bundle these models together
3. Build your routes - **THESE MUST BE RESTful**. Remember that your routes will have animals nested inside of zoos.
4. Start working on your views
5. Build full CRUD for your Zoo resource and then move onto Animals (this will be more difficult)
6. Ensure that when a zoo is deleted, all of the animals that belong to it are deleted as well. This will involve using a `pre 'remove' hook`

### Bonus

- Think about how you can refactor your nested routes. Do you really need `/zoo/:zoo_id` in all of your animals routes, or we can we remove it from some of them? 

- Style your application! Feel free to include bootstrap/bootswatch and make your app look great.
