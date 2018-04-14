const request = require('request');
const _ = require('lodash');
const LRU = require('lru-cache')

//for 4 GB, with each result size max 2k, we dont want more than 2000000 hits
// also we want to invalidate entries every week
let cacheOptions=  {
    max: 500,
    maxAge: 1000 * 60 * 60 * 24 * 7
}
const cache = LRU(2000000);


const rankGithubReposByTerm = (term, callback) => {

    const valFromCache = cache.get(term);
    if (valFromCache) {
        return callback(null, valFromCache);
    }

    rankGithubRepos(term, (err, results) => {
        if (err) {
            return callback(err);
        }

        cache.set(term, results);
        return callback(null, results);
    });
}

const rankGithubReposByUser = (user, callback) => {
    return rankGithubRepos('user:' + user, callback);
}

const rankGithubRepos = (queryString, callback) => {
    return request({
            method: 'GET',
            url: 'https://api.github.com/search/repositories',
            qs: {
                q: queryString,
                sort: 'stars'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
            }
        },
        (err, res) => {
            if (err) {
                return callback(new Error("github query failed" + err.message));
            }
            if (res.statusCode != 200) {
                return callback(new Error("github query failed, status code " + res.statusCode));
            }
            if (res.body == null) {
                return callback(new Error("github query returned empty response " + res.statusCode));

            }
            if (! (typeof res.body === 'object')) {
                res.body = JSON.parse(res.body);
            }
            if (res.body.items == null || res.body.total_count == 0) {
                return callback(new Error("github query returned 0 resuls"));
            }

            let results = mapResults(res.body.items);
            return callback(null, results);
        });
}

function mapResults (results) {
    return _.take(results, 10).map( result => ( {
            id: result.id,
            name: result.name,
            stars: result.stargazers_count,
            url: result.url
        })
    );
}



module.exports = { rankGithubReposByUser, rankGithubReposByTerm }