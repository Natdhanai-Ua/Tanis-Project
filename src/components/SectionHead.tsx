interface Props {
  label: string;
  title: string;
  description?: string;
}

/** หัวข้อประจำส่วน — เส้นคาดด้านบนและป้ายกำกับตัวเล็ก แบบหัวบทของหนังสืออ้างอิง */
export function SectionHead({ label, title, description }: Props) {
  return (
    <header className="sec">
      <hr className="rule" />
      <p className="sec__label label label--wide">{label}</p>
      <h2 className="sec__title">{title}</h2>
      {description && <p className="sec__desc">{description}</p>}
    </header>
  );
}
