import { useAtomValue } from "jotai";
import { eventsAtom } from "../atoms/userAtom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function EventCalendar() {
  const events = useAtomValue(eventsAtom);

 
  const getFormattedDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = getFormattedDate(date);
      const dayEvents = events.filter(event => getFormattedDate(event.date) === dateStr);

      return (
        <div className="flex flex-col gap-1 mt-1 w-full overflow-hidden">
          {dayEvents.map((event, index) => (
            <div 
              key={index} 
              className={`text-[10px] px-1 py-0.5 rounded truncate text-white shadow-sm
                ${event.is_complete ? 'bg-green-500/80' : 'bg-blue-600/80'}`}
              title={event.event_title}
            >
              {event.event_title}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-200 max-w-4xl mx-auto my-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">SAC Schedule</h2>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Upcoming</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded"></div> Completed</span>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar 
          tileContent={tileContent}
          className="w-full! border-none! font-sans!"
          tileClassName={({ date, view }) => 
            view === 'month' 
              ? 'hover:bg-slate-50 transition-colors !h-24 !flex !flex-col !justify-start !items-center !p-1 !border-slate-100' 
              : null
          }
        />
      </div>

     
      <style dangerouslySetInnerHTML={{ __html: `
        .react-calendar__month-view__days__day--neighboringMonth { color: #cbd5e1; }
        .react-calendar__tile--active { background: #3b82f6 !important; color: white !important; border-radius: 8px; }
        .react-calendar__navigation button:enabled:hover { background-color: #f1f5f9; border-radius: 8px; }
        .react-calendar__month-view__weekdays { font-weight: bold; text-transform: uppercase; color: #64748b; font-size: 0.75rem; }
      `}} />
    </div>
  );
}

export default EventCalendar;