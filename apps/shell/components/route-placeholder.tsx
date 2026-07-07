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
    <section className="ui-section ui-stack-lg">
      <div className="ui-stack-sm">
        <p className="ui-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="ui-copy">{description}</p>
      </div>

      <div className="ui-stack-sm">
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