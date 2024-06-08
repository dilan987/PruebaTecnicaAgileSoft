import sinon from 'sinon';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserController from '../../src/application/controllers/userController';
import { UserRepository } from '../../src/infrastructure/repositories/user.repository';

describe('UserController', () => {
  let sandbox: sinon.SinonSandbox;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let userController: UserController;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    userController = new UserController();
    req = {
      cookies: {
        token: jwt.sign({ userId: 'user1' }, 'your-secret-key'),
      },
      body: {},
      query: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    } as Partial<Response> as Response;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a new user', async () => {
    const newUser = { name: 'New User', email: 'new@example.com', userName: 'newuser', password: 'password123', userTaskInfo: [] };
    const savedUser = { ...newUser, id: 'some-id' };
    req.body = newUser;
    const createUserStub = sandbox.stub(UserRepository.prototype, 'create').resolves(savedUser);

    await userController.postNewUser(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledOnceWith(200)).toBeTruthy();
    expect((res.json as sinon.SinonStub).calledOnceWith('true')).toBeTruthy();
    expect(createUserStub.calledOnceWith(newUser)).toBeTruthy();
  });

  it('should retrieve user information', async () => {
    const userId = 'some-id';
    const user = { id: userId, name: 'Test User', email: 'test@example.com', userName: 'testuser', password: 'password123', userTaskInfo: [] };
    req.query = { user: userId };
    const findOneStub = sandbox.stub(UserRepository.prototype, 'findOne').resolves(user);

    await userController.getUser(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledOnceWith(200)).toBeTruthy();
    expect((res.json as sinon.SinonStub).calledOnceWith(user)).toBeTruthy();
    expect(findOneStub.calledOnceWith(userId)).toBeTruthy();
  });
});


