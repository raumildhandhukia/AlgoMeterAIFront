import { CgWebsite } from "react-icons/cg";
import { SiGmail } from "react-icons/si";
const socialMedia = [
  {
    id: 1,
    img: "/src/assets/git.svg",
    link: "https://github.com/raumildhandhukia",
  },
  {
    id: 3,
    img: "/src/assets/link.svg",
    link: "https://www.linkedin.com/in/raumild/",
  },
];

export const Social = () => {
  return (
    <div className="flex items-center md:gap-3 gap-6 order-1 md:order-2">
      <button className="py-2 rounded-none border">
        <a href="https://raumild.com">
          <div className="flex items-center gap-4 px-2">
            <CgWebsite className="w-6 h-6" />
          </div>
        </a>
      </button>

      <div
        key="email"
        className="w-10 h-10 cursor-pointer flex justify-center items-center border"
      >
        <a href="mailto:raumild@gmail.com">
          <SiGmail />
        </a>
      </div>
      {socialMedia.map((info) => (
        <div
          key={info.id}
          className="w-10 h-10 cursor-pointer flex justify-center items-center border"
        >
          <a href={info.link}>
            <img src={info.img} alt="icons" width={25} height={25} />
          </a>
        </div>
      ))}
    </div>
  );
};
