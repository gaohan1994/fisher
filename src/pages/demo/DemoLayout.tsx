import { FC, PropsWithChildren } from 'react';

interface DemoLayoutProps {
  title?: string;
  desc?: string | string[];
}

export const DemoLayout: FC<PropsWithChildren<DemoLayoutProps>> = ({
  title,
  desc,
  children,
}) => (
  <div style={{ padding: 8 }}>
    {title && <h3>{title}</h3>}
    {desc &&
      (typeof desc === 'string' ? (
        <span>{desc}</span>
      ) : (
        desc.map((item, index) => <span key={index}>{item}</span>)
      ))}
    {children}
  </div>
);
