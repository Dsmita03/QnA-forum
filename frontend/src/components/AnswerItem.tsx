interface Props {
  index: number;
  content: string;
}

export default function AnswerItem({ index, content }: Props) {
  return (
    <div className="border border-orange-100 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          📝 Answer {index}
        </h3>
        <span className="text-sm text-orange-600 font-medium">#{index}</span>
      </div>

      <p className="text-gray-700 leading-relaxed">{content}</p>
    </div>
  );
}
