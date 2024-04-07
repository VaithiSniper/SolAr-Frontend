import Image from "next/image"

export default function AvatarGroup({ imageOrCharGroup }: { imageOrCharGroup: string[] }) {
  const toDisplay = imageOrCharGroup.length > 2 ? imageOrCharGroup.slice(0, 2) : imageOrCharGroup
  return (
    <div className="avatar-group -space-x-4 rtl:space-x-reverse">
      {
        toDisplay.map((imageOrChar) => (
          <div className="avatar placeholder w-12 h-12 bg-neutral text-neutral-content border-yellow-50 border text-center" key={imageOrChar}>
            <span className="text-xl mx-auto my-auto">{imageOrChar}</span>
            <div className="absolute inset-0 rounded-full border border-yellow-400 blur-[2px] opacity-90" />
            <div className="absolute inset-0 rounded-full border border-yellow-500 blur-[2px] opacity-70" />
            <div className="absolute inset-0 rounded-full border border-yellow-100 blur-[2px] opacity-80" />
            <div className="absolute inset-0 rounded-full border border-yellow-800 blur-[2px] opacity-90" />
            <div className="absolute inset-0 rounded-full border border-yellow-700 blur-[2px] opacity-80" />
            <div className="absolute inset-0 rounded-full border border-yellow-400 blur-[4px] opacity-70" />
          </div>
        ))
      }
      <div className="avatar w-12 h-12 placeholder">
        <div className="w-12 bg-neutral text-neutral-content">
          <span>{imageOrCharGroup.length > 2 ? imageOrCharGroup.length - 2 : imageOrCharGroup.length}+</span>
        </div>
      </div>
    </div>
  )
}
