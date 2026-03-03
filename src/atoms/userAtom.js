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
      coordinators:["Likitha","Tushar",],
      is_complete:false,
      
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
        date:data.event_date,
        coordinators:data.coordinators,
        is_complete:false,
    }]);
})


export const statusFilterAtom = atom("all");


export const filteredEventsAtom = atom((get) => {
    const allEvents = get(eventsAtom);
    const filter = get(statusFilterAtom);

    return allEvents.filter(event => {
        if (filter === "upcoming") return !event.is_complete;
        if (filter === "completed") return event.is_complete;
        return true; 
    });
});