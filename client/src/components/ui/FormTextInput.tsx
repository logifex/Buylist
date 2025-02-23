import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const FormTextInput = ({ label, ...props }: Props) => {
  let className: React.HTMLAttributes<HTMLInputElement>["className"] =
    "w-full p-2 rounded-md bg-gray-300 text-gray-700 placeholder-gray-600 dark:bg-dark-main-700 dark:text-gray-100 dark:placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4";

  if (label) {
    className += " block pt-7";
  }
  if (props.className) {
    className += ` ${props.className}`;
  }

  const input = <input className={className} {...props} />;

  return label ? (
    <div className="relative">
      {input}
      <label
        htmlFor={props.id}
        className="absolute top-1 start-2 text-gray-600 dark:text-gray-300 font-bold"
      >
        {label}
      </label>
    </div>
  ) : (
    input
  );
};

export default FormTextInput;
