type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  checklist: string[];
};

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  checklist,
}: RoutePlaceholderProps) {
  return (
    <section className="panel stack-lg">
      <div className="stack-sm">
        <p className="panel-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="panel-copy">{description}</p>
      </div>

      <div className="stack-sm">
        <h3 className="panel-subtitle">Next step for this route</h3>
        <ul className="checklist">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
