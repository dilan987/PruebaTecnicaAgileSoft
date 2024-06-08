import sinon from 'sinon';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import TaskController from '../../src/application/controllers/taskController';
import { TaskRepository } from '../../src/infrastructure/repositories/task.repository';

describe('TaskController', () => {
  let sandbox: sinon.SinonSandbox;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let taskController: TaskController;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    taskController = new TaskController();
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

  it('should return tasks for a specific user', async () => {
    const userId = 'user1';
    const fakeTasks = [
      { id: '1', userId, name: 'Test Task 1', status: false, description: 'Test Description 1', createdOn: new Date(), updatedOn: new Date() },
      { id: '2', userId, name: 'Test Task 2', status: false, description: 'Test Description 2', createdOn: new Date(), updatedOn: new Date() },
    ];
    const findByUserStub = sandbox.stub(TaskRepository.prototype, 'findByUser').resolves(fakeTasks);

    await taskController.getByUser(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledOnceWith(200)).toBeTruthy();
    expect((res.json as sinon.SinonStub).calledOnceWith(fakeTasks)).toBeTruthy();
    expect(findByUserStub.calledOnceWith(userId)).toBeTruthy();
  });

  it('should create a new task', async () => {
    const newTask = { name: 'New Task', description: 'New Description', status: false };
    const userId = 'user1';
    const savedTask = { ...newTask, id: 'some-id', userId, createdOn: new Date(), updatedOn: new Date() };
    req.body = newTask;
    const createStub = sandbox.stub(TaskRepository.prototype, 'create').resolves(savedTask);

    await taskController.newTask(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledOnceWith(200)).toBeTruthy();
    expect((res.json as sinon.SinonStub).calledOnceWith(savedTask)).toBeTruthy();
    expect(createStub.calledOnceWith(newTask, userId)).toBeTruthy();
  });
});







