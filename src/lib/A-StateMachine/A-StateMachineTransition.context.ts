import { A_Frame } from "@adaas/a-frame";
import { A_OperationContext } from "@adaas/a-utils/a-operation";
import { A_StateMachineTransitionParams, A_StateMachineTransitionStorage } from "./A-StateMachine.types";



@A_Frame.Fragment({
    name: 'A-StateMachineTransition',
    description: 'Context for managing state machine transitions.'
})
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

    /**
     * The state to transition from
     */
    get from(): string {
        return this._meta.get('from')!;
    }

    /**
     * The state to transition to
     */
    get to(): string {
        return this._meta.get('to')!;
    }

}