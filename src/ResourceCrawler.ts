import {Observable} from 'rxjs'
const JsonapiClient = require('@holidayextras/jsonapi-client')
import {GenericObject} from './interfaces'

interface CrawlerOpts {
  limit?: number
}

export default class ResourceCrawler {
  name: string
  client: GenericObject
  offset: number
  limit: number

  constructor(name: string, base: string, opts: CrawlerOpts) {
    this.name = name
    this.client = new JsonapiClient(base)
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

  async crawl(observer: any) {
    try {
      observer.next(`Fetching ${this.pageJSON}`)
      let resources = await this.nextPage()
      if (resources.length > 0) {
        await this.crawl(observer)
      }
    } catch (e) {
      observer.error(`Failed on ${this.pageJSON} with: ${e.message}`)
    } finally {
      observer.complete()
    }
  }

  nextPage(): any[] {
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

  get pageJSON() {
    return JSON.stringify(this.page)
  }
}
