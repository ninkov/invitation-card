import frozenKingdom from "../assets/frozen-kingdom.jpg";
import spiderMan from "../assets/spider-man.jpg";
import marvel from "../assets/modern-avengers.jpg";
import partyDefault from "../assets/BDAI.webp";

export const templates = [
  {
    id: "birthday",
    name: "Детски рожден ден",
    accent: "#0f8ab3",
    background: partyDefault,
    fields: {
      hostName: "Ники",
      guestName: "Алекс",
      eventTitle: "Рожден ден",
      place: "Парти център Лъки",
      date: "15 юни 2026",
      time: "17:30",
      rsvpDate: "10 юни",
      note: "Ще има игри, смях и много изненади.",
    },
  },
  {
    id: "frozen",
    name: "Frozen парти",
    accent: "#56a6c8",
    background: frozenKingdom,
    fields: {
      hostName: "Ема",
      guestName: "Мая",
      eventTitle: "Приказно Frozen парти",
      place: "Парти център Лъки",
      date: "22 юни 2026",
      time: "16:00",
      rsvpDate: "18 юни",
      note: "Очакват те музика, танци и ледено красива торта.",
    },
  },
  {
    id: "spider",
    name: "Spider герой",
    accent: "#d83b3b",
    background: spiderMan,
    fields: {
      hostName: "Мартин",
      guestName: "Виктор",
      eventTitle: "Супергеройски рожден ден",
      place: "Парти център Лъки",
      date: "30 юни 2026",
      time: "18:00",
      rsvpDate: "25 юни",
      note: "Облечи се удобно за мисии, игри и героични снимки.",
    },
  },
  {
    id: "marvel",
    name: "Marvel покана",
    accent: "#f0b23f",
    background: marvel,
    fields: {
      hostName: "Дани",
      guestName: "Крис",
      eventTitle: "Avengers рожден ден",
      place: "Парти център Лъки",
      date: "7 юли 2026",
      time: "17:00",
      rsvpDate: "3 юли",
      note: "Събираме отбора за игри, снимки и празнични изненади.",
    },
  },
];

export const fieldLabels = {
  guestName: "Име на гост",
  hostName: "Име на празнуващ",
  eventTitle: "Заглавие",
  place: "Място",
  date: "Дата",
  time: "Час",
  rsvpDate: "Потвърждение до",
  note: "Допълнителен текст",
};

export const shareTargets = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "viber", label: "Viber" },
  { id: "facebook", label: "Facebook" },
];

export const layoutOptions = [
  { id: "upper", label: "Горе" },
  { id: "middle", label: "Среда" },
  { id: "lower", label: "Долу" },
];

export { partyDefault };
