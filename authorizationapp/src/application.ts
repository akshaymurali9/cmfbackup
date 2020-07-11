import {AuthenticationBindings} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MyAuthActionProvider, MyAuthAuthenticationStrategyProvider, MyAuthBindings, MyAuthMetadataProvider} from './auth';
import {RoleRepository, UserRepository, UserRoleRepository} from './repositories';
import {MySequence} from './sequence';

export {ApplicationConfig};

export class AuthorizationappApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.bind(AuthenticationBindings.METADATA).toProvider(MyAuthMetadataProvider);
    this.bind(MyAuthBindings.STRATEGY).toProvider(MyAuthAuthenticationStrategyProvider);
    this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(MyAuthActionProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async seedData() {
    const userRepository: UserRepository = await this.getRepository(UserRepository);
    const roleRepository: RoleRepository = await this.getRepository(RoleRepository);
    const userRoleRepository: UserRoleRepository = await this.getRepository(UserRoleRepository);

    await userRepository.create({id: 'admin', password: 'hash-this', email: 'akshay@gmail.com'});
    await userRepository.create({id: 'user', password: 'hash-this', email: 'thiruveni@gmail.com'});
    //await userRepository.create({ id: 'user', password: 'hash-this', email: 'user@test.test' });
    await roleRepository.create({id: 'ADMIN', description: 'admin'});
    await roleRepository.create({id: 'USER', description: 'admin2'});
    await userRoleRepository.create({userId: 'admin', roleId: 'ADMIN'});
    await userRoleRepository.create({userId: 'user', roleId: 'USER'});
  }
}
