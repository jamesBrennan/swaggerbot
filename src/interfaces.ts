export interface Response {
  status: number
}

export interface SwaggerClient {
  apis: GenericObject
}

export interface GenericObject {
  [key: string]: any
}
