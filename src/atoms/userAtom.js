import { atom } from "jotai";


export const sacMemAtom = atom([{
    name: "Tushar",
    post: "Club Manager",
    phone: "6301537173",
}]);

export const eventsAtom=atom([{
      club_name:"Music Club",
      event_title: "Sizziling Saturday",
      manager:"Yahash",
      date:"7 March 2026",
      coordinators:["name1","name2",],
      
},])

export const setMemAtom = atom(null, (get, set, data) => {
    const currentlist=get(sacMemAtom)
    set(sacMemAtom, [...currentlist,{
        name:data.name,
        post:data.post,
        phone:data.post,
    }]);
});

export const setEventsAtom = atom(null, (get, set, data) => {
    const currentlist=get(eventsAtom) 
    set(eventsAtom, [...currentlist,{
        club_name:data.club_name,
        event_title:data.event_title,
        manager:data.manager,
        date:data.date,
        coordinators:data.coordinators,
    }]);
})