import EventForm from "../components/EventForm"
import EventDetails from "../components/EventDetails"
import EventCalendar from "../components/EventCalendar"

function Events() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Events Log</h1>
                <p className="text-gray-400 mt-1">Manage, view, and schedule all SAC events.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                            <h2 className="text-xl font-semibold text-white">Add New Event</h2>
                        </div>
                        <div className="p-6">
                            <EventForm />
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                            <h2 className="text-xl font-semibold text-white">Calendar</h2>
                        </div>
                        <div className="p-6 flex justify-center custom-calendar-container">
                            <EventCalendar />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-xl overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                            <h2 className="text-xl font-semibold text-white">Event Entries</h2>
                        </div>
                        <div className="p-6">
                            <EventDetails />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Events