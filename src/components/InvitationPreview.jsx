import { forwardRef } from "react";

const InvitationPreview = forwardRef(function InvitationPreview(
  { accent, background, card, contentPosition, photo },
  ref,
) {
  return (
    <section className="preview-panel" aria-label="Преглед на покана">
      <div
        ref={ref}
        id="card"
        className={`invitation-card content-${contentPosition}`}
        style={{
          "--accent": accent,
        }}
      >
        <img className="card-background" src={background} alt="" aria-hidden="true" />
        <div className="card-overlay" />
        <div className="card-content">
          <p className="card-kicker">Покана за</p>
          <h2>{card.eventTitle}</h2>
          <p className="guest-line">Скъпи {card.guestName},</p>
          <p className="invite-copy">
            {card.hostName} те кани да празнувате заедно в {card.place}.
          </p>

          <div className="event-details">
            <span>{card.date}</span>
            <span>{card.time}</span>
          </div>

          <p className="note">{card.note}</p>
          <p className="rsvp">Потвърди до {card.rsvpDate}</p>
        </div>

        {photo && (
          <div className="photo-frame">
            <img src={photo} alt="Снимка за поканата" />
          </div>
        )}
      </div>
    </section>
  );
});

export default InvitationPreview;
