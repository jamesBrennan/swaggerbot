import {Response} from './interfaces'

export namespace util {
  export function to(asyncFn: Function) {
    return asyncFn().then((data: any) => {
      return [null, data]
    }).catch((err: Response) => [err])
  }
}
