import { A_Operation_Storage } from '../A-Operation/A-Operation.types.js';
import '@adaas/a-concept';

type A_StateMachineTransitionParams<T = any> = {
    from: string;
    to: string;
    props?: T;
};
type A_StateMachineTransitionStorage<_ResultType extends any = any, _ParamsType extends any = any> = {
    from: string;
    to: string;
} & A_Operation_Storage<_ResultType, A_StateMachineTransitionParams<_ParamsType>>;

export type { A_StateMachineTransitionParams, A_StateMachineTransitionStorage };
