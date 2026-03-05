import { useState } from "react";
import { setEventsAtom, sacMemAtom, clubs } from "../atoms/userAtom";
import { useAtom, useAtomValue } from "jotai";

function EventForm() {
    const [members] = useAtom(sacMemAtom);
    const [, setEvents] = useAtom(setEventsAtom);
    const clubList = useAtomValue(clubs);

    const [club_name, setClub_name] = useState("");
    const [event_title, setEvent_title] = useState("");
    const [event_date, setEvent_date] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCoordinators, setSelectedCoordinators] = useState([]);

    const filteredMembers = (members || []).filter(member =>
        member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleCoordinator = (member) => {
        const isAlreadySelected = selectedCoordinators.some(s => s.name === member.name);

        if (isAlreadySelected) {
            setSelectedCoordinators(selectedCoordinators.filter(s => s.name !== member.name));
        } else {
            setSelectedCoordinators([...selectedCoordinators, member]);
        }
    };

    const handlesubmit = (e) => {
        e.preventDefault();

        const eventData = {
            club_name,
            event_title,
            event_date,
            coordinators: selectedCoordinators
        };

        setEvents(eventData);

        setClub_name("");
        setEvent_title("");
        setEvent_date("");
        setSelectedCoordinators([]);
        setSearchTerm("");
    };

    return (
        <form onSubmit={handlesubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Club</label>
                <select
                    value={club_name}
                    onChange={(e) => setClub_name(e.target.value)}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                    <option value="" disabled>-- Choose a Club --</option>
                    {(clubList || []).map((club) => (
                        <option key={club.name} value={club.name}>{club.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="event_title" className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                <input
                    id="event_title"
                    value={event_title}
                    onChange={(e) => setEvent_title(e.target.value)}
                    placeholder='Enter the event name'
                    type="text"
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Event Date</label>
                <input
                    value={event_date}
                    onChange={(e) => setEvent_date(e.target.value)}
                    type="date"
                    required
                    style={{ colorScheme: "dark" }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Add Coordinators</label>
                <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-t-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                />

                <div className="border border-t-0 border-gray-700 max-h-40 overflow-y-auto p-2 bg-gray-900/50 rounded-b-lg space-y-1">
                    {filteredMembers.map((member) => (
                        <label
                            key={member.name}
                            htmlFor={`coord-${member.name}`}
                            className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
                        >
                            <input
                                type="checkbox"
                                id={`coord-${member.name}`}
                                checked={selectedCoordinators.some(s => s.name === member.name)}
                                onChange={() => toggleCoordinator(member)}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-900"
                            />

                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-200">{member.name}</span>
                                <span className="text-xs text-gray-500">{member.post}</span>
                            </div>
                        </label>
                    ))}
                    {filteredMembers.length === 0 && <p className="text-xs text-center text-gray-500 py-2">No members found</p>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCoordinators.map(member => (
                        <span key={member.name} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs flex items-center gap-1">
                            {member.name}
                            <button
                                type="button"
                                onClick={() => toggleCoordinator(member)}
                                className="text-blue-400 hover:text-white ml-1 font-bold"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <button
                type='submit'
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
                Submit Event
            </button>
        </form>
    );
}

export default EventForm;
