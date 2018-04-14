const express = require('express');
const router = express.Router();
const githubSearch =  require('../services/github-search-service');

router.get('/search', (req, res, next) => {
    if (req.query.term == null || req.query.term.length == 0) {
        return next(new Error('must define search term'))
    }

    githubSearch.rankGithubReposByTerm(req.query.term, (err, results) => {
        if (err) {
            return next(err);
        }

        return res.json(results)
    } );
});


module.exports = router;