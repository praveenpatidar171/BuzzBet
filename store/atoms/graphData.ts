import { atom } from 'jotai';

export interface IgraphData {
    time: string,
    yesPrice: number,
    noPrice: number,
    yesCount: number,
    noCount: number
}

export const graphDataAtom = atom<IgraphData[]>([]);