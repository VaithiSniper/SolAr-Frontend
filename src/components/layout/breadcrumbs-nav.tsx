import Link from "next/link";

export type Crumb = {
  name: string;
  link: string;
}

export default function BreadcrumbsNavComponent(props: { data: Crumb[] }) {

  const currentClassnames = "font-bold underline text-white"

  return (
    <div className="text-sm p-3 text-gray-800 bg-violet-300 breadcrumbs font-semibold">
      <ul>
        {
          props.data.map(({ name, link }, index) =>
            <li key={name + index.toString()}><Link href={link} className={index === (props.data.length - 1) ? currentClassnames : ""}>{name}</Link></li>
          )
        }
      </ul>
    </div >
  )
}
