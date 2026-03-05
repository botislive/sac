import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { sacMemAtom, eventsAtom } from "../atoms/userAtom"
import MemberForm from '../components/MemberForm'

function Members() {
  const [members] = useAtom(sacMemAtom)
  const allEvents = useAtomValue(eventsAtom)
  const [selectedMember, setSelectedMember] = useState(null)

  const getMemberEvents = (memberName) => {
    const memberEvents = allEvents.filter(event => {
      // Handle both string and object coordinators
      const coords = event.coordinators || [];
      return coords.some(coord =>
        (typeof coord === 'string' ? coord : coord.name) === memberName
      );
    });

    return {
      upcoming: memberEvents.filter(e => !e.is_complete),
      past: memberEvents.filter(e => e.is_complete)
    };
  }

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-white">Members Directory</h1>
        <p className="text-gray-400 mt-1">Manage and register SAC team members.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 border border-gray-800 rounded-xl bg-gray-900 shadow-xl overflow-hidden self-start">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-semibold text-white">Add Member</h2>
          </div>
          <div className="p-6">
            <MemberForm />
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 border border-gray-800 rounded-xl bg-gray-900 shadow-xl overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Directory</h2>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">
              {members.length} Total
            </span>
          </div>
          <div className="p-6">
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member, i) => (
                  <div
                    key={i}
                    className="border border-gray-700 bg-gray-800/30 rounded-xl p-5 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:-translate-y-1"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{member.name}</h3>
                        <p className="text-sm font-medium text-emerald-400">{member.post}</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 shadow-inner">
                        {member.year || 'N/A'} Year
                      </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-700/50 text-sm">
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-gray-200">{member.branch || 'Unspecified Branch'}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-200 font-mono">{member.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-gray-400 text-lg">No members registered yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      {selectedMember && (() => {
        const events = getMemberEvents(selectedMember.name);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
            <div
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800 bg-gray-900 flex justify-between items-start sticky top-0">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedMember.name}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="text-emerald-400 font-medium">{selectedMember.post}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span>{selectedMember.branch || "Unspecified"} - {selectedMember.year || "N/A"} Year</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto mix-blend-normal flex-1 bg-gray-900/50" style={{ scrollbarWidth: 'thin', scrollbarColor: '#374151 transparent' }}>
                <div className="space-y-8">
                  {/* Upcoming Events */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Upcoming Events
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-xs ml-2 font-mono">
                        {events.upcoming.length}
                      </span>
                    </h3>

                    {events.upcoming.length > 0 ? (
                      <div className="grid gap-3">
                        {events.upcoming.map(event => (
                          <div key={event.id} className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                            <div>
                              <div className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{event.event_title}</div>
                              <div className="text-sm text-gray-500 mt-1">{event.club_name}</div>
                            </div>
                            <div className="text-sm px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-400 whitespace-nowrap">
                              {event.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-800/20 border border-gray-800 border-dashed rounded-xl">
                        <p className="text-gray-500 text-sm">No upcoming events scheduled.</p>
                      </div>
                    )}
                  </div>

                  {/* Past Events */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Past Events
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs ml-2 font-mono">
                        {events.past.length}
                      </span>
                    </h3>

                    {events.past.length > 0 ? (
                      <div className="grid gap-3">
                        {events.past.map(event => (
                          <div key={event.id} className="bg-gray-800/20 border border-gray-800 rounded-xl p-4 flex justify-between items-center bg-gray-900/30">
                            <div>
                              <div className="font-medium text-gray-400">{event.event_title}</div>
                              <div className="text-sm text-gray-600 mt-1">{event.club_name}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 whitespace-nowrap">{event.date}</span>
                              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-1 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-800/20 border border-gray-800 border-dashed rounded-xl">
                        <p className="text-gray-500 text-sm">No past events recorded.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  )
}

export default Members