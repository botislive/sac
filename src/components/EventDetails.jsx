import {
  EventToggleAtom,
  filteredEventsAtom,
  statusFilterAtom,
  EventDeleteAtom,
  EventEditAtom,
  sacMemAtom,
  eventsAtom,
  clubs,
} from "../atoms/userAtom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function EventDetails({ eventId = null }) {
  const [filter, setFilter] = useState("all");
  const [, statusFilter] = useAtom(statusFilterAtom);
  const [filteredEvents] = useAtom(filteredEventsAtom);
  const [members] = useAtom(sacMemAtom);
  const allEvents = useAtomValue(eventsAtom);
  const clubList = useAtomValue(clubs);
  const [, eventToggle] = useAtom(EventToggleAtom);
  const [, eventDelete] = useAtom(EventDeleteAtom);
  const [, eventEdit] = useAtom(EventEditAtom);
  const [editingEventId, setEditingEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCoordinator, setHoveredCoordinator] = useState(null);
  const [editForm, setEditForm] = useState({
    club_name: "",
    event_title: "",
    date: "",
    coordinators: [],
  });

  const isSingleEventView = eventId !== null && eventId !== undefined;
  const selectedEvent = isSingleEventView
    ? allEvents.find((event) => String(event.id) === String(eventId))
    : null;
  const eventsToRender = isSingleEventView ? (selectedEvent ? [selectedEvent] : []) : filteredEvents;
  const availableClubs = Array.from(
    new Set(
      (clubList || [])
        .map((club) => (typeof club === "string" ? club : club?.name))
        .filter(Boolean)
    )
  );

  const normalizeCoordinators = (coordinators = []) =>
    coordinators.map((coord) => (typeof coord === "string" ? coord : coord?.name)).filter(Boolean);

  const toDateInputValue = (value = "") => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!isSingleEventView) statusFilter(filter);
  }, [statusFilter, filter, isSingleEventView]);

  const startEdit = (event) => {
    setEditingEventId(event.id);
    setSearchTerm("");
    setEditForm({
      club_name: event.club_name || "",
      event_title: event.event_title || "",
      date: toDateInputValue(event.date || ""),
      coordinators: normalizeCoordinators(event.coordinators),
    });
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setSearchTerm("");
    setEditForm({
      club_name: "",
      event_title: "",
      date: "",
      coordinators: [],
    });
  };

  const toggleCoordinator = (memberName) => {
    setEditForm((prev) => {
      const isSelected = prev.coordinators.includes(memberName);
      return {
        ...prev,
        coordinators: isSelected
          ? prev.coordinators.filter((name) => name !== memberName)
          : [...prev.coordinators, memberName],
      };
    });
  };

  const saveEdit = (targetEventId) => {
    eventEdit({
      id: targetEventId,
      club_name: editForm.club_name.trim(),
      event_title: editForm.event_title.trim(),
      date: editForm.date,
      coordinators: editForm.coordinators,
    });
    cancelEdit();
    toast.success("Event updated successfully");
  };

  const filteredMembers = (members || []).filter(
    (member) => member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCoordinatorTooltipLines = (coordName) => {
    const member = (members || []).find((item) => item.name === coordName);
    if (!member) return [`Name: ${coordName}`, "Details not available"];
    return [
      `Name: ${coordName}`,
      `Post: ${member.post || "N/A"}`,
      `Phone: ${member.phone || "N/A"}`,
      `Year: ${member.year || "N/A"}`,
      `Branch: ${member.branch || "N/A"}`,
    ];
  };

  const getCoordinatorDetails = (event) =>
    normalizeCoordinators(event.coordinators).map((coordName) => ({
      name: coordName,
      member: (members || []).find((item) => item.name === coordName) || null,
    }));

  return (
    <div className="space-y-6">
      {isSingleEventView && (
        <div className="mb-4">
          <Link to="/events" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
            <span>&larr;</span> Back to Events
          </Link>
        </div>
      )}

      {!isSingleEventView && (
        <div className="flex bg-gray-900/50 p-1 rounded-lg w-fit border border-gray-800">
          {["all", "upcoming", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${filter === f
                ? "bg-gray-800 text-white shadow-sm ring-1 ring-gray-700"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {eventsToRender.map((event) => (
          <div
            key={event.id}
            className={`border rounded-xl p-5 hover:border-gray-600 transition-all duration-300 ${event.is_complete
              ? "bg-gray-900/30 border-gray-800/50"
              : "bg-gray-800/20 border-gray-700 hover:shadow-lg hover:shadow-blue-900/10"
              }`}
          >
            {editingEventId === event.id ? (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Club Name</label>
                    <select
                      value={editForm.club_name}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, club_name: e.target.value }))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="" disabled>-- Select Club --</option>
                      {availableClubs.map((clubName) => (
                        <option key={clubName} value={clubName}>{clubName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Event Title</label>
                    <input
                      type="text"
                      value={editForm.event_title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, event_title: e.target.value }))}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                      style={{ colorScheme: 'dark' }}
                      className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">{event.event_title}</h3>
                    {event.is_complete && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-semibold">Done</span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="text-indigo-400">Club: </span>
                      <span>{event.club_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <span className="text-blue-400">&#128197;</span>
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-4 ${!isSingleEventView ? 'pt-4 border-t border-gray-800' : ''}`}>
              {editingEventId === event.id ? (
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                  <label className="block text-xs font-medium text-gray-400 mb-2">Edit Coordinators</label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-t-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="border border-t-0 border-gray-700 max-h-32 overflow-y-auto p-2 bg-gray-950 rounded-b-lg space-y-1">
                    {filteredMembers.map((member) => (
                      <label key={member.name} className="flex items-center gap-3 p-1.5 hover:bg-gray-800 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.coordinators.includes(member.name)}
                          onChange={() => toggleCoordinator(member.name)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">{member.name} <span className="text-xs text-gray-500">({member.post})</span></span>
                      </label>
                    ))}
                    {filteredMembers.length === 0 && (
                      <p className="text-xs text-gray-500 py-2 text-center">No members found</p>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editForm.coordinators.map((name) => (
                      <span key={name} className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {name}
                        <button type="button" onClick={() => toggleCoordinator(name)} className="text-blue-400 hover:text-white ml-1">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : isSingleEventView ? (
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-800 pb-2">Student Coordinators</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCoordinatorDetails(event).map(({ name, member }) => (
                      <div key={name} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-1">
                        <p className="text-white font-medium">{name}</p>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs mt-2">
                          <span className="text-gray-500">Post</span>
                          <span className="text-gray-300 truncate text-right">{member?.post || "N/A"}</span>
                          <span className="text-gray-500">Branch/Year</span>
                          <span className="text-gray-300 text-right">{member?.branch || "-"} / {member?.year || "-"}</span>
                          <span className="text-gray-500">Phone</span>
                          <span className="text-gray-300 text-right font-mono">{member?.phone || "N/A"}</span>
                        </div>
                      </div>
                    ))}
                    {getCoordinatorDetails(event).length === 0 && <span className="text-gray-500 text-sm">No coordinators assigned</span>}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Coordinators:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {normalizeCoordinators(event.coordinators).map((name) => (
                      <div key={name} className="relative inline-block">
                        <span
                          onMouseEnter={() => setHoveredCoordinator(`${event.id}:${name}`)}
                          onMouseLeave={() => setHoveredCoordinator(null)}
                          className="bg-gray-800 text-gray-300 border border-gray-700 px-2 py-0.5 rounded-full text-xs cursor-help hover:bg-gray-700 transition-colors"
                        >
                          {name}
                        </span>

                        {hoveredCoordinator === `${event.id}:${name}` && (
                          <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 bg-gray-900 border border-gray-700 text-gray-200 p-3 rounded-lg text-xs shadow-xl z-20">
                            {getCoordinatorTooltipLines(name).map((line, i) => (
                              <div key={i} className={`truncate ${i === 0 ? 'font-bold text-white mb-1 pb-1 border-b border-gray-700' : 'text-gray-400'}`}>{line}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {normalizeCoordinators(event.coordinators).length === 0 && (
                      <span className="text-xs text-gray-600">None</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isSingleEventView && (
              <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-gray-800/80">
                <button
                  onClick={() => {
                    eventToggle(event.id);
                    toast.success(`Event marked as ${event.is_complete ? 'Incomplete' : 'Complete'}`);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${event.is_complete
                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                    }`}
                >
                  {event.is_complete ? "✓ Completed" : "Mark Done"}
                </button>

                {editingEventId === event.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(event.id)}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-1.5 bg-transparent border border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(event)}
                      className="px-3 py-1.5 bg-transparent border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-md text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <Link
                      to={`/details/${event.id}`}
                      className="px-3 py-1.5 bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-500 rounded-md text-sm font-medium transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${event.event_title}"?`)) {
                          eventDelete(event.id);
                          toast.success("Event deleted successfully");
                        }
                      }}
                      className="ml-auto px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-md text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {eventsToRender.length === 0 && (
          <div className="text-center py-12 bg-gray-900/30 border border-gray-800 border-dashed rounded-xl">
            <p className="text-gray-400 text-lg">{isSingleEventView ? "Event not found." : "No events match this filter."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
