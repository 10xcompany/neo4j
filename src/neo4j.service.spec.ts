import {Test, TestingModule} from '@nestjs/testing';
import {Neo4jService} from './neo4j.service';
import {NEO4J_CONFIG, NEO4J_DRIVER} from './neo4j.constant';

describe('Neo4jService', () => {
  let service: Neo4jService;
  const transactionRunMock = jest.fn();
  const transactionCommitMock = jest.fn();
  const transactionRollbackMock = jest.fn();
  const transactionMock = jest.fn();
  const closeMock = jest.fn();
  const runMock = jest.fn();
  const sessionMock = jest.fn();
  const database = 'foo';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Neo4jService,
        {
          provide: NEO4J_CONFIG,
          useValue: {
            database,
          },
        },
        {
          provide: NEO4J_DRIVER,
          useValue: {
            session: sessionMock,
            close: closeMock,
          },
        },
      ],
    }).compile();

    service = module.get<Neo4jService>(Neo4jService);
  });

  beforeEach(() => {
    sessionMock.mockReturnValue({
      beginTransaction: transactionMock,
      run: runMock,
    });

    runMock.mockReturnValue(jest.fn());

    transactionMock.mockReturnValue({
      commit: transactionCommitMock,
      rollback: transactionRollbackMock,
      run: transactionRunMock,
    });
  });

  afterEach(() => {
    runMock.mockReset();
    sessionMock.mockReset();
    transactionMock.mockReset();
    transactionRunMock.mockReset();
    transactionCommitMock.mockReset();
    transactionRollbackMock.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getReadSession', () => {
    it('should get default session', () => {
      service.getReadSession();
      expect(sessionMock).toHaveBeenCalled();
      expect(sessionMock).toHaveBeenCalledWith({
        database,
        defaultAccessMode: 'READ',
      });
    });

    it('should get custom session', () => {
      service.getReadSession('foo-bar');
      expect(sessionMock).toHaveBeenCalled();
      expect(sessionMock).toHaveBeenCalledWith({
        database: 'foo-bar',
        defaultAccessMode: 'READ',
      });
    });
  });

  describe('getWriteSession', () => {
    it('should get default session', () => {
      service.getWriteSession();
      expect(sessionMock).toHaveBeenCalled();
      expect(sessionMock).toHaveBeenCalledWith({
        database,
        defaultAccessMode: 'WRITE',
      });
    });

    it('should get custom session', () => {
      service.getWriteSession('foo-bar');
      expect(sessionMock).toHaveBeenCalled();
      expect(sessionMock).toHaveBeenCalledWith({
        database: 'foo-bar',
        defaultAccessMode: 'WRITE',
      });
    });
  });

  describe('beginTransaction', () => {
    it('should begin transaction instance', () => {
      service.beginTransaction();
      expect(transactionMock).toHaveBeenCalled();
    });

    it('should begin transaction instance with custom database', () => {
      service.beginTransaction('foo-bar');
      expect(transactionMock).toHaveBeenCalled();
    });
  });

  describe('read', () => {
    it('should run read query', async () => {
      await service.read('some-cypher');
      expect(runMock).toHaveBeenCalled();
    });
  });

  describe('writeTransaction', () => {
    it('should run write query in transaction', async () => {
      await service.writeTransaction('some-cypher');
      expect(transactionRunMock).toHaveBeenCalled();
      expect(transactionCommitMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      transactionRunMock.mockImplementation(() => {
        throw new Error('error');
      });
      expect(service.writeTransaction('some-cypher')).rejects.toThrowError();
      expect(transactionRollbackMock).toHaveBeenCalled();
    });
  });

  describe('write', () => {
    it('should run write query', async () => {
      await service.write('some-cypher');
      expect(runMock).toHaveBeenCalled();
    });
  });

  describe('onApplicationShutdown', () => {
    it('should close', () => {
      service.onApplicationShutdown();
      expect(closeMock).toHaveBeenCalled();
    });
  });
});
