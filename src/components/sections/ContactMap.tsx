import { venue } from "../../data/eventConfig";

export default function ContactMap() {
  return (
    <iframe
      title="VVIT campus map"
      src={venue.mapsEmbedUrl}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="h-72 w-full border-0"
    />
  );
}