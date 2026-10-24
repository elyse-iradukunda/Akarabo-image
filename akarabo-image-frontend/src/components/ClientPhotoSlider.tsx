import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../assets';
import type { ClientPhoto } from '../data/clientPhotos';

export interface ClientPhotoSliderProps {
  /** Slides rendered one after the other inside the track. */
  slides: ClientPhoto[];
  /** Whether the track advances on its own. Defaults to true. */
  autoPlay?: boolean;
  /** Delay between two slides in milliseconds. Defaults to 6000. */
  intervalMs?: number;
}

/**
 * Sliding gallery of client photos.
 *
 * The track translates horizontally, one whole slide per step. It supports
 * autoplay (pausing on hover), arrow navigation and dot indicators, and
 * loops back to the first slide.
 */
export function ClientPhotoSlider({
  slides,
  autoPlay = true,
  intervalMs = 6000,
}: ClientPhotoSliderProps) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (next: number) => {
    const target = ((next % count) + count) % count;
    setIndex(target);
  };

  useEffect(() => {
    if (!autoPlay || paused || count < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoPlay, paused, count, intervalMs]);

  const active = slides[index];

  return (
    <div
      className="ak-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="ak-slider__viewport">
        <div
          className="ak-slider__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((client) => (
            <div className="ak-slider__slide" key={client.id}>
              <img src={client.src} alt={[client.name, client.event].filter(Boolean).join(' — ') || 'Studio portfolio photo'} />
              <div className="ak-slider__caption">
                <p className="ak-slider__caption-name">{client.name}</p>
                <p className="ak-slider__caption-event">{client.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            className="ak-slider__arrow ak-slider__arrow--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Previous client photo"
          >
            <ChevronLeftIcon size={22} />
          </button>
          <button
            type="button"
            className="ak-slider__arrow ak-slider__arrow--next"
            onClick={() => goTo(index + 1)}
            aria-label="Next client photo"
          >
            <ChevronRightIcon size={22} />
          </button>

          <div className="ak-slider__dots">
            {slides.map((client, slideIndex) => (
              <button
                key={client.id}
                type="button"
                className={
                  slideIndex === index ? 'ak-slider__dot ak-slider__dot--active' : 'ak-slider__dot'
                }
                onClick={() => goTo(slideIndex)}
                aria-label={`Show photo ${slideIndex + 1}: ${client.name}`}
              />
            ))}
          </div>
        </>
      )}

      {count > 1 && active && (
        <span className="ak-slider__sr-only" aria-live="polite">
          Photo {index + 1} of {count}: {active.name}
        </span>
      )}
    </div>
  );
}

export default ClientPhotoSlider;
