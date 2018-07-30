export interface Response {
  status: number
}

export interface GenericObject {
  [key: string]: any
}

export interface Crawler {
  resource: string
  params: GenericObject
  next(): Promise<any | any[]>
}

export interface CrawlerOpts {
  errorLog: NodeJS.WritableStream
}
