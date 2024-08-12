import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

export type InputInvestCourse = { [key: string]: string };
const inputInvest = atom<InputInvestCourse>({});
const totalInvest = atom<number>((get) => {
    const input = get(inputInvest);
    return Object.values(input).reduce((acc, cur) => acc + Number(cur), 0);
});
const lengthInvest = atom<number>((get) => {
    const input = get(inputInvest);
    return Object.values(input).filter((item) => Number(item) > 0).length;
});

const changeInputInvest = atom(null, (get, set, { id, value }: { id: string; value: string }) => {
    set(inputInvest, (prev) => {
        return { ...prev, [id]: value };
    });
});

export const useInputInvestCourse = () => useAtom(inputInvest);
export const useInputInvestCourseValue = () => useAtomValue(inputInvest);
export const useSetInputInvestCourse = () => useSetAtom(inputInvest);

export const useTotalInvest = () => useAtomValue(totalInvest);
export const useLengthInvest = () => useAtomValue(lengthInvest);
export const useChangeInputInvest = () => useSetAtom(changeInputInvest);
