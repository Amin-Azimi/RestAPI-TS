import * as typeorm from 'typeorm';
import AuthenticationService from '../authentication.service';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import CreateUserDto from '../../user/user.dto';
import TokenData from '../../interfaces/tokenData.interface';
 
jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return {
      ...actual,
      getRepository: jest.fn(),
    }
  });
   
describe('The AuthenticationService', () => {

  describe('when creating a cookie',()=>{
    it('should be a string',()=>{
        const authenticationService = new AuthenticationService();
        const tokenData : TokenData= {
            expiresIn:1,
            token:''
        }
        expect(typeof authenticationService.createCookie(tokenData)).toEqual('string');
    })
  });
    describe('when registering a user', () => {
        const userData: CreateUserDto = {
            name: 'John Smith',
            email: 'john@smith.com',
            password: 'strongPassword123',
            address :{
                city:'ddd',
                country : "dfdf",
                street : "fdssfsd"
            }
          };
    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(userData),
        });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.register(userData))
          .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(userData.email));
      });
    });
    describe('if the email is not taken',()=>{
        it('should not return an error',async()=>{

              process.env.JWT_SECRET = 'jwt_secret';
              (typeorm as any).getRepository.mockReturnValue({
                findOne: () => Promise.resolve(undefined),
                create: () => ({
                    ...userData,
                    id:0
                }),
                save :() => Promise.resolve()
              });
              const authenticationService = new AuthenticationService();
              await expect(authenticationService.register(userData))
                .resolves.toBeDefined();
      
        });
        it('should password will be undefined',async()=>{
            process.env.JWT_SECRET = 'jwt_secret';
            (typeorm as any).getRepository.mockReturnValue({
              findOne: () => Promise.resolve(undefined),
              create: () => ({
                  ...userData,
                  id:0
              }),
              save :() => Promise.resolve()
            });
            const authenticationService = new AuthenticationService();
            await expect((await authenticationService.register(userData)).user.password)
              .toBe(undefined);
      });
    })
  });
});