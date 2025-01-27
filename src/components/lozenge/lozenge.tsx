import { PropsWithChildren } from "react";
import "./lozenge.scss";

export const Lozenge = ({
  color,
  children,
}: {
  color: string;
} & PropsWithChildren) => {
  return (
    <span className="lozenge" style={{ background: color }}>
      {children}
    </span>
  );
};
