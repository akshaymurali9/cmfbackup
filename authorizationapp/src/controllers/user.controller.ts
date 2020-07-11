import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, Request, requestBody, Response, RestBindings} from '@loopback/rest';
import axios from 'axios';
import {promisify} from 'util';
import {Credentials} from '../auth';
import {User} from '../models';
import {UserRepository, UserRoleRepository} from '../repositories';

const {sign} = require('jsonwebtoken');
const signAsync = promisify(sign);

const introspectUrl: string = 'https://w3id.alpha.sso.ibm.com/isam/oidc/endpoint/amapp-runtime-oidcidp/introspect';

export class UserController {
  constructor(
    @repository(UserRepository) private userRepository: UserRepository,
    @repository(UserRoleRepository) private userRoleRepository: UserRoleRepository,
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response
  ) {}

  @post('/users')
  async createUser(@requestBody() user: User): Promise<User> {
    return await this.userRepository.create(user);
  }

  @post('/users/login')
  async login() {
    var credentials: Credentials;
    var loginEmail;
    try {
      console.log("ENTERED LOGIN API");
      console.log("Data coming in Request Header " + this.req.header('Authorization'));
      //console.log("Credential Username : " + credentials.username);
      await axios.post(introspectUrl, `token=${this.req.header('Authorization')}&client_id=OWY1ZTcxMmMtMDAwZi00&client_secret=MGEzZmZiMWQtNmZjMi00`)
        .then((response) => {
          console.log(response.data.sub);
          loginEmail = response.data.sub;
          //credentials.username = loginEmail;
        }, (error) => {
          console.log(error);
        });

      // var responseString = JSON.stringify(response);
      // var finalReponseFromIntrospect = JSON.parse(responseString);
      // console.log("RESPONSE STRING " + finalReponseFromIntrospect);
      if (!loginEmail) throw new HttpErrors.BadRequest('Missing Username');
      const user = await this.userRepository.findOne({where: {email: loginEmail}});

      if (!user) throw new HttpErrors.Unauthorized('Invalid credentials');

      // const isPasswordMatched = user.password === credentials.password;
      // if (!isPasswordMatched) throw new HttpErrors.Unauthorized('Invalid credentials');

      const tokenObject = {username: user.email};
      const token = await signAsync(tokenObject, 'jwtsecret');
      const roles = await this.userRoleRepository.find({where: {userId: user.id}});
      const {id, email} = user;
      this.res.setHeader('token', token);
      return {
        id: id as string,
        email,
        roles: roles.map(r => r.roleId),
      };
      // return response;
    } catch (exception) {
      process.stderr.write(`ERROR received from ${introspectUrl}: ${exception}\n`);
    }


  }
}
