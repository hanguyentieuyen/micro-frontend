import { Badge, Card, CardContent, CardHeader, CardTitle, SectionHeading } from '@commerce/shared-ui';

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
    <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      </CardHeader>

      <CardContent className="space-y-3">
        <Badge variant="subtle" className="w-fit uppercase tracking-[0.24em]">
          Next step for this route
        </Badge>
        <ul className="grid gap-3">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-border/70 bg-muted/60 px-4 py-3 text-sm leading-7 text-muted-foreground"
            >
              <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

