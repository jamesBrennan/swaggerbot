const JsonapiClient = require('@holidayextras/jsonapi-client')
const util = require('util')
import {Observable} from 'rxjs'

interface CrawlerOpts {
  limit?: number
}

export default class ResourceCrawler {
  constructor(name: string, base: string, opts: CrawlerOpts) {
    this.name = name
    this.client = new JsonapiClient(base)
    this.find = util.promisify(this.client.find)
    this.offset = 0
    this.limit = opts.limit || 50
  }

  task() {
    return {
      title: this.name,
      task: () => {
        return new Observable(async observer => {
          await this.crawl(observer)
        })
      }
    }
  }

  async crawl(observer) {
    try {
      observer.next(`Fetching ${JSON.stringify(this.page)}`)
      let resources = await this.nextPage()
      if (resources.length > 0) {
        await this.crawl(observer)
      }
    } catch (e) {
      observer.error(e)
    } finally {
      observer.complete()
    }
  }

  nextPage() {
    return new Promise((resolve, reject) => {
      this.client.find(this.name, {page: this.page}, (err, resources) => {
        if (err) reject(err)
        this.increment()
        resolve(resources)
      })
    })
  }

  increment() {
    this.offset += this.limit
  }

  get page() {
    return {
      limit: this.limit,
      offset: this.offset
    }
  }
}
