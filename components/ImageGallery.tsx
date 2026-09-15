import Image from "next/image";

type GalleryImage = {
  src: string;
  alt: string;
};

export function ImageGallery({ images, label }: { images: readonly GalleryImage[]; label: string }) {
  return (
    <section className="contentGallery pageWidth" aria-label={label}>
      {images.map((image) => (
        <figure key={image.src}>
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
        </figure>
      ))}
    </section>
  );
}
