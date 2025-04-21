import { Social } from "./Social";

export const BuyMeCoffee = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center gap-y-8">
        <h3 className="ThemeText !text-left text-xl">Buy Me A Coffee</h3>
        <div className="flex flex-col items-start h-full ">
          <img
            src="./bmc_qr.png"
            width={150}
            height={150}
            alt="buy_me_coffee_qr"
            className="rounded-lg"
          />
        </div>

        <a href="#" target="_blank"> {/* Removed personal Buy Me Coffee link */}
          <button className="px-8 rounded-none hover:underline">
            <span className="text-lg ">Click here to buy me a coffee</span>
            <span className="ml-4 text-2xl">☕</span>
          </button>
        </a>

        <Social />
      </div>
    </div>
  );
};
