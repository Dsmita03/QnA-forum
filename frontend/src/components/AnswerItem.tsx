interface Props {
  index: number;
  content: string;
}

export default function AnswerItem({ index, content }: Props) {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Answer {index}</h3>
      <p>{content}</p>
    </div>
  );
}
