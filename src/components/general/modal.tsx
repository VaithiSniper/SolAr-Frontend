import { MouseEventHandler, ReactElement } from "react";

export default function Modal({ id, children }: { id: string, children: ReactElement }) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn bg-red-600 hover:bg-red-700 text-white">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}
