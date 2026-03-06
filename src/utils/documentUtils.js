const getDefaultExport = (mod) => mod?.default ?? mod;
const TEMPLATE_FILE = "word/document.xml";
const TOKEN_REGEX = /\{(?:event_title|club_name|department|date|coordinators|faculty_coordinator|student_coordinators_block|circular_ref_no|circular_issue_date)\}/;
const DEFAULT_FACULTY_COORDINATOR = "Mrs. B.Bharani, Asst. Prof, Dept of ECE, Ph. No: 7893255292";
const PARAGRAPH_REGEX = /<w:p\b[\s\S]*?<\/w:p>/g;

const formatDateForCircular = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatIssueDate = (value) => {
    const parsed = value ? new Date(value) : new Date();
    if (Number.isNaN(parsed.getTime())) return String(value || "");
    const day = parsed.getDate();
    const suffix = (d) => {
        if (d >= 11 && d <= 13) return "th";
        if (d % 10 === 1) return "st";
        if (d % 10 === 2) return "nd";
        if (d % 10 === 3) return "rd";
        return "th";
    };
    const month = parsed.toLocaleString("en-IN", { month: "long" });
    const year = parsed.getFullYear();
    return `${day}${suffix(day)} ${month} ${year}`;
};

const getAcademicYear = (value) => {
    const parsed = value ? new Date(value) : new Date();
    if (Number.isNaN(parsed.getTime())) return "2025-26";
    const year = parsed.getFullYear();
    const next = String((year + 1) % 100).padStart(2, "0");
    return `${year}-${next}`;
};

const buildCircularRefNo = (event) => {
    if (event.circular_ref_no) return event.circular_ref_no;
    const clubPart = (event.club_name || "Club").replace(/\s+/g, "");
    const ay = getAcademicYear(event.date || event.issue_date);
    const serial = String(event.id || "01");
    return `VIIT/ DSA/${clubPart}-SAC/${ay}/Circular/${serial}`;
};

const stripXml = (value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const escapeXml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

const makeParagraphFromTemplate = (templateParagraph, text) => {
    const pPr = templateParagraph.match(/<w:pPr[\s\S]*?<\/w:pPr>/)?.[0] || "";
    return `<w:p>${pPr}<w:r><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
};

const replaceParagraphGroup = (xml, needles, replacementTexts) => {
    const matches = [];
    for (const match of xml.matchAll(PARAGRAPH_REGEX)) {
        const paragraph = match[0];
        const plain = stripXml(paragraph);
        if (needles.some((needle) => plain.includes(needle))) {
            matches.push({
                start: match.index,
                end: match.index + paragraph.length,
                paragraph,
            });
        }
    }
    if (matches.length === 0) return xml;

    const replacement = replacementTexts
        .filter(Boolean)
        .map((text) => makeParagraphFromTemplate(matches[0].paragraph, text))
        .join("");
    if (!replacement) return xml;

    let updated = xml;
    for (let i = matches.length - 1; i >= 0; i -= 1) {
        const block = i === 0 ? replacement : "";
        updated = `${updated.slice(0, matches[i].start)}${block}${updated.slice(matches[i].end)}`;
    }
    return updated;
};

const applyBaseTemplateReplacements = (zip) => {
    const docFile = zip.file(TEMPLATE_FILE);
    if (!docFile) throw new Error("Invalid template: word/document.xml not found");

    let xml = docFile.asText();

    const replacements = [
        [" Dance Mania-2025 – Dance Competition", " {event_title}"],
        ["Nataraja Dance Club", "{club_name}"],
        ["Department of ECE", "Department of {department}"],
        ["Dance Mania-2025", "{event_title}"],
        ["25th and 26th September 2025", "{date}"],
    ];

    let replacedCount = 0;
    for (const [from, to] of replacements) {
        if (xml.includes(from)) {
            xml = xml.replace(from, to);
            replacedCount += 1;
        }
    }

    if (!TOKEN_REGEX.test(xml) && replacedCount === 0) {
        throw new Error("Template has no placeholders and no known base markers to convert");
    }

    xml = replaceParagraphGroup(
        xml,
        ["VIIT/ DSA/"],
        ["{circular_ref_no}\t\t{circular_issue_date}"]
    );
    xml = replaceParagraphGroup(
        xml,
        ["B.Bharani"],
        ["{faculty_coordinator}"]
    );
    xml = replaceParagraphGroup(
        xml,
        ["Prakriti", "Pavan Kumar", "Likitha"],
        ["{student_coordinators_block}"]
    );

    zip.file(TEMPLATE_FILE, xml);
};

const getTemplateCandidates = () => {
    const baseUrl = (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) || "/";
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return [
        `${normalizedBase}Circular-Format.docx`,
        "/Circular-Format.docx",
        "./Circular-Format.docx",
    ];
};

const fetchTemplate = async () => {
    const candidates = [...new Set(getTemplateCandidates())];
    for (const candidate of candidates) {
        try {
            const response = await fetch(candidate);
            if (response.ok) return response;
        } catch {
            // Try next candidate path.
        }
    }
    throw new Error("Failed to fetch template from known paths");
};

const saveBlob = (blob, filename) => {
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
};

export const generateCircular = async (event, members = []) => {
    try {
        const [{ default: DocxtemplaterModule }, { default: PizZipModule }] = await Promise.all([
            import("docxtemplater"),
            import("pizzip"),
        ]);
        const Docxtemplater = getDefaultExport(DocxtemplaterModule);
        const PizZip = getDefaultExport(PizZipModule);

        const response = await fetchTemplate();

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const zip = new PizZip(arrayBuffer);
        applyBaseTemplateReplacements(zip);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            nullGetter() {
                return ""; // If a variable is missing, replace it with an empty string
            }
        });

        // Parse coordinators
        let coordNames = [];
        if (Array.isArray(event.coordinators)) {
            coordNames = event.coordinators
                .map((c) => (typeof c === "object" ? c?.name : c))
                .filter(Boolean);
        } else if (typeof event.coordinators === "string") {
            coordNames = event.coordinators
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean);
        }
        const coordsStr = coordNames.join(", ");
        const studentCoordinatorLines = coordNames.map((name) => {
            const member = (members || []).find((item) => item?.name === name);
            if (!member) return name;
            const details = [member.year, member.branch, member.department ? `Dept of ${member.department}` : null]
                .filter(Boolean)
                .join(", ");
            const phone = member.phone ? `, Ph. No: ${member.phone}` : "";
            return details ? `${name}, ${details}${phone}` : `${name}${phone}`;
        });

        // Set the template variables
        doc.render({
            event_title: event.event_title || "",
            club_name: event.club_name || "",
            department: event.department || "",
            date: formatDateForCircular(event.date || ""),
            coordinators: coordsStr,
            faculty_coordinator: event.faculty_coordinator || DEFAULT_FACULTY_COORDINATOR,
            student_coordinators_block: studentCoordinatorLines.join("\n") || coordsStr || "To be announced",
            circular_ref_no: buildCircularRefNo(event),
            circular_issue_date: formatIssueDate(event.issue_date || event.date),
        });

        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        const safeTitle = (event.event_title || "event").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        saveBlob(out, `Circular_${safeTitle}.docx`);

    } catch (error) {
        console.error("Error generating circular:", error);
        throw error;
    }
};
