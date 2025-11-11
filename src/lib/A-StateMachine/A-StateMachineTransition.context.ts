import { A_OperationContext } from "../A-Operation/A-Operation.context";
import { A_StateMachineTransitionParams, A_StateMachineTransitionStorage } from "./A-StateMachine.types";



export class A_StateMachineTransition<
    _ParamsType = any,
    _ResultType = any
> extends A_OperationContext<
    'a-state-machine-transition',
    A_StateMachineTransitionParams<_ParamsType>,
    _ResultType,
    A_StateMachineTransitionStorage<_ResultType, _ParamsType>
> {


    constructor(
        params: A_StateMachineTransitionParams<_ParamsType>
    ) {
        super(
            'a-state-machine-transition',
            params
        );

        this._meta.set('from', params.from);
        this._meta.set('to', params.to);
    }



    get from(): string {
        return this._meta.get('from')!;
    }



    get to(): string {
        return this._meta.get('to')!;
    }

}