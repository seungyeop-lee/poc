import { realLogic } from '@/lib/logic/real_logic';
import { mockLogic } from '@/lib/logic/mock_logic';
import { TLogic } from '@/lib/logic/types';
import { isProduction } from '@/lib/helper';

export const logic: TLogic = isProduction() ? realLogic : mockLogic;

console.log(`logic.ts loaded: ${logic.name}`);