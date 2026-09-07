interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

/** หัวข้อประจำแต่ละส่วนของหน้า ให้รูปแบบสม่ำเสมอทั้งเว็บไซต์ */
export function SectionHead({ eyebrow, title, description }: Props) {
  return (
    <header className="sec">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="sec__title">{title}</h2>
      {description && <p className="sec__desc">{description}</p>}
    </header>
  );
}
