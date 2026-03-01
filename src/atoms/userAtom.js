import { atom } from "jotai";


export const sacMemAtom = atom([{
    name: "Tushar",
    post: "Club Manager",
    phone: "6301537173",
}]);

export const setMemAtom = atom(null, (get, set, data) => {
    const currentlist=get(sacMemAtom)
    set(sacMemAtom, [...currentlist,{
        name:data.name,
        post:data.post,
        phone:data.post,
    }]);
});