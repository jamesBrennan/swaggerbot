import {Command, flags} from '@oclif/command'
const fs = require('fs')
const Swagger = require('swagger-client')
const Listr = require('listr')

import ResourceCrawler from '../ResourceCrawler'

interface CheckFlags {
  help?: void
  only?: string
}

interface ListrTask {
  title: string,
  task: any
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
    const errorLog = fs.createWriteStream('swaggerbot-errors.txt')
    const tasks: ListrTask[] = []

    let exitCode = 0

    try {
      resources.forEach(resource => {
        tasks.push(
          new ResourceCrawler(resource, base, {errorLog, limit: 100}).task()
        )
      })

      let opts = {concurrent: true, exitOnError: false}
      await new Listr(tasks, opts).run().catch(() => {
        exitCode = 1
      })
    } finally {
      errorLog.end()
      this.exit(exitCode)
    }
  }

  onlyFilter(included: string | undefined) {
    if (!included) return (_: any) => true
    return (x: string) => x === included
  }

  resources(available: object[], flags: CheckFlags) {
    return Object.keys(available).filter(this.onlyFilter(flags.only))
  }
}
