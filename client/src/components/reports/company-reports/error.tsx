interface Props {
  message?: string;
}
export const Error: React.FC<Props> = ({ message }) => (
  <div className="text-center py-10 text-red-500">{message || "Error loading data"}</div>
);
