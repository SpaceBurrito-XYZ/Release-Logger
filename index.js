const { Client } = require('discord.js')
const get = require('get-value')
const http = require('http')
const hookcord = require('hookcord')
const moment = require('moment')
const { Probot } = require('probot')

const botUser = new Client()
botUser.login(process.env.DISCORD_BOT_TOKEN)

const releaseHook = new hookcord.Hook()
releaseHook.login(process.env.DISCORD_ID, process.env.DISCORD_SECRET)

const devHook = new hookcord.Hook()
devHook.login(process.env.DISCORD_DEV_WEBHOOK_ID, process.env.DISCORD_DEV_WEBHOOK_SECRET)
module.exports = release => {

  release.on('release', async context => {
    const id = get(context, 'id')
    const repo = get(context.payload, 'repository.name')
    const org = get(context.payload, 'organization.login')
    const author = get(context.payload, 'release.author.login')
    const version = get(context.payload, 'release.tag_name')
    const link = `https://github.com/${org}/${repo}/releases/tag/${version}`

    const msg = `A newer version of ${repo} (${version}) has been released. You can view it here: ${link}`
    releaseHook.setPayload({
      "content": msg
    })

    releaseHook.fire().then(response_object => {

    }).catch(error => {
      throw error
    })
  })
}

module.exports = pullRequest => {
  pullRequest.on('pull_request', async context => {
    const id = get(context, 'id')
    const repo = get(context.payload)
    const org = get(context.payload, 'organization.login')
    const num = get(context.payload, 'number')
    const state = get(context.payload, 'action')
    const link = `https://github.com/${org}/${repo}/pull/${num}`

    let msg
    if (state === 'opened') {
      msg = `A pull request (#${num}) for ${repo} was opened. You can view it here: ${link}`
    } else if (state === 'closed') {
      msg = `A pull request (#${num}) for ${repo} was closed. You can view it here: ${link}`
    } else if (state === 'synchronize') {
      msg = `A pull request (#${num}) for ${repo} was updated. You can view it here: ${link}`
    }

    devHook.setPayload({ "content": msg})
    devHook.fire().then().catch(error => { throw error})
  })
}