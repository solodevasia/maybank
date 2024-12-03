interface Props {
  id: string;
  name: string;
  type: "text" | "email" | "password" | "number";
  disabled?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactElement;
}

export default function Input(props: Props) {
  return (
    <div className="w-[364px] bg-[#f4f4f4] rounded-[13px] h-[52px] flex items-center px-4">
      {props.icon ? props.icon : null}
      <input
        id={props.id}
        data-testid={props.id}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
        className="w-full outline-none border-none bg-transparent text-[12px] text-poppins text-[#1C1C1C] placeholder-[#1C1C1C]"
        disabled={props.disabled}
      />
    </div>
  );
}
