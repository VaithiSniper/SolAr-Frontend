export default function Avatar({ imageOrChar = 'M', mini = false }: { imageOrChar: string, mini?: boolean }) {

  return (
    <div className="avatar placeholder mx-auto my-8 border-yellow-50 border-4 rounded-full">
      <div className={`bg-neutral text-neutral-content rounded-full ${mini ? "w-8" : "w-24"}`}>
        <span className={`${mini ? "text-sm" : "text-3xl"}`}>{imageOrChar}</span>
        {
          !mini ?
            <>
              <div className="absolute inset-0 rounded-full border-2 border-yellow-400 blur-[10px] opacity-90" />
              <div className="absolute inset-0 rounded-full border-2 border-yellow-500 blur-[20px] opacity-70" />
              <div className="absolute inset-0 rounded-full border-2 border-yellow-100 blur-[30px] opacity-80" />
            </>
            : null
        }
        <div className="absolute inset-0 rounded-full border-2 border-yellow-800 blur-[40px] opacity-90" />
        <div className="absolute inset-0 rounded-full border-2 border-yellow-700 blur-[50px] opacity-80" />
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400 blur-[60px] opacity-70" />
      </div>
    </div>

  )
}
