import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // const users: User = [];

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdf',
          } as User,
        ]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'asdf',
        } as User);
      },
      create: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'asdf',
          ...attrs,
        } as User);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as any);
      },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as any);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('fineAllUsers returns a list of users', async () => {
    const users = await controller.findAallUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow();
  });

  it('removeUser returns the removed user', async () => {
    const user = await controller.removeUser('1');
    expect(user).toBeDefined();
  });

  it('updateUser updates the user with the given id', async () => {
    const user = await controller.updateUser('1', {
      email: 'test2@test.com',
      password: 'newpassword',
    });
    expect(user.email).toEqual('test2@test.com');
  });

  it('createUser creates a new user and returns the user', async () => {
    const session = {
      userId: 1,
    };
    const user = await controller.createUser(
      {
        email: 'newuser@test.com',
        password: 'newpassword',
      },
      session,
    );
    expect(user).toBeDefined();
  });

  it('signin updates the session object and returns the user', async () => {
    const session = {
      userId: 1,
    };
    const user = await controller.signin(
      {
        email: 'test@test.com',
        password: 'asdf',
      },
      session,
    );
    expect(user).toBeDefined();
    // check if session object is updated
    expect(user.id).toEqual(1);
  });

  it('signout updates the session object', () => {
    const session = {
      userId: 1,
    };
    controller.signout(session);
    expect(session.userId).toBeNull();
  });
});
