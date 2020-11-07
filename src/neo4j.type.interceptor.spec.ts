import {Neo4jTypeInterceptor, toNative} from './neo4j.type.interceptor';
import {int, types} from 'neo4j-driver';
import {Observable} from 'rxjs';

describe('Neo4jTypeInterceptor', () => {
  it('should convert a Node', () => {
    const interceptor: Neo4jTypeInterceptor = new Neo4jTypeInterceptor();

    const callHandler = {
      handle: jest.fn().mockReturnThis(),
      pipe: jest.fn().mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next('foo');
        }),
      ),
    };

    interceptor.intercept({} as any, callHandler);

    expect(callHandler.handle).toHaveBeenCalled();
    expect(callHandler.pipe).toHaveBeenCalled();
  });

  describe('toNative()', () => {
    it('should not process null/undefined value', () => {
      expect(toNative(null)).toBe(undefined);
      expect(toNative(undefined)).toBe(undefined);
    });

    describe('from neo4j types', () => {
      it('should throw error from int', () => {
        expect(toNative(int(1))).toStrictEqual(int(1));
      });
      it('should throw error from int', () => {
        expect(toNative(int(1))).toStrictEqual(int(1));
      });

      it('should throw error point', () => {
        // @ts-ignore
        expect(toNative(new types.Point(int(1), 2, 3, 4))).toStrictEqual(
          new types.Point(int(1), 2, 3, 4),
        );
      });

      it('should throw error point 4326', () => {
        // @ts-ignore
        expect(toNative(new types.Point(int(4326), 2, 3, 4))).toStrictEqual(
          new types.Point(int(4326), 2, 3, 4),
        );
      });

      it('should throw error point 4979', () => {
        // @ts-ignore
        expect(toNative(new types.Point(int(4979), 2, 3, 4))).toStrictEqual(
          new types.Point(int(4979), 2, 3, 4),
        );
      });
      it('should throw error from date', () => {
        expect(
          toNative(types.Date.fromStandardDate(new Date('10,10,2020'))),
        ).toStrictEqual(types.Date.fromStandardDate(new Date('10,10,2020')));
      });
    });

    describe('from object/array', () => {
      it('should throw error from object with int', () => {
        expect(toNative({number: int(1)})).toStrictEqual({number: int(1)});
      });

      it('should throw error from array with int', () => {
        expect(toNative([int(1)])).toStrictEqual([int(1)]);
      });
    });

    describe('from node/relationship/result', () => {
      it('should throw error from node', () => {
        // @ts-ignore
        expect(toNative(new types.Node())).toStrictEqual(new types.Node());
      });

      it('should throw error from relationship', () => {
        // @ts-ignore
        expect(toNative(new types.Relationship())).toStrictEqual(
          // @ts-ignore
          new types.Relationship(),
        );
      });
    });
  });
});
