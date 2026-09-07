import { pad2 } from '../lib/format';

interface Props {
  index: number;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
}

/** หัวข้อประจำแต่ละส่วนของหน้า ให้รูปแบบสม่ำเสมอทั้งเว็บไซต์ */
export function SectionHead({ index, eyebrow, title, description, align = 'start' }: Props) {
  return (
    <header className={`sec-head sec-head--${align} reveal`}>
      <p className="eyebrow">
        <span className="mono">{pad2(index)}</span>
        {eyebrow}
      </p>
      <h2 className="sec-head__title">{title}</h2>
      {description && <p className="sec-head__desc">{description}</p>}
    </header>
  );
}
