import { Link } from "react-router-dom";

function Icon({ type }) {
  if (type === "strands") {
    return (
      <div className="logo logo-strands" aria-hidden="true">
        <span>S</span>
      </div>
    );
  }

  if (type === "crossword") {
    return (
      <div className="logo logo-crossword" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className="logo logo-connections" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default function GameCard({ to, title, subtitle, type }) {
  return (
    <Link className={`game-card game-card--${type}`} to={to}>
      <Icon type={type} />
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </Link>
  );
}
