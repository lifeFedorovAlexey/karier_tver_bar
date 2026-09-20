import { Logo } from "./Logo";
import { ClockIcon, PinIcon, PhoneIcon } from "./icons";
import { site } from "@/lib/site";
import { FaTelegramPlane } from "react-icons/fa";
import { BiLogoVk } from "react-icons/bi";
import { SiInstagram } from "react-icons/si";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footerMain pageWidth">
        <div className="footerBrand"><Logo light variant="footer" /></div>
        <div className="footerContacts">
          <a href={site.phoneHref}><PhoneIcon size={18} />{site.phoneLabel}</a>
          <span><PinIcon size={18} />{site.address}</span>
          <span><ClockIcon size={18} />{site.hours}</span>
          <div className="footerSocials" aria-label="Социальные сети">
            <a className="footerSocial" href="https://vk.ru/tverplazh" target="_blank" rel="noreferrer" aria-label="Карьер во ВКонтакте"><BiLogoVk aria-hidden="true" /></a>
            <a className="footerSocial footerTelegram" href="https://t.me/restinginthetver" target="_blank" rel="noreferrer" aria-label="Карьер в Telegram"><FaTelegramPlane aria-hidden="true" /></a>
            <a className="footerSocial" href="https://www.instagram.com/tverplazh/" target="_blank" rel="noreferrer" aria-label="Карьер в Instagram"><SiInstagram aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
