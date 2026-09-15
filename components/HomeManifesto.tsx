import { LuTrees } from "react-icons/lu";
import { PiHeart } from "react-icons/pi";

export function HomeManifesto() {
  return <section className="homeManifesto" aria-label="О месте">
    <LuTrees className="manifestoTrees" aria-hidden="true" />
    <div className="manifestoCopy">
      <span>ПРИРОДА. ХОРОШИЕ ЛЮДИ.<br />ВКУСНЫЕ МОМЕНТЫ.</span>
      <p>Константиновский карьер — место, где легко<br className="manifestoCopyBreak" /> отдохнуть, встретиться с друзьями и перезагрузиться.</p>
    </div>
    <p className="manifestoNote">Здесь<br />хорошо <PiHeart aria-hidden="true" /></p>
  </section>;
}
