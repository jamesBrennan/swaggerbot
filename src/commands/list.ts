import {Command, flags} from '@oclif/command'
const Swagger = require('swagger-client')

export default class List extends Command {
  static description = 'List the available endpoints'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'src'}]

  async run() {
    const {args} = this.parse(List)
    const client = await new Swagger(args.src)

    Object.keys(client.apis).forEach(name => this.log(name))
    this.exit()
  }
}
