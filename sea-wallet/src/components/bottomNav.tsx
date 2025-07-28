import { usePopupStore } from "~statusManager/statusHolder"

const tabs = [
  { key: "home", label: "Home" },
  { key: "app", label: "App" },
  { key: "chat", label: "Chat" }
] as const

export default function BottomNav() {
  const setState = usePopupStore((s) => s.setState)

  return (
    <div className="plasmo-flex plasmo-justify-around plasmo-border-t plasmo-p-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setState(tab.key)}
          className="plasmo-px-3 plasmo-py-1 plasmo-text-sm"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
