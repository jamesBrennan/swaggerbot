const JsonapiClient = require('@holidayextras/jsonapi-client')
import {Crawler, GenericObject} from './interfaces'

interface PageParams {
  limit?: number,
  offset?: number
}

export default class JSONAPICrawler implements Crawler {
  resource: string
  offset: number
  limit: number
  params: PageParams
  client: GenericObject

  constructor(base: string, resource: string, params: PageParams) {
    this.client = new JsonapiClient(base)
    this.resource = resource
    this.params = params
    this.limit = params.limit || 50
    this.offset = params.offset || 0
  }

  next(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.client.find(this.resource, {page: this.page}, (err: Error, resources: any[]) => {
        if (err) reject(err)
        this.increment()
        resolve(resources)
      })
    })
  }

  increment() {
    this.offset += this.limit
  }

  get page(): PageParams {
    return {
      limit: this.limit,
      offset: this.offset
    }
  }
}
