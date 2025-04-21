import { SiGmail } from "react-icons/si";
const socialMedia = [
  {
    id: 1,
    img: "./git.svg",
    link: "#", // Removed personal GitHub link
  },
];

export const Social = () => {
  return (
    <div className="flex items-center md:gap-3 gap-6 order-1 md:order-2">
      <div
        key="email"
        className="w-10 h-10 cursor-pointer flex justify-center items-center border"
      >
        <a href="#"> {/* Removed personal email */}
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
