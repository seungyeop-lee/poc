import { realLogic } from '@/lib/logic/real_logic';
import { mockLogic } from '@/lib/logic/mock_logic';
import { TLogic } from './types';

export const logic: TLogic = process.env.NODE_ENV === 'production' ? realLogic : mockLogic;
