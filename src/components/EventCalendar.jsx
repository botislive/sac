import { useAtomValue } from "jotai";
import { eventsAtom } from "../atoms/userAtom";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

function EventCalendar() {
  const events = useAtomValue(eventsAtom);
  const navigate = useNavigate();


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
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/details/${event.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/details/${event.id}`);
                }
              }}
            >
              {event.event_title}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center px-2">
        <h2 className="text-2xl font-bold text-white">SAC Schedule</h2>
        <div className="flex gap-4 text-sm font-medium text-gray-300">
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div> Upcoming</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div> Completed</span>
        </div>
      </div>

      <div className="calendar-container w-full bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
        <Calendar
          tileContent={tileContent}
          className="w-full! border-none! font-sans! text-white bg-transparent"
          tileClassName={({ date, view }) =>
            view === 'month'
              ? 'hover:bg-gray-800 transition-colors !h-32 !flex !flex-col !justify-start !items-stretch !p-1 !border-t !border-l !border-gray-800'
              : null
          }
        />
      </div>


      <style dangerouslySetInnerHTML={{
        __html: `
        .react-calendar { width: 100% !important; background: transparent; border: none !important; font-family: inherit !important; color: white; }
        .react-calendar__navigation button { color: white; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold;}
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #1f2937; border-radius: 8px; }
        .react-calendar__month-view__weekdays { font-weight: bold; text-transform: uppercase; color: #9ca3af; font-size: 0.85rem; padding: 0.5em 0; text-align: center; }
        .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
        .react-calendar__month-view__days__day--neighboringMonth { color: #4b5563; }
        .react-calendar__tile { color: white; background: transparent; padding: 0.5em 0.5em; text-align: center; }
        .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: #1f2937; border-radius: 8px; }
        .react-calendar__tile--active { background: #3b82f6 !important; color: white !important; border-radius: 8px; }
        .react-calendar__month-view__days__day { height: 128px !important; display: flex !important; flex-direction: column !important; justify-content: flex-start !important; align-items: stretch !important; border-top: 1px solid #374151 !important; border-left: 1px solid #374151 !important; }
        .react-calendar__month-view__days { border-right: 1px solid #374151; border-bottom: 1px solid #374151; }
      `}} />
    </div>
  );
}

export default EventCalendar;
