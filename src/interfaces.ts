export interface Response {
  status: number
}

export interface SwaggerClient {
  apis: GenericObject
}

interface GenericObject {
  [key: string]: any
}
