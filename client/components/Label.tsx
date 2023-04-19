export const Label = ({
  title,
  style,
  subtitle,
  children,
  className,
  required = false,
}: {
  title?: string;
  required?: boolean;
  className?: string;
  children?: JSX.Element;
  style?: React.CSSProperties;
  subtitle?: string | JSX.Element | null;
}) => {
  return (
    <>
      <label style={style} className={className}>
        {title ? (
          <span className="inline-block mb-3 text-blue-1000">
            {title}
            {required ? <span className="text-red-500">*</span> : null}
          </span>
        ) : null}
        {subtitle ? <div className="mb-2.5">{subtitle}</div> : null}
        <div>{children}</div>
      </label>
    </>
  );
};
