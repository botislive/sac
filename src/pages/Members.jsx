import { useAtom } from "jotai"
import { sacMemAtom } from "../atoms/userAtom"
import MemberForm from '../components/MemberForm'

function Members() {
  const [members] = useAtom(sacMemAtom)

  return (
    <div className="space-y-8">
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
                  <div key={i} className="border border-gray-700 bg-gray-800/30 rounded-xl p-5 hover:border-gray-500 transition-colors group">
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
    </div>
  )
}

export default Members