"use client";

const ITEMS = [
  "FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 299",
  "USE O CUPOM BEMVINDO10 E GANHE 10% OFF NA PRIMEIRA COMPRA",
  "QUALIDADE PREMIUM DESDE 2013",
  "ENVIO PARA TODO O BRASIL",
  "31.000+ ORIGINAIS NA COMUNIDADE FBG",
  "NOVOS DROPS TODA SEMANA",
];

/* Duplicamos para loop contínuo e sem salto */
const TRACK = [...ITEMS, ...ITEMS];

export default function TickerBar() {
  return (
    <div
      style={{
        background: "#111111",
        borderBottom: "1px solid rgba(181,150,114,0.22)",
        overflow: "hidden",
        height: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "fbg-ticker 32s linear infinite",
          willChange: "transform",
        }}
      >
        {TRACK.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "20px",
              padding: "0 36px",
              whiteSpace: "nowrap",
              fontSize: "0.56rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#B59672",
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {item}
            <span
              style={{
                color: "rgba(181,150,114,0.35)",
                fontSize: "0.45rem",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes fbg-ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
