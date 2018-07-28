const Swagger = require('swagger-client')
const Listr = require('listr')

import {Command, flags} from '@oclif/command'
import {SwaggerClient, Response} from '../interfaces'
import ResourceCrawler from '../ResourceCrawler'

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
    const base = args.src.replace('/swagger.json', '')
    const resources = this.resources(client.apis, flags)

    const tasks = []

    resources.forEach(resource => {
      tasks.push(
        new ResourceCrawler(resource, base, {limit: 100}).task()
      )
    })

    let opts = {concurrent: true, exitOnError: false}
    let error = false

    await new Listr(tasks, opts).run().catch(() => {
      error = true
    })

    let exitCode = error ? 1 : 0
    this.exit(exitCode)
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
    return client.apis[resource][`get_${resource}`]()
  }
}
