import {Observable, Observer} from 'rxjs'
import {Crawler, CrawlerOpts} from './interfaces'

export default class PageCrawler {
  crawler: Crawler
  errorLog: NodeJS.WritableStream
  name: string

  constructor(crawler: Crawler, opts: CrawlerOpts) {
    this.name = crawler.resource
    this.crawler = crawler
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
    observer.next(`Fetching ${this.params}`)
    let resources = await this.crawler.next()
    if (resources.length > 0) {
      await this.crawl(observer)
    }
  }

  logError(error: Error) {
    this.errorLog.write(`ERROR: ${this.name} - ${this.params} \n`)
    if (error.stack) {
      this.errorLog.write(error.stack.concat('\n\n\n'))
    }
  }
  get params() {
    return JSON.stringify(this.crawler.params)
  }
}
