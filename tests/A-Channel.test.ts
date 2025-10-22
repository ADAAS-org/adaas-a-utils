import './jest.setup';
import { A_Context } from '@adaas/a-concept';

jest.retryTimes(0);

describe('A-Channel tests', () => {

    it('Should Allow to create a channel', async () => {
        const { A_Channel } = await import('@adaas/a-utils/lib/A-Channel/A-Channel.component');

        const channel = new A_Channel();

        const meta = A_Context.meta(channel);
    });

});