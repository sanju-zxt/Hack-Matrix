import { venue } from "../../data/eventConfig";

export default function ContactMap() {
  return (
    <iframe
      title="VVIT campus map"
      src={venue.mapsEmbedUrl}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="block min-h-64 max-h-[26rem] aspect-[16/9] sm:h-72 w-full max-w-full border-0"
    />
  );
}