const links = [
  {name: "Linkedin", url: "https://linkedin.com"},
  {name: "GitHub", url: "https://github.com"},
  {name: "Twitter", url: "https://twitter.com"},
  {name: "Facebook", url: "https://facebook.com"},
]
const socialLinks = [
  {iconSrc: "https://simpleicons.org/icons/linkedin.svg", url: "https://www.linkedin.com/in/arthurbbaker"},
  {iconSrc: "https://simpleicons.org/icons/github.svg", url: "https://github.com/MCArth"},
]
const htmlAddress = "https://static-links-page.signalnerve.workers.dev"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Handle request
 * @param {Request} request
 */
async function handleRequest(request) {

  // Returning links if path is /links
  const path = request.url.split('/')
  const API = path[path.length-1]
  if (API === 'links') {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json' },
    })
  }

  const res = await fetch(htmlAddress)

  // Return error if html page to edit responds with an error
  if (!res.ok) {
    return new Response(
      null, 
      {
        status: 500, 
        statusText: `The target html hosting server responded with ${res.status}`
      }
    )
  }

  // make necessary changes to html
  return new HTMLRewriter()
    .on("div#links", new LinkWriter())
    .on("div#social", new SocialLinkWriter())
    .on("div#profile", new ProfileUpdater())
    .on("img#avatar", new SetImage())
    .on("h1#name", new SetName())
    .on('title', new TitleRewriter())
    .on('body', new BackgroundChanger())
    .transform(res)
}

class LinkWriter {
  element(ele) {
    let htmlLinks = ""
    for (const link of links) {
      htmlLinks += `<a href="${link.url}">${link.name}</a>`
    }
    ele.setInnerContent(htmlLinks, {html: true})
  }
}

class SocialLinkWriter {
  element(ele) {
    let htmlLinks = ""
    for (const link of socialLinks) {
      htmlLinks += `<a href="${link.url}"><img style="width: 32px; height: 32px;" src=${link.iconSrc}></img></a>`      
    }
    ele.setInnerContent(htmlLinks, {html: true})
    ele.setAttribute('style', 'display: flex;')
    ele.setAttribute('class', '')
  }
}

class ProfileUpdater {
  element(ele) {
    ele.setAttribute('style', 'display: block')
  }
}

class SetImage {
  element(ele) {
    ele.setAttribute('src', 'https://media-exp1.licdn.com/dms/image/C4E03AQH9f-Zhnidd7A/profile-displayphoto-shrink_800_800/0?e=1608768000&v=beta&t=a9gSje1WM33RRMXdbBu5xKJPXGkv64_YK0DrHhtWMXM')

  }
}

class SetName {
  element(ele) {
    ele.setInnerContent('<div style="color: black; text-align: center;">Arthur</div>', {html: true})
  }
}

class TitleRewriter {
  element(ele) {
    ele.setInnerContent('boom', {html: false})
  }
}

class BackgroundChanger {
  element(ele) {
    ele.setAttribute('class', 'bg-gray-200')
  }
}