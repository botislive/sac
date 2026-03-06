import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

function ExportMenu({ onExportCSV, onExportPDF, label = 'Export' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handle = (fn, format) => {
        try {
            fn();
            toast.success(`${label} exported as ${format}!`);
        } catch {
            toast.error(`Failed to export ${format}. Please try again.`);
        }
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-sm font-medium hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 group"
            >
                
                <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M6 10V6a1 1 0 011-1h10a1 1 0 011 1v4" />
                </svg>
                Export
                <svg
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-30 overflow-hidden animate-in">
                    <p className="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-800">
                        Export as
                    </p>

                    <button
                        onClick={() => handle(onExportCSV, 'CSV')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                    >
                        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0">
                            CSV
                        </span>
                        <div className="text-left">
                            <p className="font-medium">Spreadsheet (CSV)</p>
                            <p className="text-xs text-gray-500">Excel, Google Sheets</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handle(onExportPDF, 'PDF')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
                    >
                        <span className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold shrink-0">
                            PDF
                        </span>
                        <div className="text-left">
                            <p className="font-medium">Document (PDF)</p>
                            <p className="text-xs text-gray-500">Print-ready report</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ExportMenu;
