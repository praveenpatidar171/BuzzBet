import { IsnapShot } from '@/app/hooks/useMarketSocket';
import { atom } from 'jotai';

export const snapshotAtom = atom<IsnapShot>({
    yesPrice: 5,
    yesCount: 0,
    noCount: 0,
    createdAt: new Date(),
});