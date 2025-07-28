import React from "react"

export default function InitView() {
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-min-h-screen plasmo-bg-gray-100 px-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="plasmo-w-24 plasmo-h-24 plasmo-bg-gray-300 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-lg plasmo-font-bold">
          Logo
        </div>
      </div>

      {/* zklogin */}
      <button className="plasmo-w-56 plasmo-py-3 plasmo-mb-4 plasmo-bg-blue-500 plasmo-text-white plasmo-rounded-xl hover:plasmo-bg-blue-600 transition">
        zklogin
      </button>

      {/* line */}
      <div className="plasmo-w-full plasmo-max-w-xs plasmo-border-t plasmo-mb-4"></div>

      {/* Create New Seed Phrase */}
      <button className="plasmo-w-56 plasmo-py-3 plasmo-mb-3 plasmo-bg-green-500 plasmo-text-white plasmo-rounded-xl hover:plasmo-bg-green-600 transition">
        Create New Seed Phrase
      </button>

      {/* Import Seed Phrase */}
      <button className="plasmo-w-56 plasmo-py-3 plasmo-bg-purple-500 plasmo-text-white plasmo-rounded-xl hover:plasmo-bg-purple-600 transition">
        Import Seed Phrase
      </button>
    </div>
  )
}
