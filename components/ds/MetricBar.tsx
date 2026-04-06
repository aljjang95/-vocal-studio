import s from './MetricBar.module.css';

interface Props {
  label: string;
  value: number;
  color?: string;
}

export default function MetricBar({ label, value, color = 'var(--accent)' }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={s.metric}>
      <div className={s.header}>
        <span className={s.label}>{label}</span>
        <span className={s.value}>{Math.round(value)}</span>
      </div>
      <div className={s.bar}>
        <div className={s.fill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
