import {Response} from './interfaces'

export namespace util {
  export function to(asyncFn: () => Promise<any>) {
    return asyncFn().then((data: any) => {
      return [null, data]
    }).catch((err: Response) => [err])
  }
}
