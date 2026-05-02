export const Input = ({ ...props }) => {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-md bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
};
