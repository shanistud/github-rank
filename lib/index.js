const request = require('request');

const rankGithubReposByUser = (githubUserUrl, callback) => {
    return request({
        method: 'GET',
        url: 'https://api.github.com/search/repositories',
        qs: {
            q: "user:" + githubUserUrl,
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

            return callback(null, mapResults(res.body.items));
    });
}

function mapResults (results) {
    return results.map( result => ( {
            id: result.id,
            name: result.name,
            stars: result.stargazers_count
        })
    );
}

module.exports = { rankGithubReposByUser }