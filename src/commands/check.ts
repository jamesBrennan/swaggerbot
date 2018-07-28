import {Command, flags} from '@oclif/command'
const Swagger = require('swagger-client')
import {util} from '../util'
import {Response, SwaggerClient} from '../interfaces'

interface CheckFlags {
  help?: void
  only?: string
}

export default class Check extends Command {
  static description = 'Check that all resources load without errors'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-o, --only=VALUE)
    only: flags.string({char: 'o', description: 'only check the specified resource'})
  }

  static args = [{name: 'src'}]

  async run() {
    const {args, flags} = this.parse(Check)
    const client = await new Swagger(args.src)
    const resources = this.resources(client.apis, flags)

    let promises = resources.map(async resource => {
      let [err, res] = await this.get(client, resource)
      this.log(resource, this.status(err, res))
    })

    await Promise.all(promises)
    this.log('finished')
    this.exit()
  }

  onlyFilter(included: string | undefined) {
    if (!included) return (_: any) => true
    return (x: string) => x === included
  }

  resources(available: object[], flags: CheckFlags) {
    return Object.keys(available).filter(this.onlyFilter(flags.only))
  }

  status(err: Response | undefined, res: Response | undefined) {
    return res && res.status || err && err.status
  }

  async get(client: SwaggerClient, resource: string) {
    return util.to(client.apis[resource][`get_${resource}`])
  }
}
