interface Props {
  errorMessage?: string;
}

const FormErrorMessage = ({ errorMessage }: Props) => {
  return (
    errorMessage && (
      <p className="text-red-500 text-center mb-2">{errorMessage}</p>
    )
  );
};

export default FormErrorMessage;
