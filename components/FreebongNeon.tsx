export default function FreebongNeon() {
  return (
    <div
      className="w-full flex justify-center items-center overflow-hidden"
      style={{
        background: "#000",
        paddingTop: "clamp(64px, 10vw, 120px)",
        paddingBottom: "clamp(64px, 10vw, 120px)",
      }}
    >
      <h1
        className="animate-dimlight box-reflect relative w-full uppercase text-center outline-none select-none"
        style={{
          fontSize: "clamp(2.8rem, 12vw, 10rem)",
          letterSpacing: "clamp(6px, 2vw, 20px)",
          lineHeight: "0.70em",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
        }}
      >
        FREEBONG
      </h1>
    </div>
  );
}
