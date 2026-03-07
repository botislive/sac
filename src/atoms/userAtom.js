import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { nanoid } from "nanoid";



export const sacMemAtom = atomWithStorage("sac_members", [{
    name: "Tushar",
    post: "Club Manager",
    year: "III",
    branch: "CSE",
    phone: "6301537173",
    events: ["event_ID_1", "event_ID_2"]
},
{
    name: "Likitha",
    post: "Club Manager",
    phone: "8543490275",
}
]);

export const eventsAtom = atomWithStorage("sac_events", [{
    id: nanoid(),
    club_name: "Music Club",
    event_title: "Sizziling Saturday",
    manager: "Yahash",
    date: "7 March 2026",
    coordinators: ["Likitha", "Tushar",],
    is_complete: false,

},])

export const clubs = atom([
    { name: "Radhakrishnan Literary club", department: "Humanities & Sciences", faculty: "Mrs.Hima Bindu Madam", manager: "Yellapu Tushar" },
    { name: "Lata Mangeshkar Dance Club", department: "Performing Arts", faculty: "Mrs.Sravanthi", manager: "Likitha" },
    { name: "Photography Club", department: "Media & Communications", faculty: "Mr.Ramesh", manager: "" },
    { name: "Coding Club", department: "Computer Science & IT", faculty: "Mrs.Priya", manager: "" },
    { name: "Music Club", department: "Performing Arts", faculty: "Mr.Kiran", manager: "" },
    { name: "Drama Club", department: "Performing Arts", faculty: "Mrs.Anitha", manager: "" },
    { name: "Sports Club", department: "Physical Education", faculty: "Mr.Suresh", manager: "" },
    { name: "Debate Club", department: "Humanities & Sciences", faculty: "Mrs.Lakshmi", manager: "" },
])



export const setMemAtom = atom(null, (get, set, data) => {
    const currentlist = get(sacMemAtom)
    set(sacMemAtom, [...currentlist, {
        name: data.name,
        post: data.post,
        year: data.year,
        branch: data.branch,
        phone: data.phone,
    }]);
});

export const setEventsAtom = atom(null, (get, set, data) => {
    const currentlist = get(eventsAtom)
    const coordinators = (data.coordinators || []).map((coord) =>
        typeof coord === "string" ? coord : coord?.name
    ).filter(Boolean);
    set(eventsAtom, [...currentlist, {
        id: nanoid(),
        club_name: data.club_name,
        department: data.department || "",
        event_title: data.event_title,
        manager: data.manager,
        date: data.event_date,
        coordinators,
        is_complete: false,
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

export const EventToggleAtom = atom(null, (get, set, eventId) => {
    const currentlist = get(eventsAtom)
    set(eventsAtom, currentlist.map(event => {
        if (event.id === eventId) {
            return { ...event, is_complete: !event.is_complete };
        }
        return event;
    }));

})


export const EventDeleteAtom = atom(null, (get, set, eventId) => {
    const currentList = get(eventsAtom);

    const updatedList = currentList.filter(event => event.id !== eventId);

    set(eventsAtom, updatedList);
});

export const EventEditAtom = atom(null, (get, set, data) => {
    const currentList = get(eventsAtom);
    const coordinators = (data.coordinators || []).map((coord) =>
        typeof coord === "string" ? coord : coord?.name
    ).filter(Boolean);

    const updatedList = currentList.map((event) => {
        if (event.id !== data.id) return event;
        return {
            ...event,
            club_name: data.club_name,
            department: data.department ?? event.department ?? "",
            event_title: data.event_title,
            date: data.date,
            coordinators,
        };
    });

    set(eventsAtom, updatedList);
});
