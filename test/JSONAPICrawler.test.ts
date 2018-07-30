import * as JsonapiClient from '@holidayextras/jsonapi-client'

jest.mock('@holidayextras/jsonapi-client')

import JSONAPICrawler from '../src/JSONAPICrawler'

describe('JSONAPICrawler', () => {
  let base
  let resource

  beforeEach(() => {
    base = 'http://localhost/api/v1'
    resource = 'products'
    new JSONAPICrawler(base, resource)
  })

  it('instantiates a JsonapiClient', () => {
    expect(JsonapiClient).toHaveBeenCalledWith(base)
  })
})
