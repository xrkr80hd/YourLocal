'use client';

export default function AdminAccordionSection({ title, note = '', defaultOpen = false, children }) {
  return (
    <details className="admin-accordion" open={defaultOpen}>
      <summary>
        <span className="admin-accordion-title">{title}</span>
        {note ? <span className="admin-accordion-note">{note}</span> : null}
      </summary>
      <div className="admin-accordion-body">{children}</div>
    </details>
  );
}
