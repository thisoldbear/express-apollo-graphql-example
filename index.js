require('dotenv').config();

const express = require('express');
const { createApolloFetch } = require('apollo-fetch');

const app = express();

const client = createApolloFetch({
    uri: `https://api.graphcms.com/simple/v1/${process.env.GRAPHCMS_PROJECT_ID}`
});

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const query = `{
        posts: allPosts {
            id
            title
            content
            coverImage {
                url
            }
            authors {
                id
                name
            }
        }
    }`;

    client({query}).then(response => {
        return response.data.posts;
    }).then(posts => {
        res.render('pages/index', {
            posts: posts
        });
    });
});


app.get('/posts/:id', (req, res) => {
    const query = `{
        post: Post(id: "${req.params.id}") {
            title
            content
            coverImage {
                url
            }
        }
    }`;

    client({query}).then(response => {
        return response.data.post;
    }).then(post => {
        res.render('pages/post', {
            post: post
        });
    });
});

app.listen(4000);
