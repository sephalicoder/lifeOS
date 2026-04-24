export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <h2 className="font-head text-xl font-light text-txt-1 mb-5">{title}</h2>
        {children}
      </div>
    </div>
  )
}

export function ModalActions({ children }) {
  return <div className="flex justify-end gap-3 mt-5">{children}</div>
}

export function FormGroup({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-[11px] text-txt-2 tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}
