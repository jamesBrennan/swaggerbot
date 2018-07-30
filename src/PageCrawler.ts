import {Observable, Observer} from 'rxjs'
const JsonapiClient = require('@holidayextras/jsonapi-client')
import {GenericObject} from './interfaces'

interface CrawlerOpts {
  limit?: number
  errorLog: NodeJS.WritableStream
}

export default class PageCrawler {
  name: string
  client: GenericObject
  offset: number
  limit: number
  errorLog: NodeJS.WritableStream

  constructor(name: string, base: string, opts: CrawlerOpts) {
    this.name = name
    this.client = new JsonapiClient(base)
    this.offset = 0
    this.limit = opts.limit || 50
    this.errorLog = opts.errorLog
  }

  task() {
    return {
      title: this.name,
      task: () => {
        return new Observable(this.run.bind(this))
      }
    }
  }

  async run(observer: Observer<any>): Promise<void> {
    try {
      await this.crawl(observer)
    } catch (e) {
      this.logError(e)
      observer.error(e)
    }
    observer.complete()
  }

  async crawl(observer: Observer<any>): Promise<void> {
    observer.next(`Fetching ${this.pageJSON}`)
    let resources = await this.next()
    if (resources.length > 0) {
      await this.crawl(observer)
    }
  }

  next(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.client.find(this.name, {page: this.page}, (err: Error, resources: any[]) => {
        if (err) reject(err)
        this.increment()
        resolve(resources)
      })
    })
  }

  increment() {
    this.offset += this.limit
  }

  logError(error: Error) {
    this.errorLog.write(`ERROR: ${this.name} - ${this.pageJSON} \n`)
    if (error.stack) {
      this.errorLog.write(error.stack.concat('\n\n\n'))
    }
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
