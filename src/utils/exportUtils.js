import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
};

const getCoordinatorNames = (coordinators = []) =>
    coordinators
        .map(c => (typeof c === 'string' ? c : c?.name))
        .filter(Boolean)
        .join(', ') || 'None';

// ─── CSV helpers ────────────────────────────────────────────────────────────

const csvEscape = (val) => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
};

const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

// ─── PDF styles ─────────────────────────────────────────────────────────────

const PDF_COLORS = {
    primary: [37, 99, 235],       // blue-600
    accent: [99, 102, 241],      // indigo-500
    header: [17, 24, 39],        // gray-900
    rowEven: [31, 41, 55],        // gray-800
    rowOdd: [17, 24, 39],        // gray-900
    text: [255, 255, 255],     // white
    subtext: [156, 163, 175],     // gray-400
    success: [16, 185, 129],      // emerald-500
    warning: [245, 158, 11],      // amber-500
};

const buildPDF = (title, subtitle) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    // Dark background
    doc.setFillColor(...PDF_COLORS.header);
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    // Header accent bar
    doc.setFillColor(...PDF_COLORS.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 56, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('SAC Log Book', 30, 25);

    // Subtitle / report name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(199, 210, 254); // indigo-200
    doc.text(title, 30, 43);

    // Page subtitle (date/meta)
    const dateStr = `Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    doc.setFontSize(9);
    doc.setTextColor(...PDF_COLORS.subtext);
    const pageW = doc.internal.pageSize.width;
    doc.text(dateStr, pageW - 30, 43, { align: 'right' });

    if (subtitle) {
        doc.setFontSize(9);
        doc.setTextColor(...PDF_COLORS.subtext);
        doc.text(subtitle, 30, 74);
    }

    return doc;
};

// ─── Events Export ──────────────────────────────────────────────────────────

export const exportEventsCSV = (events) => {
    const headers = ['#', 'Event Title', 'Club', 'Date', 'Status', 'Coordinators'];
    const rows = events.map((e, i) => [
        i + 1,
        e.event_title,
        e.club_name,
        formatDate(e.date),
        e.is_complete ? 'Completed' : 'Upcoming',
        getCoordinatorNames(e.coordinators),
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(csvEscape).join(','))
        .join('\n');

    downloadFile(`SAC_Events_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
};

export const exportEventsPDF = (events) => {
    const doc = buildPDF('Events Log Report', `Total Events: ${events.length}  |  Completed: ${events.filter(e => e.is_complete).length}  |  Upcoming: ${events.filter(e => !e.is_complete).length}`);

    const tableRows = events.map((e, i) => [
        i + 1,
        e.event_title,
        e.club_name,
        formatDate(e.date),
        e.is_complete ? 'Completed' : 'Upcoming',
        getCoordinatorNames(e.coordinators),
    ]);

    autoTable(doc, {
        startY: 86,
        head: [['#', 'Event Title', 'Club', 'Date', 'Status', 'Coordinators']],
        body: tableRows,
        styles: {
            font: 'helvetica',
            fontSize: 9,
            textColor: PDF_COLORS.text,
            cellPadding: { top: 7, right: 8, bottom: 7, left: 8 },
            lineColor: [55, 65, 81],
            lineWidth: 0.5,
        },
        headStyles: {
            fillColor: PDF_COLORS.accent,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        alternateRowStyles: { fillColor: PDF_COLORS.rowEven },
        bodyStyles: { fillColor: PDF_COLORS.rowOdd },
        columnStyles: {
            0: { cellWidth: 28 },
            4: {
                fontStyle: 'bold',
                textColor: (cell) =>
                    cell.raw === 'Completed' ? PDF_COLORS.success : PDF_COLORS.warning,
            },
        },
        didParseCell(data) {
            if (data.section === 'body' && data.column.index === 4) {
                data.cell.styles.textColor =
                    data.cell.raw === 'Completed' ? PDF_COLORS.success : PDF_COLORS.warning;
            }
        },
        margin: { left: 30, right: 30 },
        tableLineColor: [55, 65, 81],
        tableLineWidth: 0.5,
    });

    doc.save(`SAC_Events_${Date.now()}.pdf`);
};

// ─── Members Export ─────────────────────────────────────────────────────────

export const exportMembersCSV = (members) => {
    const headers = ['#', 'Name', 'Role / Post', 'Branch', 'Year', 'Phone'];
    const rows = members.map((m, i) => [
        i + 1,
        m.name,
        m.post,
        m.branch || 'N/A',
        m.year || 'N/A',
        m.phone || 'N/A',
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(csvEscape).join(','))
        .join('\n');

    downloadFile(`SAC_Members_${Date.now()}.csv`, csv, 'text/csv;charset=utf-8;');
};

export const exportMembersPDF = (members) => {
    const doc = buildPDF('Members Directory Report', `Total Members: ${members.length}`);

    const tableRows = members.map((m, i) => [
        i + 1,
        m.name,
        m.post,
        m.branch || 'N/A',
        m.year ? `Year ${m.year}` : 'N/A',
        m.phone || 'N/A',
    ]);

    autoTable(doc, {
        startY: 86,
        head: [['#', 'Name', 'Role / Post', 'Branch', 'Year', 'Phone']],
        body: tableRows,
        styles: {
            font: 'helvetica',
            fontSize: 9,
            textColor: PDF_COLORS.text,
            cellPadding: { top: 7, right: 8, bottom: 7, left: 8 },
            lineColor: [55, 65, 81],
            lineWidth: 0.5,
        },
        headStyles: {
            fillColor: PDF_COLORS.accent,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        alternateRowStyles: { fillColor: PDF_COLORS.rowEven },
        bodyStyles: { fillColor: PDF_COLORS.rowOdd },
        columnStyles: {
            0: { cellWidth: 28 },
            1: { fontStyle: 'bold' },
        },
        margin: { left: 30, right: 30 },
        tableLineColor: [55, 65, 81],
        tableLineWidth: 0.5,
    });

    doc.save(`SAC_Members_${Date.now()}.pdf`);
};
