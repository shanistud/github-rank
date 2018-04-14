const { rankGithubReposByUser } = require('../lib/services/github-search-service');



if (process.argv.length < 3) {
    quitWithError('please defin a github url');
}

githubUrl = process.argv[2];

const githubUser = grabGithubUserFromUrl(githubUrl);
if (!githubUser) {
    quitWithError('invalid github repo index url');
}

rankGithubReposByUser(githubUser, (err, res) => {
    if (err) {
        quitWithError(err.message);
    }

    console.log(res);
})




function quitWithError (msg) {
    console.log(msg);
    process.exit(1);
}

function grabGithubUserFromUrl (githubUrl) {
    const validationExpression = /^(https|http)\:\/\/(www\.)?github\.com\/(\w+$)/i;
    let match = githubUrl.match(validationExpression)
    return  match != null ? match[3] : null;
}