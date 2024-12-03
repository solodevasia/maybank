interface Props {
  id: string;
  type: "button" | "submit" | "reset";
  classes?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactElement;
}

export function Button({ children, ...props }: Props) {
  return (
    <button
      id={props.id}
      data-testid={props.id}
      type={props.type}
      className={`w-[364px] h-[52px] bg-[#1C1C1C] text-[#FFFFFF] rounded-[13px] font-poppins font-bold text-[12px] relative ${props.classes} ${props.disabled ? "text-disabled bg-disabled cursor-no-drop" : ""}`}
      onClick={props.disabled ? undefined : props.onClick}
    >
      {children}
      {props.loading ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="loader"></div>
        </div>
      ) : null}
    </button>
  );
}
