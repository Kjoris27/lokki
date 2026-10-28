"use client";

import { useId, useState } from "react";
import { CalendarDays, ArrowRight, Clock3, Truck } from "lucide-react";
import type { Article } from "@/lib/types";
import {
  canBook,
  calcTotal,
  formatDate,
  formatPrice,
  isDateRangeAvailable,
  rentalEnd,
} from "@/lib/utils";
import { HOLIDAY_PROMOTION } from "@/lib/offer";
import { useBookingClock } from "@/lib/use-booking-clock";

export default function RentalForm({
  article,
  initialStart = "",
  initialDays = 1,
  onSave,
  onCancel,
  label = "Ajouter à ma réservation",
}: {
  article: Article;
  initialStart?: string;
  initialDays?: number;
  onSave: (start: string, end: string) => void;
  onCancel?: () => void;
  label?: string;
}) {
  const id = useId();
  const now = useBookingClock();
  const [start, setStart] = useState(initialStart);
  const [days, setDays] = useState(initialDays);
  const [error, setError] = useState("");
  const end = rentalEnd(start, days);
  const available =
    start && end ? isDateRangeAvailable(article, start, end) : true;
  const valid = start && end && canBook(article, start, end);
  const base = article.pricePerDay * days;
  const total = calcTotal(article.pricePerDay, days);

  return (
    <form
      className="rental-form"
      onSubmit={(event) => {
        event.preventDefault();
        if (!canBook(article, start, end)) {
          setError(
            "Choisissez une date future disponible et une durée valide.",
          );
          return;
        }
        setError("");
        onSave(start, end);
      }}
    >
      <div className="form-heading">
        <CalendarDays size={18} />
        <h3>On joue quand ?</h3>
      </div>
      <div className="rental-fields">
        <div className="field">
          <label htmlFor={`${id}-start`}>Livraison souhaitée</label>
          <input
            id={`${id}-start`}
            type="datetime-local"
            required
            min={now}
            value={start}
            onChange={(event) => {
              setStart(event.target.value);
              setError("");
            }}
            aria-describedby={`${id}-time-note`}
          />
        </div>
        <div className="field">
          <label htmlFor={`${id}-days`}>Durée (jours de 24 h)</label>
          <input
            id={`${id}-days`}
            type="number"
            min={article.conditions.minDuration}
            step="1"
            required
            value={days || ""}
            onChange={(event) => {
              setDays(event.target.valueAsNumber || 0);
              setError("");
            }}
          />
        </div>
      </div>
      <p id={`${id}-time-note`} className="field-help">
        Heure de Lomé. Le créneau sera confirmé sur WhatsApp.
      </p>
      {end && (
        <div className="return-time">
          <Clock3 size={16} />
          <div>
            <span>Restitution prévue</span>
            <strong>{formatDate(end)}</strong>
          </div>
        </div>
      )}
      {!available && (
        <p className="form-error" role="alert">
          Le pack est indisponible sur ces dates. Choisissez un autre moment.
        </p>
      )}
      {now && start && start <= now && (
        <p className="form-error" role="alert">
          Choisissez une heure de livraison dans le futur.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="booking-breakdown">
        <div>
          <span>
            Pack × {days || 0} jour{days > 1 ? "s" : ""} de 24 h
          </span>
          <span>{formatPrice(base)}</span>
        </div>
        {HOLIDAY_PROMOTION.enabled && (
          <div className="discount-line">
            <span>Fêtes · −{HOLIDAY_PROMOTION.discountPercent} %</span>
            <span>−{formatPrice(base - total)}</span>
          </div>
        )}
        <div>
          <span className="inline-icon">
            <Truck size={14} /> Livraison
          </span>
          <strong className="green-text">Gratuite</strong>
        </div>
        <div className="booking-total">
          <strong>Total de la location</strong>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
      <button className="button button-primary" type="submit" disabled={!valid}>
        {label}
        <ArrowRight size={17} />
      </button>
      {onCancel && (
        <button className="text-button" type="button" onClick={onCancel}>
          Annuler les modifications
        </button>
      )}
    </form>
  );
}
