const { BitlyClient } = require('bitly');
const firebase = require('firebase');
const get = require('get-value');
const http = require('http');
const moment = require('moment');
const { Probot } = require('probot');

const configFirebase = {
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL
}

const bitly = new BitlyClient(process.env.BITLY_API_KEY, {})

firebase.initializeApp(configFirebase);


module.exports = release => {
  release.on(['release'], async context => {
    const id = get(context, 'id')
    const repo = get(context.payload, 'repository.name')
    const org = get(context.payload, 'organization.login')
    const author = get(context.payload, 'release.author.login')
    const version = get(context.payload, 'release.tag_name')
    const releaseDate = get(context.payload, 'release.published_at').split("T")[0]
    const link = `https://github.com/${org}/${repo}/releases/tag/${version}`

    firebase.database().ref('releases/' + repo + "/latest" ).set({
      author: author,
      version: version,
      release_date: releaseDate,
      link: link
    })

    firebase.database().ref('releases/' + repo + "/" + id).set({
      author: author,
      version: version,
      release_date: releaseDate,
      link: link
    })
  })
}

module.exports = pullRequest => {

}