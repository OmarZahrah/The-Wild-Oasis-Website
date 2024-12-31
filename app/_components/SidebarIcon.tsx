import Image from "next/image";

export default function SidebarIcon() {
  return (
    <div>
      <Image
        width={24}
        height={24}
        src="/menuIcon.svg"
        alt=""
        className="absolute bg-white left-[-1rem] top-[-2rem]"
      />
    </div>
  );
}
